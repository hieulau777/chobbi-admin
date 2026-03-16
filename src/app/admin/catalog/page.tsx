"use client";

import { CategoryTree } from "./components/CategoryTree";
import { AttributesTable } from "./components/AttributesTable";
import { EditAttributeForm } from "./components/EditAttributeForm";
import { AttributeValuesManager } from "./components/AttributeValuesManager";
import { useCatalogAdmin } from "./hooks/useCatalogAdmin";

export default function CatalogPage() {
  const catalog = useCatalogAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Catalog Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Quản lý cây danh mục, attributes và attribute values cho toàn bộ sàn.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
        <CategoryTree
          categories={catalog.categories}
          loadingCategories={catalog.loadingCategories}
          selectedCategoryId={catalog.selectedCategoryId}
          setSelectedCategoryId={catalog.setSelectedCategoryId}
          setSelectedAttributeId={catalog.setSelectedAttributeId}
          newRootCategoryName={catalog.newRootCategoryName}
          setNewRootCategoryName={catalog.setNewRootCategoryName}
          newChildCategoryName={catalog.newChildCategoryName}
          setNewChildCategoryName={catalog.setNewChildCategoryName}
          editCategoryName={catalog.editCategoryName}
          setEditCategoryName={catalog.setEditCategoryName}
          createRootCategory={catalog.createRootCategory}
          createChildCategory={catalog.createChildCategory}
          updateCategory={catalog.updateCategory}
          deleteCategory={catalog.deleteCategory}
          createRootCategoryPending={catalog.createRootCategoryPending}
          createChildCategoryPending={catalog.createChildCategoryPending}
          updateCategoryPending={catalog.updateCategoryPending}
          deleteCategoryPending={catalog.deleteCategoryPending}
        />

        <div className="space-y-4">
          <AttributesTable
            selectedCategoryId={catalog.selectedCategoryId}
            attributes={catalog.attributes}
            loadingAttributes={catalog.loadingAttributes}
            newAttributeName={catalog.newAttributeName}
            setNewAttributeName={catalog.setNewAttributeName}
            newAttrRequired={catalog.newAttrRequired}
            setNewAttrRequired={catalog.setNewAttrRequired}
            newAttrCustom={catalog.newAttrCustom}
            setNewAttrCustom={catalog.setNewAttrCustom}
            newAttrMultiple={catalog.newAttrMultiple}
            setNewAttrMultiple={catalog.setNewAttrMultiple}
            createAttribute={catalog.createAttribute}
            createAttributePending={catalog.createAttributePending}
            selectedAttributeId={catalog.selectedAttributeId}
            setSelectedAttributeId={catalog.setSelectedAttributeId}
            setEditAttrName={catalog.setEditAttrName}
            setEditAttrRequired={catalog.setEditAttrRequired}
            setEditAttrCustom={catalog.setEditAttrCustom}
            setEditAttrMultiple={catalog.setEditAttrMultiple}
            setShowAttrEdit={catalog.setShowAttrEdit}
            deleteAttribute={catalog.deleteAttribute}
          />

          <EditAttributeForm
            selectedAttribute={catalog.selectedAttribute}
            showAttrEdit={catalog.showAttrEdit}
            editAttrName={catalog.editAttrName}
            setEditAttrName={catalog.setEditAttrName}
            editAttrRequired={catalog.editAttrRequired}
            setEditAttrRequired={catalog.setEditAttrRequired}
            editAttrCustom={catalog.editAttrCustom}
            setEditAttrCustom={catalog.setEditAttrCustom}
            editAttrMultiple={catalog.editAttrMultiple}
            setEditAttrMultiple={catalog.setEditAttrMultiple}
            updateAttribute={catalog.updateAttribute}
            updateAttributePending={catalog.updateAttributePending}
          />

          <AttributeValuesManager
            selectedAttributeId={catalog.selectedAttributeId}
            selectedAttribute={catalog.selectedAttribute}
            attributeValues={catalog.attributeValues}
            loadingValues={catalog.loadingValues}
            newAttributeValuesInput={catalog.newAttributeValuesInput}
            setNewAttributeValuesInput={catalog.setNewAttributeValuesInput}
            createAttributeValues={catalog.createAttributeValues}
            createAttributeValuesPending={catalog.createAttributeValuesPending}
            editingValueId={catalog.editingValueId}
            setEditingValueId={catalog.setEditingValueId}
            editingValueText={catalog.editingValueText}
            setEditingValueText={catalog.setEditingValueText}
            editingValueCustom={catalog.editingValueCustom}
            setEditingValueCustom={catalog.setEditingValueCustom}
            updateAttributeValue={catalog.updateAttributeValue}
            updateAttributeValuePending={catalog.updateAttributeValuePending}
            deleteAttributeValue={catalog.deleteAttributeValue}
          />
        </div>
      </div>
    </div>
  );
}


