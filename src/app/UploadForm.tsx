'use client'
import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Input,
  ImageList,
  ImageListItem,
} from '@mui/material'
import { supabase } from './client'
import { UploadedFile, UploadFormProps } from './types/app.model'

export default function UploadForm({ open, onClose }: UploadFormProps) {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!open) {
      setFiles(null)
      setMessage('')
      setUploading(false)
    }
  }, [open])

  const handleUpload = async () => {
    if (!files || files.length === 0) return

    setUploading(true)
    setMessage('')

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setMessage('Помилка авторизації')
        setUploading(false)
        return
      }

      const uploaded: UploadedFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const filePath = `user-${user.id}/${Date.now()}-${file.name}`

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, file)

        if (uploadError) {
          setMessage('Помилка завантаження: ' + uploadError.message)
          setUploading(false)
          return
        }

        const { error: dbError } = await supabase.from('photos').insert([
          {
            user_id: user.id,
            path: filePath,
          },
        ])

        if (dbError) {
          setMessage('Помилка збереження у базі: ' + dbError.message)
          setUploading(false)
          return
        }

        const { data } = supabase.storage.from('uploads').getPublicUrl(filePath)

        uploaded.push({ url: data.publicUrl, name: file.name })
      }

      setUploadedFiles((prev) => [...prev, ...uploaded])
      setMessage('✅ Фото завантажено')
      setFiles(null)
      onClose()
    } catch (error: any) {
      setMessage('Невідома помилка: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    async function fetchUploadedFiles() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage('Помилка авторизації');
        return;
      }

      const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select('path')
        .eq('user_id', user.id);

      if (photosError) {
        setMessage('Помилка завантаження фото: ' + photosError.message);
        return;
      }

      const uploaded = photos.map((photo) => {
        const { data } = supabase.storage.from('uploads').getPublicUrl(photo.path);
        return { url: data.publicUrl, name: photo.path.split('/').pop() ?? '' };
      });

      setUploadedFiles(uploaded);
    }

    fetchUploadedFiles();
  }, []);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Завантажити зображення</DialogTitle>
        <DialogContent>
          <Input
            type="file"
            inputProps={{ accept: 'image/*', multiple: true }}
            onChange={(e) => {
              const target = e.target as HTMLInputElement
              if (target.files) {
                setFiles(target.files)
              }
            }}
            disabled={uploading}
            fullWidth
          />
          {message && (
            <Typography
              color={message.startsWith('✅') ? 'primary' : 'error'}
              sx={{ mt: 2 }}
            >
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={uploading}>
            Скасувати
          </Button>
          <Button onClick={handleUpload} disabled={!files || uploading}>
            {uploading ? 'Завантаження...' : 'Завантажити'}
          </Button>
        </DialogActions>
      </Dialog>

      {uploadedFiles.length > 0 && (
        <ImageList sx={{ width: '100%', marginTop: 3 }} cols={5} gap={12}>
          {uploadedFiles.map((file, index) => (
            <ImageListItem key={index}>
              <img
                src={file.url}
                alt={file.name}
                loading="lazy"
                style={{ borderRadius: 8 }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </>
  )
}
