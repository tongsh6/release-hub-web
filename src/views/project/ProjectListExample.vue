<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { hasPerm } from '@/utils/perm'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchSchema, TableColumn } from '@/types/ui'

import { apiClient } from '@/api/client'
import type { components } from '@/api/schema'

type ProjectDTO = components['schemas']['ProjectDTO']

// 演示：本地状态管理（不入 Pinia）
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

// 1. 搜索表单状态
const searchParams = ref({
  keyword: '',
  status: '',
  dateRange: []
})

const searchSchema = computed<SearchSchema>(() => ({
  fields: [
    { prop: 'keyword', label: t('project.name'), type: 'input', placeholder: t('project.enterKeyword') },
    { 
      prop: 'status', 
      label: t('project.status'), 
      type: 'select', 
      options: [
        { label: t('project.active'), value: 'ACTIVE' },
        { label: t('project.archived'), value: 'ARCHIVED' }
      ] 
    },
    { prop: 'dateRange', label: t('project.dateRange'), type: 'dateRange', span: 8 }
  ]
}))

// 2. 表格数据状态
const loading = ref(false)
const tableData = ref<ProjectDTO[]>([])
const pagination = ref({
  page: 1,
  size: 10,
  total: 0
})

const columns = computed<TableColumn[]>(() => [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: t('project.name'), minWidth: 200 },
  { prop: 'description', label: t('project.description'), minWidth: 200 }, // Added description
  { prop: 'status', label: t('project.status'), width: 100 },
  { label: t('releaseWindow.actions'), slot: 'actions', width: 150, fixed: 'right' }
])

// 3. 业务逻辑
async function fetchData() {
  loading.value = true
  try {
    // 使用 apiClient (OpenAPI 类型安全客户端)
    // 编译器会校验入参 query 是否符合 /projects 的定义
    // 返回值 res 自动推导为 PageResultProjectDTO
    const res = await apiClient.get('/projects', {
      page: pagination.value.page,
      size: pagination.value.size,
      keyword: searchParams.value.keyword
    })
    
    tableData.value = res.list
    pagination.value.total = res.total
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.value.page = 1
  fetchData()
}

function handleReset() {
  searchParams.value = { keyword: '', status: '', dateRange: [] }
  handleSearch()
}

function handlePageChange(page: number) {
  pagination.value.page = page
  fetchData()
}

function handleSizeChange(size: number) {
  pagination.value.size = size
  pagination.value.page = 1
  fetchData()
}

function handleEdit(row: any) {
  console.log('Edit', row)
}

// 4. 初始化
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="project-list-example">
    <el-card shadow="never">
      <search-form
        v-model="searchParams"
        :schema="searchSchema"
        :loading="loading"
        @submit="handleSearch"
        @reset="handleReset"
      />
    </el-card>

    <el-card shadow="never" class="mt-4">
      <data-table
        v-model:page="pagination.page"
        v-model:size="pagination.size"
        :total="pagination.total"
        :rows="tableData"
        :columns="columns"
        :loading="loading"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template #top-right>
          <el-button 
            v-perm="'project:create'" 
            type="primary"
          >
            {{ t('project.create') }}
          </el-button>
        </template>

        <template #actions="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">{{ t('common.edit') }}</el-button>
          <el-button link type="danger">{{ t('common.delete') }}</el-button>
        </template>
      </data-table>
    </el-card>
  </div>
</template>

<style scoped>
.mt-4 {
  margin-top: 16px;
}
</style>
