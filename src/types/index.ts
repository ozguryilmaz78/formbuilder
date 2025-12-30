export interface User {
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  jsonSchema: string;
  relationSchema?: string;
  createdAt: string;
  updatedAt: string;
  tables: FormTable[];
  relations: FormRelation[];
}

export interface FormTable {
  id: string;
  tableName: string;
  isMaster: boolean;
  fields: FormTableField[];
}

export interface FormTableField {
  id: string;
  fieldName: string;
  fieldType: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referenceTableId?: string;
  referenceFieldId?: string;
}

export interface FormRelation {
  id: string;
  parentTableName: string;
  childTableName: string;
  relationType: string;
  parentFieldName: string;
  childFieldName: string;
}

export interface CreateFormDto {
  form: {
    name: string;
    description?: string;
    isActive: boolean;
    jsonSchema: string;
    relationSchema?: string;
  };
  tables: {
    name: string;
    isMaster: boolean;
    fields: {
      fieldName: string;
      fieldType: string;
      isPrimaryKey: boolean;
      isForeignKey: boolean;
      referenceTableName?: string;
      referenceFieldName?: string;
    }[];
  }[];
  relations: {
    parentTable: string;
    childTable: string;
    type: string;
    parentField: string;
    childField: string;
  }[];
}

export interface FormSubmission {
  id: string;
  formId: string;
  submittedBy: string;
  submittedAt: string;
  dataJson: string;
}

export interface FieldConfig {
  id: string;
  fieldName: string;
  fieldType: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    regex?: string;
  };
  dropdownOptions?: Array<{ label: string; value: string }>;
  relation?: {
    parentTable?: string;
    childTable?: string;
    parentField?: string;
    childField?: string;
    type?: string;
  };
}

