<template>
  <div class="branch-rule-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('branchRule.name')">
        <el-input v-model="query.name" :placeholder="t('branchRule.name')" clearable />
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button type="primary" :icon="Plus" @click="handleAdd">{{ t('branchRule.create') }}</el-button>
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
      <el-table-column prop="name" :label="t('branchRule.name')" min-width="150" />
      <el-table-column prop="pattern" :label="t('branchRule.pattern')" min-width="150" />
      <el-table-column prop="type" :label="t('branchRule.type')" width="120" />
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
import { branchRuleApi } from '@/api/branchRuleApi'

const { t } = useI18n()

const { query, loading, list, total, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: branchRuleApi.list,
  defaultQuery: {
    name: ''
  }
})

const handleAdd = () => {
  console.log('Add rule')
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
