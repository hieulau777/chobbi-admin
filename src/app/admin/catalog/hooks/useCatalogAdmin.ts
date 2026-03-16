import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { backendFetch } from "@/lib/api";
import {
  AdminAttribute,
  AdminAttributeType,
  AdminAttributeValue,
  AdminCategory,
  SelectedAttribute,
} from "../types";

export const useCatalogAdmin = () => {
  const queryClient = useQueryClient();

  // ===== Category state =====
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);
  const [newRootCategoryName, setNewRootCategoryName] = useState("");
  const [newChildCategoryName, setNewChildCategoryName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");

  // ===== Attribute state =====
  const [selectedAttributeId, setSelectedAttributeId] =
    useState<number | null>(null);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttrRequired, setNewAttrRequired] = useState(false);
  const [newAttrCustom, setNewAttrCustom] = useState(true);
  const [newAttrMultiple, setNewAttrMultiple] = useState(false);
  const [newAttrType, setNewAttrType] =
    useState<AdminAttributeType>("TEXT");

  const [showAttrEdit, setShowAttrEdit] = useState(false);
  const [editAttrName, setEditAttrName] = useState("");
  const [editAttrRequired, setEditAttrRequired] = useState(false);
  const [editAttrCustom, setEditAttrCustom] = useState(false);
  const [editAttrMultiple, setEditAttrMultiple] = useState(false);

  // ===== Attribute values state =====
  const [newAttributeValuesInput, setNewAttributeValuesInput] = useState("");
  const [editingValueId, setEditingValueId] = useState<number | null>(null);
  const [editingValueText, setEditingValueText] = useState("");
  const [editingValueCustom, setEditingValueCustom] = useState(false);

  // ===== Queries =====

  const {
    data: categories,
    isLoading: loadingCategories,
  } = useQuery<AdminCategory[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await backendFetch("/admin/catalog/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      return res.json();
    },
  });

  const {
    data: attributes,
    isLoading: loadingAttributes,
  } = useQuery<AdminAttribute[]>({
    queryKey: ["admin-attributes", selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) return [];
      const res = await backendFetch(
        `/admin/catalog/categories/${selectedCategoryId}/attributes`
      );
      if (!res.ok) throw new Error("Failed to load attributes");
      return res.json();
    },
    enabled: !!selectedCategoryId,
  });

  const {
    data: attributeValues,
    isLoading: loadingValues,
  } = useQuery<AdminAttributeValue[]>({
    queryKey: ["admin-attribute-values", selectedAttributeId],
    queryFn: async () => {
      if (!selectedAttributeId) return [];
      const res = await backendFetch(
        `/admin/catalog/attributes/${selectedAttributeId}/values`
      );
      if (!res.ok) throw new Error("Failed to load attribute values");
      return res.json();
    },
    enabled: !!selectedAttributeId,
  });

  const selectedAttribute: SelectedAttribute =
    attributes?.find((a) => a.id === selectedAttributeId) ?? null;

  // ===== Category mutations =====

  const createRootCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!newRootCategoryName.trim()) return;
      const res = await backendFetch("/admin/catalog/categories", {
        method: "POST",
        body: JSON.stringify({
          name: newRootCategoryName.trim(),
          parentId: null,
        }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to create root category");
      }
      return res.json();
    },
    onSuccess: () => {
      setNewRootCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const createChildCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCategoryId || !newChildCategoryName.trim()) return;
      const res = await backendFetch("/admin/catalog/categories", {
        method: "POST",
        body: JSON.stringify({
          name: newChildCategoryName.trim(),
          parentId: selectedCategoryId,
        }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to create child category");
      }
      return res.json();
    },
    onSuccess: () => {
      setNewChildCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCategoryId || !categories) return;
      const current = categories.find((c) => c.id === selectedCategoryId);
      if (!current) return;
      const res = await backendFetch(
        `/admin/catalog/categories/${selectedCategoryId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editCategoryName.trim() || current.name,
            parentId: current.parentId,
          }),
        }
      );
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to update category");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      const res = await backendFetch(
        `/admin/catalog/categories/${categoryId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to delete category");
      }
    },
    onSuccess: () => {
      setSelectedCategoryId(null);
      setSelectedAttributeId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const createRootCategory = () => {
    createRootCategoryMutation.mutate();
  };

  const createChildCategory = () => {
    createChildCategoryMutation.mutate();
  };

  const updateCategory = async () => {
    try {
      await updateCategoryMutation.mutateAsync();
    } catch (e) {
      const err = e as Error;
      window.alert(err.message);
    }
  };

  const deleteCategory = async () => {
    if (!selectedCategoryId) return;
    try {
      await deleteCategoryMutation.mutateAsync(selectedCategoryId);
    } catch (e) {
      const err = e as Error;
      window.alert(err.message);
    }
  };

  // ===== Attribute mutations =====

  const createAttributeMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCategoryId || !newAttributeName.trim()) return;
      const res = await backendFetch(
        `/admin/catalog/categories/${selectedCategoryId}/attributes`,
        {
          method: "POST",
          body: JSON.stringify({
            name: newAttributeName.trim(),
            isRequired: newAttrRequired,
            isCustomAllow: newAttrCustom,
            isMultipleAllow: newAttrMultiple,
            type: newAttrType,
          }),
        }
      );
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to create attribute");
      }
      return res.json();
    },
    onSuccess: () => {
      setNewAttributeName("");
      setNewAttrRequired(false);
      setNewAttrCustom(true);
      setNewAttrMultiple(false);
      setNewAttrType("TEXT");
      queryClient.invalidateQueries({
        queryKey: ["admin-attributes", selectedCategoryId],
      });
    },
  });

  const updateAttributeMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAttribute || !selectedCategoryId) return;
      const res = await backendFetch(
        `/admin/catalog/attributes/${selectedAttribute.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editAttrName.trim() || selectedAttribute.name,
            isRequired: editAttrRequired,
            isCustomAllow: editAttrCustom,
            isMultipleAllow: editAttrMultiple,
            type: selectedAttribute.type,
          }),
        }
      );
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to update attribute");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-attributes", selectedCategoryId],
      });
    },
  });

  const deleteAttributeMutation = useMutation({
    mutationFn: async (attributeId: number) => {
      const res = await backendFetch(
        `/admin/catalog/attributes/${attributeId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to delete attribute");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-attributes", selectedCategoryId],
      });
      setSelectedAttributeId(null);
      setShowAttrEdit(false);
    },
  });

  const createAttribute = () => {
    createAttributeMutation.mutate();
  };

  const updateAttribute = () => {
    updateAttributeMutation.mutate();
  };

  const deleteAttribute = (attributeId: number) => {
    deleteAttributeMutation.mutate(attributeId);
  };

  // ===== Attribute value mutations =====

  const createAttributeValuesMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAttributeId || !newAttributeValuesInput.trim()) return;
      const parts = newAttributeValuesInput
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      for (const value of parts) {
        // eslint-disable-next-line no-await-in-loop
        const res = await backendFetch(
          `/admin/catalog/attributes/${selectedAttributeId}/values`,
          {
            method: "POST",
            body: JSON.stringify({
              isCustom: false,
              valueText: value,
              valueNumber: null,
              valueBoolean: null,
              valueDate: null,
            }),
          }
        );
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || "Failed to create attribute value");
        }
      }
    },
    onSuccess: () => {
      setNewAttributeValuesInput("");
      queryClient.invalidateQueries({
        queryKey: ["admin-attribute-values", selectedAttributeId],
      });
    },
  });

  const updateAttributeValueMutation = useMutation({
    mutationFn: async () => {
      if (!editingValueId || !selectedAttributeId) return;
      const res = await backendFetch(
        `/admin/catalog/attribute-values/${editingValueId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            isCustom: editingValueCustom,
            valueText: editingValueText,
            valueNumber: null,
            valueBoolean: null,
            valueDate: null,
          }),
        }
      );
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to update attribute value");
      }
      return res.json();
    },
    onSuccess: () => {
      setEditingValueId(null);
      setEditingValueText("");
      queryClient.invalidateQueries({
        queryKey: ["admin-attribute-values", selectedAttributeId],
      });
    },
  });

  const deleteAttributeValueMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await backendFetch(
        `/admin/catalog/attribute-values/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to delete attribute value");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-attribute-values", selectedAttributeId],
      });
    },
  });

  const createAttributeValues = () => {
    createAttributeValuesMutation.mutate();
  };

  const updateAttributeValue = () => {
    updateAttributeValueMutation.mutate();
  };

  const deleteAttributeValue = (id: number) => {
    deleteAttributeValueMutation.mutate(id);
  };

  return {
    // category data
    categories,
    loadingCategories,
    selectedCategoryId,
    setSelectedCategoryId,
    newRootCategoryName,
    setNewRootCategoryName,
    newChildCategoryName,
    setNewChildCategoryName,
    editCategoryName,
    setEditCategoryName,
    createRootCategory,
    createChildCategory,
    updateCategory,
    deleteCategory,
    createRootCategoryPending: createRootCategoryMutation.isPending,
    createChildCategoryPending: createChildCategoryMutation.isPending,
    updateCategoryPending: updateCategoryMutation.isPending,
    deleteCategoryPending: deleteCategoryMutation.isPending,

    // attribute data
    attributes,
    loadingAttributes,
    selectedAttributeId,
    setSelectedAttributeId,
    newAttributeName,
    setNewAttributeName,
    newAttrRequired,
    setNewAttrRequired,
    newAttrCustom,
    setNewAttrCustom,
    newAttrMultiple,
    setNewAttrMultiple,
    showAttrEdit,
    setShowAttrEdit,
    editAttrName,
    setEditAttrName,
    editAttrRequired,
    setEditAttrRequired,
    editAttrCustom,
    setEditAttrCustom,
    editAttrMultiple,
    setEditAttrMultiple,
    selectedAttribute,
    newAttrType,
    setNewAttrType,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    createAttributePending: createAttributeMutation.isPending,
    updateAttributePending: updateAttributeMutation.isPending,
    deleteAttributePending: deleteAttributeMutation.isPending,

    // attribute values data
    attributeValues,
    loadingValues,
    newAttributeValuesInput,
    setNewAttributeValuesInput,
    editingValueId,
    setEditingValueId,
    editingValueText,
    setEditingValueText,
    editingValueCustom,
    setEditingValueCustom,
    createAttributeValues,
    updateAttributeValue,
    deleteAttributeValue,
    createAttributeValuesPending: createAttributeValuesMutation.isPending,
    updateAttributeValuePending: updateAttributeValueMutation.isPending,
    deleteAttributeValuePending: deleteAttributeValueMutation.isPending,
  };
};

