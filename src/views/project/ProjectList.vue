<template>
  <div class="project-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('project.name')">
        <el-input v-model="query.name" :placeholder="t('project.namePlaceholder')" clearable />
      </el-form-item>
      <el-form-item :label="t('project.status')">
        <el-select v-model="query.status" :placeholder="t('common.pleaseSelect')" clearable>
          <el-option :label="t('project.statusActive')" value="ACTIVE" />
          <el-option :label="t('project.statusArchived')" value="ARCHIVED" />
        </el-select>
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button type="primary" :icon="Plus" @click="handleAdd">{{ t('project.create') }}</el-button>
    </div>

    <DataTable
      v-model:page="query.page"
      v-model:page-size="query.pageSize"
      :loading="loading"
      :data="list"
      :total="total"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <el-table-column prop="id" label="ID" width="300" />
      <el-table-column prop="name" :label="t('project.name')" min-width="150" />
      <el-table-column prop="description" :label="t('project.description')" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" :label="t('project.status')" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'info'">
            {{ row.status === 'ACTIVE' ? t('project.statusActive') : t('project.statusArchived') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">{{ t('common.edit') }}</el-button>
          <el-button 
            v-if="row.status === 'ACTIVE'" 
            link type="warning" 
            size="small" 
            @click="handleArchive(row)"
          >{{ t('project.archive') }}</el-button>
          <el-popconfirm
            :title="t('common.deleteConfirm')"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="danger" size="small">{{ t('common.delete') }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </DataTable>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('project.edit') : t('project.create')"
      width="500px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="t('project.name')" prop="name">
          <el-input v-model="form.name" :placeholder="t('project.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('project.description')" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" :placeholder="t('project.descriptionPlaceholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useListPage } from '@/composables/crud/useListPage'
import SearchForm from '@/components/crud/SearchForm.vue'
import DataTable from '@/components/crud/DataTable.vue'
import { projectApi, type Project } from '@/api/projectApi'
import { handleError } from '@/utils/error'

const { t } = useI18n()

const { query, loading, list, total, search, reset, onPageChange, onPageSizeChange, reload } = useListPage({
  fetcher: projectApi.list,
  defaultQuery: {
    name: '',
    status: ''
  }
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const editId = ref<string>('')
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  description: ''
})

const rules: FormRules = {
  name: [{ required: true, message: t('project.nameRequired'), trigger: 'blur' }]
}

const handleAdd = () => {
  isEdit.value = false
  editId.value = ''
  dialogVisible.value = true
}

const handleEdit = (row: Project) => {
  isEdit.value = true
  editId.value = row.id
  form.name = row.name
  form.description = row.description || ''
  dialogVisible.value = true
}

const handleArchive = async (row: Project) => {
  try {
    await projectApi.archive(row.id)
    ElMessage.success(t('project.archiveSuccess'))
    reload()
  } catch (e) {
    handleError(e)
  }
}

const handleDelete = async (row: Project) => {
  try {
    await projectApi.remove(row.id)
    ElMessage.success(t('common.deleteSuccess'))
    reload()
  } catch (e) {
    handleError(e)
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  saving.value = true
  try {
    if (isEdit.value) {
      await projectApi.update(editId.value, form)
      ElMessage.success(t('common.updateSuccess'))
    } else {
      await projectApi.create(form)
      ElMessage.success(t('common.createSuccess'))
    }
    dialogVisible.value = false
    reload()
  } catch (e) {
    handleError(e)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  formRef.value?.resetFields()
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
