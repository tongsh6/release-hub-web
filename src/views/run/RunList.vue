<template>
  <div class="run-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('run.filters.windowKey')">
        <el-input v-model="query.windowKey" />
      </el-form-item>
      <el-form-item :label="t('run.filters.repo')">
        <el-input v-model="query.repo" />
      </el-form-item>
      <el-form-item :label="t('run.filters.iterationKey')">
        <el-input v-model="query.iterationKey" />
      </el-form-item>
      <el-form-item :label="t('run.filters.status')">
        <el-select v-model="query.status" clearable style="width: 160px">
          <el-option label="FAILED" value="FAILED" />
          <el-option label="MERGE_BLOCKED" value="MERGE_BLOCKED" />
        </el-select>
      </el-form-item>
    </SearchForm>

    <DataTable
      :loading="loading"
      :data="list"
      :total="total"
      v-model:page="query.page"
      v-model:page-size="query.pageSize"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <el-table-column prop="id" :label="t('run.columns.runId')" width="120" />
      <el-table-column prop="type" :label="t('run.columns.type')" width="220" />
      <el-table-column prop="status" :label="t('run.columns.status')" width="120" />
      <el-table-column prop="startedAt" :label="t('run.columns.start')" width="180" />
      <el-table-column prop="endedAt" :label="t('run.columns.end')" width="180" />
      <el-table-column :label="t('common.actions')" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openDetail(row)">{{ t('run.actions.detail') }}</el-button>
          <el-button 
            v-perm.disable="'run:write'" 
            link 
            type="warning" 
            size="small" 
            :disabled="!canRetry(row)"
            @click="handleRetry(row)"
          >
            {{ t('run.actions.retry') }}
          </el-button>
          <el-button 
            v-perm.disable="'run:write'" 
            link 
            type="primary" 
            size="small"
            @click="handleExport(row)"
          >
            {{ t('run.actions.export') }}
          </el-button>
        </template>
      </el-table-column>
    </DataTable>

    <RunDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useListPage } from '@/composables/crud/useListPage'
import SearchForm from '@/components/crud/SearchForm.vue'
import DataTable from '@/components/crud/DataTable.vue'
import RunDrawer from './RunDrawer.vue'
import { runApi } from '@/api/runApi'
import { hasPerm } from '@/utils/perm'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const drawerRef = ref<InstanceType<typeof RunDrawer>>()

const { query, loading, list, total, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: runApi.list,
  defaultQuery: {
    windowKey: '',
    repo: '',
    iterationKey: '',
    status: ''
  }
})

function canRetry(row: any) { return ['FAILED', 'MERGE_BLOCKED'].includes(row.status) }

function openDetail(row: any) {
  drawerRef.value?.open(row.id)
}

function handleRetry(row: any) {
  if (!hasPerm('run:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  // TODO: call retry API
}

function handleExport(row: any) {
  if (!hasPerm('run:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  // TODO: export logic
}
</script>

<style scoped>
</style>
