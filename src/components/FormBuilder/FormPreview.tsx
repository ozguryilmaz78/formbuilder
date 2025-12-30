// components/form/FormPreview.tsx
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useFormStore } from "../../store/formStore";
import DetailRepeater from "./DetailRepeater";

export default function FormPreview() {
  const { tables } = useFormStore();
  const master = tables.find((t) => t.isMaster);

  if (!master) return <Typography>Master tablo yok.</Typography>;

  const renderField = (f) => {
    if (f.fieldType === "DetailTable") {
      const dt = tables.find((t) => t.name === f.fieldName);
      return (
        <Box key={f.id} sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography fontWeight={600}>{f.label}</Typography>
          <DetailRepeater table={dt} tables={tables} onChange={()=>{}} />
        </Box>
      );
    }

    return (
      <TextField
        key={f.id}
        fullWidth
        size="small"
        margin="dense"
        label={f.label}
      />
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Form Önizleme</Typography>
      {master.fields.map(renderField)}
    </Box>
  );
}
