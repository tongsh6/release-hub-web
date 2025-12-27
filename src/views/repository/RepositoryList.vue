<template>
  <div class="repository-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('common.keyword')">
        <el-input v-model="query.keyword" :placeholder="t('repository.searchPlaceholder')" clearable />
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button v-perm.disable="'repository:write'" type="primary" @click="openCreate">{{ t('repository.addOrSync') }}</el-button>
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
      <el-table-column prop="name" :label="t('repository.columns.repo')" min-width="200" />
      <el-table-column prop="projectId" :label="t('repository.columns.projectId')" width="140" />
      <el-table-column prop="gitlabProjectId" :label="t('repository.columns.gitlabProjectId')" width="140" />
      <el-table-column prop="defaultBranch" :label="t('repository.columns.defaultBranch')" width="140" />
      <el-table-column :label="t('repository.healthLabel')" width="200">
        <template #default="{ row }">
          <el-tag v-if="row.nonCompliantBranchCount > 0" type="danger">{{ t('repository.health.risk') }} ({{ row.nonCompliantBranchCount }})</el-tag>
          <el-tag v-else type="success">{{ t('repository.health.healthy') }}</el-tag>
          <span class="health-metrics">
            B:{{ row.branchCount ?? 0 }}/{{ row.activeBranchCount ?? 0 }} | MR:{{ row.mrCount ?? 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="260" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openDetail(row)">{{ t('common.detail') }}</el-button>
          <el-button v-perm.disable="'repository:write'" link size="small" type="success" @click="sync(row)">{{ t('repository.sync') }}</el-button>
          <el-button v-perm.disable="'repository:write'" link size="small" @click="openEdit(row)">{{ t('common.edit') }}</el-button>
        </template>
      </el-table-column>
    </DataTable>

    <RepositoryDrawer ref="drawerRef" />
    <RepositoryEdit ref="editRef" @success="search" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import { useListPage } from '@/composables/crud/useListPage'
import SearchForm from '@/components/crud/SearchForm.vue'
import DataTable from '@/components/crud/DataTable.vue'
import RepositoryDrawer from './RepositoryDrawer.vue'
import RepositoryEdit from './RepositoryEdit.vue'
import { repositoryApi } from '@/api/repositoryApi'
import { hasPerm } from '@/utils/perm'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const { t } = useI18n()
const drawerRef = ref<InstanceType<typeof RepositoryDrawer>>()
const editRef = ref<InstanceType<typeof RepositoryEdit>>()

const { query, loading, list, total, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: repositoryApi.list,
  defaultQuery: {
    keyword: ''
  }
})

function openDetail(row: any) {
  drawerRef.value?.open(row.id)
}

function openCreate() {
  editRef.value?.open()
}

function openEdit(row: any) {
  if (!hasPerm('repository:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  editRef.value?.open(row)
}

async function sync(row: any) {
  if (!hasPerm('repository:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  try {
    await repositoryApi.sync(row.id)
    ElMessage.success(t('common.success'))
    search()
  } catch (e: any) {
    console.error(e)
    const msg = e?.code === 'GITLAB_SETTINGS_MISSING' ? t('repository.gitlabMissing') : t('common.requestFailed')
    ElMessage.error(msg)
  }
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
.health-metrics {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}
</style>
