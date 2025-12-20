<template>
  <div class="repository-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('common.keyword')">
        <el-input v-model="query.keyword" :placeholder="t('common.keyword')" clearable />
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button type="primary" :disabled="!canWrite">{{ t('repository.addOrSync') }}</el-button>
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
      <el-table-column prop="repo" :label="t('repository.columns.repo')" min-width="200" />
      <el-table-column prop="projectId" :label="t('repository.columns.projectId')" width="140" />
      <el-table-column prop="defaultBranch" :label="t('repository.columns.defaultBranch')" width="140" />
      <el-table-column prop="writable" :label="t('repository.columns.writable')" width="120">
        <template #default="{ row }">
          <el-tag :type="row.writable ? 'success' : 'warning'">{{ row.writable ? t('common.yes') : t('common.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openDetail(row)">{{ t('common.detail') }}</el-button>
        </template>
      </el-table-column>
    </DataTable>

    <RepositoryDrawer ref="drawerRef" />
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
import { repositoryApi } from '@/api/repositoryApi'

const userStore = useUserStore()
const canWrite = userStore.hasPermission('repository:write')
const { t } = useI18n()
const drawerRef = ref<InstanceType<typeof RepositoryDrawer>>()

const { query, loading, list, total, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: repositoryApi.list,
  defaultQuery: {
    keyword: ''
  }
})

function openDetail(row: any) {
  drawerRef.value?.open(row.repo)
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
