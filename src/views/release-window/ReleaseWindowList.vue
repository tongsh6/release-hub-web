<template>
  <div class="release-window-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('releaseWindow.name')">
        <el-input v-model="query.name" :placeholder="t('releaseWindow.placeholder.name')" clearable />
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button v-perm.disable="'release-window:write'" type="primary" @click="handleCreate">{{ t('releaseWindow.create') }}</el-button>
    </div>

    <DataTable
      :loading="loading"
      :data="list"
      :total="total"
      v-model:page="query.page"
      v-model:page-size="query.pageSize"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <el-table-column prop="windowKey" :label="t('releaseWindow.windowKey')" width="150" />
      <el-table-column prop="name" :label="t('releaseWindow.name')" min-width="150" />
      <el-table-column prop="status" :label="t('releaseWindow.status')" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ t(`releaseWindow.statusText.${row.status}`) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('releaseWindow.createdAt')" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column :label="t('releaseWindow.actions')" width="360" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">{{ t('releaseWindow.view') }}</el-button>
          
          <el-button v-perm.disable="'release-window:write'" link type="primary" @click="handleEdit(row)">{{ t('common.edit') }}</el-button>

          <el-button 
            v-perm.disable="'release-window:write'"
            link 
            type="primary"
            @click="openAttachIterations(row)"
          >
            {{ t('iteration.detail.attachToWindow') }}
          </el-button>
          
          <el-button 
            v-perm.disable="'release-window:write'"
            v-if="row.status !== 'FROZEN' && row.status !== 'CLOSED'"
            link 
            type="warning"
            @click="handleFreeze(row)"
          >
            {{ t('releaseWindow.freeze') }}
          </el-button>
          
          <el-button 
            v-perm.disable="'release-window:write'"
            v-if="row.status === 'FROZEN'"
            link 
            type="success"
            @click="handleUnfreeze(row)"
          >
            {{ t('releaseWindow.unfreeze') }}
          </el-button>

           <el-button 
            v-perm.disable="'release-window:write'"
            v-if="row.status === 'FROZEN'"
            link 
            type="primary"
            @click="handlePublish(row)"
          >
            {{ t('releaseWindow.publish') }}
          </el-button>
          
           <el-button 
            v-perm.disable="'release-window:write'"
            v-if="row.status === 'PUBLISHED' || row.status === 'FROZEN'"
            link 
            type="danger"
            @click="handleClose(row)"
          >
            {{ t('releaseWindow.close') }}
          </el-button>
        </template>
      </el-table-column>
    </DataTable>

    <ReleaseWindowDialog ref="dialogRef" @success="fetch" />
    <AttachIterationsDialog ref="attachDialogRef" @success="fetch" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useListPage } from '@/composables/crud/useListPage'
import SearchForm from '@/components/crud/SearchForm.vue'
import DataTable from '@/components/crud/DataTable.vue'
import ReleaseWindowDialog from './ReleaseWindowDialog.vue'
import AttachIterationsDialog from './AttachIterationsDialog.vue'
import { releaseWindowApi, type ReleaseWindow, type ReleaseWindowStatus } from '@/api/modules/releaseWindow'
import { ElMessage, ElMessageBox } from 'element-plus'
import { hasPerm } from '@/utils/perm'

const { t } = useI18n()
const router = useRouter()
const dialogRef = ref<InstanceType<typeof ReleaseWindowDialog>>()
const attachDialogRef = ref<InstanceType<typeof AttachIterationsDialog>>()

// Since backend returns all items, we handle pagination client-side or just show all for now
// The useListPage hook assumes server-side pagination usually, but let's adapt it.
// Current backend API list() returns Array, useListPage expects PageResult.
// We need a wrapper.
const listFetcher = async (q: any) => {
  const data = await releaseWindowApi.list(q)
  // Ensure data is an array before filtering
  const arrayData = Array.isArray(data) ? data : []
  
  // Client-side filtering if needed
  let filtered = arrayData
  if (q.name) {
    filtered = arrayData.filter(item => item.name.toLowerCase().includes(q.name.toLowerCase()))
  }
  return {
    list: filtered,
    total: filtered.length
  }
}

const { query, loading, list, total, fetch, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: listFetcher,
  defaultQuery: {
    name: '',
    status: ''
  }
})

const handleCreate = () => {
  dialogRef.value?.open({ mode: 'create' })
}

const handleEdit = (row: ReleaseWindow) => {
  if (!hasPerm('release-window:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  dialogRef.value?.open({ id: row.id, mode: 'edit' })
}

const handleView = (row: ReleaseWindow) => {
  router.push({ name: 'ReleaseWindowDetail', params: { id: row.id } })
}

const handleFreeze = async (row: ReleaseWindow) => {
if (!hasPerm('release-window:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  try {
    await ElMessageBox.confirm(t('releaseWindow.confirmFreeze'), t('common.warning'), {
      type: 'warning'
    })
    await releaseWindowApi.freeze(row.id)
    ElMessage.success(t('common.success'))
    fetch()
  } catch (error) {
    if (error !== 'cancel') console.error(error)
  }
}

const handleUnfreeze = async (row: ReleaseWindow) => {
if (!hasPerm('release-window:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  try {
    await releaseWindowApi.unfreeze(row.id)
    ElMessage.success(t('common.success'))
    fetch()
  } catch (error) {
    console.error(error)
  }
}

const handlePublish = async (row: ReleaseWindow) => {
if (!hasPerm('release-window:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  try {
    await ElMessageBox.confirm(t('releaseWindow.confirmPublish'), t('common.warning'), {
      type: 'warning'
    })
    await releaseWindowApi.publish(row.id)
    ElMessage.success(t('common.success'))
    fetch()
  } catch (error) {
    if (error !== 'cancel') console.error(error)
  }
}

const handleClose = async (row: ReleaseWindow) => {
if (!hasPerm('release-window:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
   try {
    await ElMessageBox.confirm(t('releaseWindow.confirmClose'), t('common.warning'), {
      type: 'warning'
    })
    await releaseWindowApi.close(row.id)
    ElMessage.success(t('common.success'))
    fetch()
  } catch (error) {
    if (error !== 'cancel') console.error(error)
  }
}

const openAttachIterations = (row: ReleaseWindow) => {
if (!hasPerm('release-window:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  attachDialogRef.value?.open(row.id)
}
const getStatusType = (status: ReleaseWindowStatus) => {
  switch (status) {
    case 'DRAFT': return 'info'
    case 'INIT': return 'info'
    case 'OPEN': return 'primary'
    case 'FROZEN': return 'warning'
    case 'CLOSED': return 'success'
    case 'PUBLISHED': return 'success'
    default: return 'info'
  }
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
