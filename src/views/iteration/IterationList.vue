<template>
  <div class="iteration-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('iteration.columns.key')">
        <el-input v-model="query.keyword" :placeholder="t('common.keyword')" clearable />
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button v-perm.disable="'iteration:write'" type="primary" @click="openCreate">{{ t('iteration.new') }}</el-button>
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
      <el-table-column prop="iterationKey" :label="t('iteration.columns.key')" min-width="200" />
      <el-table-column prop="description" :label="t('iteration.columns.description')" min-width="200">
        <template #default="{ row }">
          {{ row.description || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="repoCount" :label="t('iteration.columns.repos')" width="100">
        <template #default="{ row }">
          <el-tag type="info" size="small">{{ row.repoCount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('iteration.columns.createdAt')" width="180">
        <template #default="{ row }">
          {{ row.createdAt ? new Date(row.createdAt).toLocaleString() : '-' }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openDetail(row)">{{ t('common.detail') }}</el-button>
          <el-button link type="primary" size="small" @click="goDetailPage(row)">{{ t('common.view') }}</el-button>
          <el-button v-perm.disable="'iteration:write'" link type="danger" size="small" @click="handleDelete(row)">{{ t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </DataTable>

    <IterationDrawer ref="drawerRef" />
    <IterationCreateDialog ref="createRef" @success="fetch" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useListPage } from '@/composables/crud/useListPage'
import { useRouter } from 'vue-router'
import SearchForm from '@/components/crud/SearchForm.vue'
import DataTable from '@/components/crud/DataTable.vue'
import IterationDrawer from './IterationDrawer.vue'
import IterationCreateDialog from './IterationCreateDialog.vue'
import { iterationApi, type Iteration } from '@/api/iterationApi'
import { hasPerm } from '@/utils/perm'
import { ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const drawerRef = ref<InstanceType<typeof IterationDrawer>>()
const createRef = ref<InstanceType<typeof IterationCreateDialog>>()

const { query, loading, list, total, fetch, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: iterationApi.list,
  defaultQuery: {
    keyword: ''
  }
})

function openDetail(row: any) {
  drawerRef.value?.open(row.iterationKey)
}

function openCreate() {
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  createRef.value?.open()
}

function goDetailPage(row: Iteration) {
  router.push({ name: 'IterationDetail', params: { iterationKey: row.iterationKey } })
}

async function handleDelete(row: Iteration) {
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  
  try {
    await ElMessageBox.confirm(
      t('iteration.confirmDelete', { key: row.iterationKey }),
      t('common.warning'),
      { type: 'warning' }
    )
    
    await iterationApi.delete(row.iterationKey)
    ElMessage.success(t('common.success'))
    fetch()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error(t('common.requestFailed'))
    }
  }
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
