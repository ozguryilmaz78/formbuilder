import { Box, TextField, Switch, FormControlLabel, Typography } from '@mui/material';
import { useFormStore } from '../../store/formStore';

export default function FormHeader() {
  const { currentForm, setCurrentForm, masterTableName, setMasterTableName, tables, addTable } = useFormStore();

  const handleFormNameChange = (name: string) => {
    setCurrentForm({ ...currentForm, name });
  };

  const handleDescriptionChange = (description: string) => {
    setCurrentForm({ ...currentForm, description });
  };

  const handleIsActiveChange = (isActive: boolean) => {
    setCurrentForm({ ...currentForm, isActive });
  };

  const handleMasterTableNameChange = (name: string) => {
    setMasterTableName(name);
    
    // Ensure master table exists
    const masterTable = tables.find((t) => t.isMaster);
    if (!masterTable) {
      // No master table exists, create one
      addTable(name, true);
    }
  };

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom>
        Form Bilgileri
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Form Adı"
          value={currentForm?.name || ''}
          onChange={(e) => handleFormNameChange(e.target.value)}
          size="small"
        />
        <TextField
          label="Açıklama"
          value={currentForm?.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          size="small"
          multiline
          rows={2}
        />
        <TextField
          label="Master Tablo Adı"
          value={masterTableName}
          onChange={(e) => handleMasterTableNameChange(e.target.value)}
          size="small"
        />
        <FormControlLabel
          control={
            <Switch
              checked={currentForm?.isActive ?? true}
              onChange={(e) => handleIsActiveChange(e.target.checked)}
            />
          }
          label="Aktif"
        />
      </Box>
    </Box>
  );
}

