// components/form/DetailRepeater.tsx
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DetailRepeater({ table, tables, onChange }) {
  const [rows, setRows] = useState([{ id: Date.now(), data: {} }]);

  const updateRow = (rowId, field, value) => {
    const updated = rows.map((r) =>
      r.id === rowId ? { ...r, data: { ...r.data, [field]: value } } : r
    );
    setRows(updated);
    onChange(updated); // json render'ı yukarı aktar
  };

  return (
    <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
      {rows.map((row) => (
        <Box
          key={row.id}
          sx={{
            p: 2,
            mb: 1,
            border: "1px solid #ddd",
            borderRadius: 2,
            bgcolor: "#fff",
          }}
        >
          {table.fields.map((f) => {

            // CHILD DETAIL TABLE ise rekürsif render
            if (f.fieldType === "DetailTable") {
              const childTable = tables.find((t) => t.name === f.fieldName);
              return (
                <Box key={f.id} sx={{ mt: 2, ml: 2 }}>
                  <Typography fontWeight="600">{f.label}</Typography>
                  <DetailRepeater
                    table={childTable}
                    tables={tables}
                    onChange={(v) =>
                      updateRow(row.id, f.fieldName, v.map(x => x.data))
                    }
                  />
                </Box>
              );
            }

            return {
              TextField: (
                <TextField
                  key={f.id}
                  size="small"
                  label={f.label}
                  sx={{ mr: 2, mt: 1 }}
                  onChange={(e) => updateRow(row.id, f.fieldName, e.target.value)}
                />
              ),
              Number: (
                <TextField
                  key={f.id}
                  type="number"
                  label={f.label}
                  size="small"
                  sx={{ mr: 2, mt: 1 }}
                  onChange={(e) => updateRow(row.id, f.fieldName, Number(e.target.value))}
                />
              ),
              Date: (
                <TextField
                  key={f.id}
                  type="date"
                  label={f.label}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mr: 2, mt: 1 }}
                  onChange={(e) => updateRow(row.id, f.fieldName, e.target.value)}
                />
              ),
              Dropdown: (
                <FormControl key={f.id} size="small" sx={{ mr: 2, mt: 1 }}>
                  <InputLabel>{f.label}</InputLabel>
                  <Select
                    label={f.label}
                    onChange={(e) => updateRow(row.id, f.fieldName, e.target.value)}
                  >
                    {(f.dropdownOptions || []).map((o, i) => (
                      <MenuItem key={i} value={o.value || o}>
                        {o.label || o}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ),
              Checkbox: (
                <FormControlLabel
                  key={f.id}
                  label={f.label}
                  control={
                    <Checkbox
                      onChange={(e) => updateRow(row.id, f.fieldName, e.target.checked)}
                    />
                  }
                  sx={{ mt: 2 }}
                />
              ),
            }[f.fieldType];
          })}

          <IconButton sx={{ mt: 1 }} color="error" onClick={() => setRows(rows.filter(r => r.id!==row.id))}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button onClick={() => setRows([...rows,{id:Date.now(),data:{}}])}>
        + Satır Ekle
      </Button>
    </Box>
  );
}
