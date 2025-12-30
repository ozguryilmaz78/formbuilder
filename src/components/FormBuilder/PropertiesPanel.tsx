// src/components/FormBuilder/PropertiesPanel.tsx

import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Grid,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useFormStore } from "../../store/formStore";
import { FieldConfig } from "../../types";

export default function PropertiesPanel() {
  const {
    selectedField,
    tables,
    updateField,
    setSelectedField,
    updateDetailTableName,
  } = useFormStore();

  if (!selectedField) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">Bir alan seçin</Typography>
      </Box>
    );
  }

  // Hangi tabloda?
  const currentTable = tables.find((t) =>
    t.fields.some((f) => f.id === selectedField.id)
  );
  if (!currentTable) return null;

  const currentField =
    currentTable.fields.find((f) => f.id === selectedField.id) || selectedField;

  const handleUpdate = (updates: Partial<FieldConfig>) => {
    updateField(currentTable.name, currentField.id, updates);
  };

  /* ---------------- ALAN ADI / DETAY TABLO ADI ---------------- */
  const handleNameChange = (name: string) => {
    const old = currentField.fieldName;

    updateField(currentTable.name, currentField.id, {
      fieldName: name,
      label: currentField.label || name,
    });

    setSelectedField({ ...currentField, fieldName: name });

    // Eğer DetailTable ise alt tablo adını da değiştir
    if (currentField.fieldType === "DetailTable") {
      const detailTable = tables.find((t) => t.name === old);
      if (detailTable) {
        updateDetailTableName(old, name);
      }
    }
  };

  /* ---------------- SECİCİLERDE KURAL ----------------
     parent dropdown => currentField kendi ismini asla göstermez
     child dropdown  => kendi tablo adı listelenmez
  -----------------------------------------------------*/
  const parentOptions = tables.filter((t) => t.name !== currentTable.name);
  const childOptions = tables.filter((t) => t.name !== currentTable.name);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {currentField.fieldType === "DetailTable" ? "Detay Tablosu Özellikleri" : "Alan Özellikleri"}
      </Typography>

      <TextField
        fullWidth
        label={currentField.fieldType === "DetailTable" ? "Detay Tablosu Adı" : "Alan Adı"}
        value={currentField.fieldName}
        onChange={(e) => handleNameChange(e.target.value)}
        margin="normal"
        size="small"
      />

      <TextField
        fullWidth
        label="Etiket"
        value={currentField.label || ""}
        onChange={(e) => handleUpdate({ label: e.target.value })}
        margin="normal"
        size="small"
      />

      <TextField
        fullWidth
        label="Placeholder"
        value={currentField.placeholder || ""}
        onChange={(e) => handleUpdate({ placeholder: e.target.value })}
        margin="normal"
        size="small"
      />

      <FormControlLabel
        control={
          <Switch
            checked={currentField.required || false}
            onChange={(e) => handleUpdate({ required: e.target.checked })}
          />
        }
        label="Zorunlu"
        sx={{ mt: 1 }}
      />

      {/* DROPDOWN */}
      {currentField.fieldType === "Dropdown" && (
        <Box sx={{ mt: 2 }}>
          <Typography fontWeight="bold" mb={1}>Dropdown Seçenekleri</Typography>

          {(currentField.dropdownOptions || []).map((opt, i) => (
            <Paper key={i} sx={{ p: 1.5, mb: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth size="small" label="Label" value={opt.label}
                    onChange={(e) => {
                      const ops = [...(currentField.dropdownOptions||[])];
                      ops[i].label = e.target.value;
                      handleUpdate({ dropdownOptions: ops });
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth size="small" label="Value" value={opt.value}
                    onChange={(e) => {
                      const ops = [...(currentField.dropdownOptions||[])];
                      ops[i].value = e.target.value;
                      handleUpdate({ dropdownOptions: ops });
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={()=>{
                    handleUpdate({
                      dropdownOptions: (currentField.dropdownOptions||[]).filter((_,x)=>x!==i)
                    })
                  }}>
                    <DeleteIcon/>
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <IconButton color="primary" onClick={()=>{
            handleUpdate({
              dropdownOptions:[...(currentField.dropdownOptions||[]),{
                label:"Option",value:"option"
              }]
            })
          }}>
            <AddIcon/>
          </IconButton>
        </Box>
      )}

      {/* NUMBER SETTINGS */}
      {currentField.fieldType==="Number" && (
        <>
          <TextField
            fullWidth type="number" size="small" margin="normal"
            label="Min"
            value={currentField.validation?.min||""}
            onChange={(e)=>handleUpdate({
              validation:{...currentField.validation,min:e.target.value||undefined}
            })}
          />
          <TextField
            fullWidth type="number" size="small" margin="normal"
            label="Max"
            value={currentField.validation?.max||""}
            onChange={(e)=>handleUpdate({
              validation:{...currentField.validation,max:e.target.value||undefined}
            })}
          />
        </>
      )}

      {/* DETAIL RELATION */}
      {currentField.fieldType==="DetailTable" && (
        <Box sx={{mt:2}}>
          <Typography fontWeight="bold">İlişki Ayarları</Typography>

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Parent</InputLabel>
            <Select
              value={currentField.relation?.parentTable || ""}
              onChange={(e)=>handleUpdate({
                relation:{...currentField.relation, parentTable:e.target.value}
              })}
            >
              {parentOptions.map(t=>(
                <MenuItem key={t.name} value={t.name}>{t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Child</InputLabel>
            <Select
              value={currentField.relation?.childTable||""}
              onChange={(e)=>handleUpdate({
                relation:{...currentField.relation, childTable:e.target.value}
              })}
            >
              <MenuItem value=""><em>Boş</em></MenuItem>
              {childOptions.map(t=>(
                <MenuItem key={t.name} value={t.name}>{t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
