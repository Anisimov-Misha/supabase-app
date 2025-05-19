'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';

export default function TaskCard({ task }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    cursor: 'grab',
  };

  return (
    <Card ref={setNodeRef} {...listeners} {...attributes} sx={{ ...style }}>
      <CardContent>
        <Typography variant="subtitle1">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
