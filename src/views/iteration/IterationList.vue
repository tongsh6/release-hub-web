<template>
  <div class="iteration-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('iteration.columns.key')">
        <el-input v-model="query.keyword" :placeholder="t('common.keyword')" clearable />
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button type="primary" :disabled="!canWrite">{{ t('iteration.new') }}</el-button>
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
      <el-table-column prop="iterationKey" :label="t('iteration.columns.key')" min-width="160" />
      <el-table-column prop="repoCount" :label="t('iteration.columns.repos')" width="100" />
      <el-table-column prop="mountedWindows" :label="t('iteration.columns.mountedWindows')" min-width="160" />
      <el-table-column prop="attachAt" :label="t('iteration.columns.attachAt')" width="180">
        <template #default="{ row }">
          {{ new Date(row.attachAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column :label="t('common.actions')" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openDetail(row)">{{ t('common.detail') }}</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useListPage } from '@/composables/crud/useListPage'
import SearchForm from '@/components/crud/SearchForm.vue'
import DataTable from '@/components/crud/DataTable.vue'
import { iterationApi } from '@/api/iterationApi'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const canWrite = userStore.hasPermission('iteration:write')

const { query, loading, list, total, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: iterationApi.list,
  defaultQuery: {
    keyword: ''
  }
})

function openDetail(row: any) {
  router.push(`/iterations/${row.iterationKey}`)
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
