export type AdminCategory = {
  id: number;
  name: string;
  parentId: number | null;
};

export type AdminAttributeType = "TEXT" | "NUMBER" | "BOOLEAN" | "DATE";

export type AdminAttribute = {
  id: number;
  categoryId: number;
  name: string;
  isRequired: boolean;
  isCustomAllow: boolean;
  isMultipleAllow: boolean;
  type: AdminAttributeType;
};

export type AdminAttributeValue = {
  id: number;
  attributeId: number;
  isCustom: boolean;
  valueText: string | null;
  valueNumber: number | null;
  valueBoolean: boolean | null;
  valueDate: string | null;
};

export type SelectedAttribute = AdminAttribute | null;

