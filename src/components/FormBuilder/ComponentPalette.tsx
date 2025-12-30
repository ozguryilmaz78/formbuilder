import { Box, Typography, Paper } from '@mui/material';
import { useDrag } from 'react-dnd';
import {
  TextFields as TextIcon,
  Numbers as NumberIcon,
  CalendarToday as DateIcon,
  ArrowDropDown as DropdownIcon,
  CheckBox as CheckboxIcon,
  AttachFile as FileIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';

interface DraggableComponentProps {
  type: string;
  label: string;
  icon: React.ReactNode;
}

function DraggableComponent({ type, label, icon }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { componentType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Paper
      ref={drag}
      sx={{
        p: 2,
        mb: 1,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      {icon}
      <Typography variant="body2">{label}</Typography>
    </Paper>
  );
}

export default function ComponentPalette() {
  const components = [
    { type: 'TextField', label: 'Metin', icon: <TextIcon /> },
    { type: 'Number', label: 'Sayı', icon: <NumberIcon /> },
    { type: 'Date', label: 'Tarih', icon: <DateIcon /> },
    { type: 'Dropdown', label: 'Seçim', icon: <DropdownIcon /> },
    { type: 'Checkbox', label: 'Onay Kutusu', icon: <CheckboxIcon /> },
    { type: 'File', label: 'Dosya', icon: <FileIcon /> },
    { type: 'DetailTable', label: 'Detay Tablo', icon: <TableIcon /> },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Bileşenler
      </Typography>
      {components.map((comp) => (
        <DraggableComponent
          key={comp.type}
          type={comp.type}
          label={comp.label}
          icon={comp.icon}
        />
      ))}
    </Box>
  );
}


