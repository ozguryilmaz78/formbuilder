// pages/FormRenderer.tsx
import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import DetailRepeater from "../components/FormBuilder/DetailRepeater";
import { formsApi } from "../services/api";

export default function FormRenderer() {
  const [schema, setSchema] = useState<any>(null);
  const [master, setMaster] = useState<any>({});
  const [details, setDetails] = useState<any>({}); // tableName => rows[]

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const form = await formsApi.getById("id");          // backendden jsonSchema geliyor
    const s = JSON.parse(form.jsonSchema);
    setSchema(s);
  };

  const handleSubmit = () => {
    const result = {
      master,
      details,
    };
    console.log("SEND:", result);
    formsApi.submit(result);
  };

  if (!schema) return "Yükleniyor...";

  const masterTable = schema.tables.find((t) => t.isMaster);
  const detailTables = schema.tables.filter((t) => !t.isMaster);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">{schema.name}</Typography>

      <Paper sx={{ p: 2, mt: 2 }}>
        {masterTable.fields.map((f) => (
          <input
            key={f.fieldName}
            placeholder={f.label}
            onChange={(e) => setMaster({ ...master, [f.fieldName]: e.target.value })}
          />
        ))}
      </Paper>

      {detailTables.map((t) => (
        <Paper key={t.name} sx={{ p: 2, mt: 2 }}>
          <Typography fontWeight={600}>{t.name}</Typography>

          <DetailRepeater
            table={t}
            tables={schema.tables}
            onChange={(rows) =>
              setDetails((d) => ({ ...d, [t.name]: rows.map((x) => x.data) }))
            }
          />
        </Paper>
      ))}

      <Button onClick={handleSubmit} variant="contained" sx={{ mt: 3 }}>
        Kaydet
      </Button>
    </Box>
  );
}
