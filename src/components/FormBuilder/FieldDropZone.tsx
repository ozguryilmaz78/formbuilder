import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';
import { useFormStore } from '../../store/formStore';

interface FieldDropZoneProps {
  tableName: string;
  index: number;
}

export default function FieldDropZone({ tableName, index }: FieldDropZoneProps) {
  const { moveField } = useFormStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'field',
    drop: (item: { fieldId: string; index: number; tableName: string }) => {
      if (item.tableName !== tableName) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't do anything if dropping on itself
      if (dragIndex === hoverIndex || dragIndex === hoverIndex - 1) return;
      
      // Calculate the target index
      let targetIndex = hoverIndex;
      if (dragIndex < hoverIndex) {
        targetIndex = hoverIndex - 1;
      }
      
      moveField(tableName, dragIndex, targetIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [tableName, index, moveField]);

  return (
    <Box
      ref={drop}
      sx={{
        height: isOver ? '4px' : '2px',
        bgcolor: isOver ? 'primary.main' : 'transparent',
        transition: 'all 0.2s',
        my: 0.5,
      }}
    />
  );
}

