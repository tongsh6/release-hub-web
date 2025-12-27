<template>
  <div class="repository-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('common.keyword')">
        <el-input v-model="query.keyword" :placeholder="t('common.keyword')" clearable />
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
      <el-table-column prop="repo" :label="t('repository.columns.repo')" min-width="200" />
      <el-table-column prop="projectId" :label="t('repository.columns.projectId')" width="140" />
      <el-table-column prop="defaultBranch" :label="t('repository.columns.defaultBranch')" width="140" />
      <el-table-column prop="writable" :label="t('repository.columns.writable')" width="120">
        <template #default="{ row }">
          <el-tag :type="row.writable ? 'success' : 'warning'">{{ row.writable ? t('common.yes') : t('common.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Health" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.nonCompliantBranchCount > 0" type="danger">Risk</el-tag>
          <el-tag v-else type="success">Healthy</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="160" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openDetail(row)">{{ t('common.detail') }}</el-button>
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
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
