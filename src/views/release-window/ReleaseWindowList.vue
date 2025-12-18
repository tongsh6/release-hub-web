<template>
  <div class="release-window-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item :label="t('releaseWindow.name')">
        <el-input v-model="query.name" :placeholder="t('releaseWindow.placeholder.name')" clearable />
      </el-form-item>
      <el-form-item :label="t('releaseWindow.status')">
        <el-select v-model="query.status" :placeholder="t('releaseWindow.placeholder.status')" clearable style="width: 180px">
          <el-option :label="t('releaseWindow.active')" value="active" />
          <el-option :label="t('releaseWindow.frozen')" value="frozen" />
        </el-select>
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button type="primary" @click="handleCreate">{{ t('releaseWindow.create') }}</el-button>
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
      <el-table-column prop="id" :label="t('releaseWindow.id')" width="80" />
      <el-table-column prop="name" :label="t('releaseWindow.name')" min-width="150" />
      <el-table-column prop="status" :label="t('releaseWindow.status')" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? t('releaseWindow.active') : t('releaseWindow.frozen') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" :label="t('releaseWindow.createdAt')" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column :label="t('releaseWindow.actions')" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">{{ t('releaseWindow.view') }}</el-button>
          <el-button link type="primary" @click="handleEdit(row)">{{ t('common.edit') }}</el-button>
          <el-button 
            link 
            :type="row.status === 'active' ? 'danger' : 'warning'" 
            @click="handleFreeze(row)"
          >
            {{ row.status === 'active' ? t('releaseWindow.freeze') : t('releaseWindow.unfreeze') }}
          </el-button>
        </template>
      </el-table-column>
    </DataTable>

    <ReleaseWindowDialog ref="dialogRef" @success="fetch" />
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
import { releaseWindowApi, type ReleaseWindow } from '@/api/releaseWindowApi'

const { t } = useI18n()
const router = useRouter()
const dialogRef = ref<InstanceType<typeof ReleaseWindowDialog>>()

const { query, loading, list, total, fetch, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: releaseWindowApi.list,
  defaultQuery: {
    name: '',
    status: ''
  }
})

const handleCreate = () => {
  dialogRef.value?.open({ mode: 'create' })
}

const handleEdit = (row: ReleaseWindow) => {
  dialogRef.value?.open({ id: row.id, mode: 'edit' })
}

const handleView = (row: ReleaseWindow) => {
  dialogRef.value?.open({ id: row.id, mode: 'view' })
}

const handleFreeze = async (row: ReleaseWindow) => {
  try {
    await releaseWindowApi.freeze(row.id)
    fetch()
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
