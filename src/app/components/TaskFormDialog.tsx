'use client';

import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem
} from '@mui/material';

export default function TaskFormDialog({ open, onClose, onSave }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');

  const handleSubmit = () => {
    if (title.trim()) {
      onSave({ title, description, status });
      setTitle('');
      setDescription('');
      setStatus('todo');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Нове завдання</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth label="Заголовок" margin="dense"
          value={title} onChange={e => setTitle(e.target.value)}
        />
        <TextField
          fullWidth label="Опис" margin="dense"
          value={description} multiline rows={4}
          onChange={e => setDescription(e.target.value)}
        />
        <TextField
          select fullWidth label="Статус" margin="dense"
          value={status} onChange={e => setStatus(e.target.value)}
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={handleSubmit} variant="contained">Зберегти</Button>
      </DialogActions>
    </Dialog>
  );
}
