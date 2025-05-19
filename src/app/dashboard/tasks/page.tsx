'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskColumn from '@/app/components/TaskColumn';
import TaskFormDialog from '@/app/components/TaskFormDialog';
import { Task, TaskStatus } from '@/app/types/app.model';
import { supabase } from '@/app/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.user) {
        setError('User not authenticated');
        setLoading(false);
        setTimeout(() => router.push('/'), 1000);
        return;
      }
      setUserId(data.session.user.id);
      setLoading(false);
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    async function fetchTasks() {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setTasks(data ?? []);
      }
      setLoading(false);
    }

    fetchTasks();
  }, [userId]);

  const handleAddTask = async (task: { title: string; description: string; status: TaskStatus }) => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: userId }])
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setTasks(prev => [...prev, data]);
      setOpenForm(false);
    }
    setLoading(false);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;

    if (draggedTask.status !== over.id) {
      setTasks(prev =>
        prev.map(task =>
          task.id === active.id ? { ...task, status: over.id } : task
        )
      );

      const { error } = await supabase
        .from('tasks')
        .update({ status: over.id })
        .eq('id', active.id);

      if (error) {
        setError(error.message);
      }
    }
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const columns: TaskStatus[] = ['todo', 'in_progress', 'done'];

  const statusLabels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  };

  if (loading) return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 4 }}>

      <Typography variant="h4" gutterBottom>
        <Link href="/dashboard" passHref>
          <Button variant="outlined" color="primary">
            На головну
          </Button>
        </Link>
      </Typography> <br />

      <Typography variant="h4" gutterBottom>Task Manager</Typography>

      <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ mb: 2 }}>
        Додати завдання
      </Button>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          {columns.map(column => (
            <SortableContext
              key={column}
              items={tasks.filter(t => t.status === column).map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <TaskColumn
                id={column}
                title={statusLabels[column]}
                tasks={tasks.filter(t => t.status === column)}
                onTaskClick={handleTaskClick}
              />
            </SortableContext>
          ))}
        </Box>
      </DndContext>

      <TaskFormDialog open={openForm} onClose={() => setOpenForm(false)} onSave={handleAddTask} />

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
            <DialogTitle>Інформація про задачу</DialogTitle>
            <DialogContent>
                {selectedTask && (
                <>
                    <Typography variant="h6">Назва: {selectedTask.title}</Typography>
                    <Typography>Опис: {selectedTask.description}</Typography>
                    <Typography>Статус: {statusLabels[selectedTask.status]}</Typography>
                </>
                )}
            </DialogContent>
        </Dialog>

    </Box>
  );
}
