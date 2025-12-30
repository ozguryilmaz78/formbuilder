import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import { Save as SaveIcon, Preview as PreviewIcon } from '@mui/icons-material';
import { useFormStore } from '../store/formStore';
import { formsApi } from '../services/api';
import FormHeader from '../components/FormBuilder/FormHeader';
import ComponentPalette from '../components/FormBuilder/ComponentPalette';
import FormCanvas from '../components/FormBuilder/FormCanvas';
import PropertiesPanel from '../components/FormBuilder/PropertiesPanel';
import FormPreview from '../components/FormBuilder/FormPreview';

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentForm,
    tables,
    relations,
    masterTableName,
    reset,
    setCurrentForm,
    addTable,
  } = useFormStore();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm(id);
    } else {
      reset();
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    try {
      const form = await formsApi.getById(formId);
      setCurrentForm(form);
      // Load tables and relations from form data
      // This would need to parse the JsonSchema and RelationSchema
    } catch (error) {
      console.error('Form yüklenemedi:', error);
    }
  };

  const handleSave = async () => {
    if (!currentForm?.name || tables.length === 0) {
      alert('Form adı ve en az bir tablo gereklidir');
      return;
    }

    setSaving(true);
    try {
      const jsonSchema = JSON.stringify({
        masterTable: masterTableName,
        tables: tables.map((t) => ({
          name: t.name,
          isMaster: t.isMaster,
          fields: t.fields.map((f) => ({
            fieldName: f.fieldName,
            fieldType: f.fieldType,
            label: f.label,
            placeholder: f.placeholder,
            required: f.required,
            validation: f.validation,
            dropdownOptions: f.dropdownOptions,
          })),
        })),
      });

      const relationSchema = JSON.stringify(relations);

      const formData = {
        form: {
          name: currentForm.name,
          description: currentForm.description,
          isActive: currentForm.isActive ?? true,
          jsonSchema,
          relationSchema,
        },
        tables: tables.map((t) => ({
          name: t.name,
          isMaster: t.isMaster,
          fields: t.fields.map((f) => ({
            fieldName: f.fieldName,
            fieldType: f.fieldType,
            isPrimaryKey: f.id === `${t.name}_id`,
            isForeignKey: f.relation !== undefined,
            referenceTableName: f.relation?.parentTable,
            referenceFieldName: f.relation?.parentField,
          })),
        })),
        relations: relations.map((r) => ({
          parentTable: r.parentTable,
          childTable: r.childTable,
          type: r.type,
          parentField: r.parentField,
          childField: r.childField,
        })),
      };

      if (id) {
        await formsApi.update(id, formData);
      } else {
        await formsApi.create(formData);
      }

      navigate('/forms');
    } catch (error: any) {
      alert('Kayıt başarısız: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <FormHeader />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
          <ComponentPalette />
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <FormCanvas />
        </Box>

        <Box sx={{ width: 300, borderLeft: 1, borderColor: 'divider', overflow: 'auto' }}>
          <PropertiesPanel />
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<PreviewIcon />}
          onClick={() => setPreviewOpen(true)}
        >
          Önizleme
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Box>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Form Önizleme</DialogTitle>
        <DialogContent>
          <FormPreview />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


