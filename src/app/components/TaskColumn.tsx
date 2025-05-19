'use client';
import { useDroppable } from '@dnd-kit/core';
import { Box, Typography } from '@mui/material';
import SortableTask from './SortableTask';
import { TaskColumnProps } from '../types/app.model';

export default function TaskColumn({ id, title, tasks, onTaskClick }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minWidth: 300,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {tasks.map(task => (
        <SortableTask key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
      ))}
    </Box>
  );
}
