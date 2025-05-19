'use client';
import { useDraggable } from '@dnd-kit/core';
import { Card, Typography, IconButton, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function SortableTask({ task, onClick }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  return (
    <Card
      ref={setNodeRef}
      sx={{
        mb: 1,
        p: 2,
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition: 'transform 200ms ease',
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box {...attributes} {...listeners} sx={{ flex: 1 }}>
        <Typography variant="subtitle1">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
      </Box>

      <IconButton onClick={(e) => {
        e.stopPropagation(); 
        onClick?.(task);
      }} sx={{ ml: 1 }}>
        <VisibilityIcon />
      </IconButton>
    </Card>
  );
}
