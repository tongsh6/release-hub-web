<template>
  <div class="version-policy-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('versionPolicy.name')">
        <el-input v-model="query.name" :placeholder="t('versionPolicy.name')" />
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button type="primary" :icon="Plus" @click="handleAdd">{{ t('versionPolicy.create') }}</el-button>
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
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" :label="t('versionPolicy.name')" min-width="150" />
      <el-table-column prop="strategy" :label="t('versionPolicy.strategy')" min-width="150" />
      <el-table-column :label="t('releaseWindow.actions')" width="150" fixed="right">
        <template #default>
          <el-button link type="primary" size="small">{{ t('common.edit') }}</el-button>
          <el-button link type="danger" size="small">{{ t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { useListPage } from '@/composables/crud/useListPage'
import SearchForm from '@/components/crud/SearchForm.vue'
import DataTable from '@/components/crud/DataTable.vue'
import { versionPolicyApi } from '@/api/versionPolicyApi'

const { t } = useI18n()

const { query, loading, list, total, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: versionPolicyApi.list,
  defaultQuery: {
    name: ''
  }
})

const handleAdd = () => {
  console.log('Add policy')
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
