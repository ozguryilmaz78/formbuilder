// src/components/FormBuilder/FormCanvas.tsx

import { Box, Typography, Paper } from "@mui/material";
import { useDrop } from "react-dnd";
import { useCallback } from "react";
import { useFormStore } from "../../store/formStore";
import FieldItem from "./FieldItem";
import FieldDropZone from "./FieldDropZone";
import { FieldConfig } from "../../types";

interface TableDropZoneProps {
  tableName: string;
  isMaster: boolean;
}

function TableDropZone({ tableName, isMaster }: TableDropZoneProps) {
  const { tables } = useFormStore();
  const table = tables.find((t) => t.name === tableName);
  const fields = table?.fields || [];

  const handleComponentDrop = useCallback(
    (item: { componentType: string }) => {
      const state = useFormStore.getState();
      const currentTable = state.tables.find((t) => t.name === tableName);
      if (!currentTable) return;

      // ----------------------------- Detail Table EKLEME ----------------------------
      if (item.componentType === "DetailTable") {
        const id = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const newTableName = `Detail_${id}`;

        // alt tabloyu oluştur
        state.addTable(newTableName, false);

        // sadece bulunduğu tablo -> parent, yeni tablo -> child olacak!
        const newField: FieldConfig = {
          id: `field_${id}`,
          fieldName: newTableName,
          fieldType: "DetailTable",
          label: newTableName,
          required: false,
          relation: {
            parentTable: currentTable.name,
            childTable: newTableName,
            type: "1-N",
            parentField: "",
            childField: "",
          },
        };

        state.addField(tableName, newField);
        state.setSelectedField(newField);
        return;
      }

      // ----------------------------- Normal Bileşenler ----------------------------
      const newField: FieldConfig = {
        id: `field-${Date.now()}`,
        fieldName: `field_${fields.length + 1}`,
        fieldType: item.componentType as any,
        label: item.componentType,
        required: false,
      };

      state.addField(tableName, newField);
      state.setSelectedField(newField);
    },
    [tableName, fields.length]
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: handleComponentDrop,
    collect: (m) => ({ isOver: m.isOver() }),
  }));

  return (
    <Paper
      ref={drop}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: isMaster ? "primary.light" : "background.paper",
        color: isMaster ? "white" : "text.primary",
        border: isOver ? "2px dashed" : "1px solid",
        borderColor: isOver ? "primary.main" : "divider",
      }}
    >
      <Typography variant="subtitle1">{tableName} ({isMaster?"Master":"Detail"})</Typography>

      {fields.map((f, i) => (
        <Box key={f.id}>
          <FieldItem field={f} tableName={tableName} index={i}/>
          <FieldDropZone tableName={tableName} index={i+1}/>
        </Box>
      ))}

      {fields.length === 0 && (
        <Typography sx={{opacity:.7,textAlign:"center",py:2}}>
          Bileşen Sürükle ve Bırak
        </Typography>
      )}
    </Paper>
  );
}

// ------------------------ Detay tablolar render kısmı DÜZELTİLDİ ------------------------
// Aynı tablonun kendisini veya alt çocuğunu tekrar göstermemesi için

export default function FormCanvas() {
  const { tables } = useFormStore();
  const master = tables.find(t=>t.isMaster);

  return (
    <Box sx={{p:2}}>
      <Typography variant="h6">Form Tasarımı</Typography>

      {master && <TableDropZone tableName={master.name} isMaster />}

      {tables
        .filter(t=>!t.isMaster)
        .filter((t,i,self)=>i===self.findIndex(x=>x.name===t.name)) // çift tabloyu engelle
        .map(t=>(
          <Box key={t.name} sx={{ml:3,borderLeft:"2px solid #ddd",pl:2}}>
            <TableDropZone tableName={t.name} isMaster={false}/>
          </Box>
        ))
      }
    </Box>
  );
}
