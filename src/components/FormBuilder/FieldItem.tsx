import { Box, IconButton, Typography, Paper } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import { useDrag } from 'react-dnd';
import { useFormStore } from '../../store/formStore';
import { FieldConfig } from '../../types';

interface FieldItemProps {
  field: FieldConfig;
  tableName: string;
  index: number;
}

export default function FieldItem({ field, tableName, index }: FieldItemProps) {
  const { setSelectedField, removeField } = useFormStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: { fieldId: field.id, index, tableName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [field.id, index, tableName]);

  const handleSelect = () => {
    setSelectedField(field);
  };

  const handleDelete = () => {
    removeField(tableName, field.id);
  };

  return (
    <Paper
      ref={drag}
      sx={{
        p: 1.5,
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
      onClick={handleSelect}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {field.label || field.fieldName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {field.fieldType}
          </Typography>
        </Box>
      </Box>
      <Box>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleSelect(); }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

