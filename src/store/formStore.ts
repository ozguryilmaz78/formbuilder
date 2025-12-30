// src/store/formStore.ts
import { create } from "zustand";
import { Form, FieldConfig } from "../types";

type TableModel = {
  name: string;
  isMaster: boolean;
  fields: FieldConfig[];
};

interface FormBuilderState {
  currentForm: Partial<Form> | null;
  masterTableName: string;
  tables: TableModel[];
  relations: {
    parentTable: string;
    childTable: string;
    type: "1-N" | "N-N";
    parentField: string;
    childField: string;
  }[];
  selectedField: FieldConfig | null;

  setCurrentForm: (form: Partial<Form> | null) => void;
  setMasterTableName: (name: string) => void;

  addTable: (name: string, isMaster: boolean) => void;
  removeTable: (name: string) => void;

  addField: (tableName: string, field: FieldConfig) => void;
  updateField: (tableName: string, fieldId: string, updates: Partial<FieldConfig>) => void;
  removeField: (tableName: string, fieldId: string) => void;
  moveField: (tableName: string, dragIndex: number, hoverIndex: number) => void;

  setSelectedField: (field: FieldConfig | null) => void;

  addRelation: (r: FormBuilderState["relations"][0]) => void;
  removeRelation: (index: number) => void;

  updateTableName: (oldName: string, newName: string) => void;
  updateDetailTableName: (oldName: string, newName: string) => void;

  reset: () => void;
}

export const useFormStore = create<FormBuilderState>((set, get) => ({
  currentForm: null,
  masterTableName: "",
  tables: [],
  relations: [],
  selectedField: null,

  setCurrentForm: (form) => set({ currentForm: form }),

  setMasterTableName: (name) => {
    const state = get();
    const master = state.tables.find((t) => t.isMaster);

    if (!master)
      return set({ masterTableName: name });

    get().updateTableName(master.name, name);
    set({ masterTableName: name });
  },

  /** ---------------- TABLOLAR ---------------- */
  addTable: (name, isMaster) =>
    set((state) => ({
      tables: [...state.tables, { name, isMaster, fields: [] }],
    })),

  removeTable: (name) =>
    set((state) => ({
      tables: state.tables.filter((t) => t.name !== name),
      relations: state.relations.filter(
        (r) => r.parentTable !== name && r.childTable !== name
      ),
    })),

  /** ---------------- ALAN EKLE ---------------- */
  addField: (tableName, field) => {
    const state = get();
    const table = state.tables.find((t) => t.name === tableName);
    if (!table) return;

    // DetailTable ekleniyorsa otomatik relation oluştur
    if (field.fieldType === "DetailTable") {
      const exists = state.tables.some((t) => t.name === field.fieldName);
      if (!exists) get().addTable(field.fieldName, false);
    }

    set({
      tables: state.tables.map((t) =>
        t.name === tableName
          ? { ...t, fields: [...t.fields, field] }
          : t
      ),
    });
  },

  /** ---------------- ALAN GÜNCELLE ---------------- */
  updateField: (tableName, fieldId, updates) =>
    set((state) => {
      const updated = state.tables.map((t) => {
        if (t.name !== tableName) return t;

        return {
          ...t,
          fields: t.fields.map((f) =>
            f.id === fieldId ? { ...f, ...updates } : f
          ),
        };
      });

      const selected = updated
        .find((t) => t.name === tableName)?.fields
        .find((f) => f.id === fieldId);

      return { tables: updated, selectedField: selected || null };
    }),

  removeField: (tableName, fieldId) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.name === tableName
          ? { ...t, fields: t.fields.filter((f) => f.id !== fieldId) }
          : t
      ),
    })),

  moveField: (tableName, dragIndex, hoverIndex) =>
    set((state) => ({
      tables: state.tables.map((t) => {
        if (t.name !== tableName) return t;
        const f = [...t.fields];
        const [moved] = f.splice(dragIndex, 1);
        f.splice(hoverIndex, 0, moved);
        return { ...t, fields: f };
      }),
    })),

  setSelectedField: (field) => set({ selectedField: field }),

  addRelation: (r) =>
    set((state) => ({
      relations: state.relations.some(
        x => x.parentTable===r.parentTable && x.childTable===r.childTable
      )
        ? state.relations
        : [...state.relations, r]
    })),

  removeRelation: (i) =>
    set((state) => ({
      relations: state.relations.filter((_,x)=>x!==i)
    })),

  /** ---------------- TABLO ADI DEĞİŞTİRME ---------------- */
  updateTableName(oldName,newName){
    const state = get();

    set({
      tables: state.tables.map(t =>
        t.name===oldName ? {...t,name:newName} : t
      ),
      relations: state.relations.map(r => ({
        ...r,
        parentTable: r.parentTable===oldName ? newName : r.parentTable,
        childTable: r.childTable===oldName ? newName : r.childTable
      }))
    });
  },

  updateDetailTableName(oldName,newName){
    const state = get();
    get().updateTableName(oldName,newName);

    // Field içindeki relationları da güncelle
    set({
      tables: state.tables.map(t => ({
        ...t,
        fields: t.fields.map(f =>
          f.relation && f.relation.childTable===oldName
            ? {...f,relation:{...f.relation,childTable:newName}}
            : f
        )
      }))
    });
  },

  reset: () => set({ tables:[], relations:[], selectedField:null })
}));
