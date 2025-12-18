<template>
  <div class="project-list-page">
    <SearchForm :loading="loading" @search="search" @reset="reset">
      <el-form-item label="Project Name">
        <el-input v-model="query.name" placeholder="Search by name" clearable />
      </el-form-item>
      <el-form-item label="Status">
        <el-select v-model="query.status" placeholder="Select status" clearable style="width: 180px">
          <el-option label="Active" value="active" />
          <el-option label="Frozen" value="frozen" />
        </el-select>
      </el-form-item>
    </SearchForm>

    <div class="mb-4">
      <el-button type="primary" @click="handleCreate">Create Project</el-button>
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
      <el-table-column prop="name" label="Name" min-width="150" />
      <el-table-column prop="status" label="Status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created At" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row)">View</el-button>
          <el-button link type="primary" @click="handleEdit(row)">Edit</el-button>
          <el-button 
            link 
            :type="row.status === 'active' ? 'danger' : 'warning'" 
            @click="handleFreeze(row)"
          >
            {{ row.status === 'active' ? 'Freeze' : 'Unfreeze' }}
          </el-button>
        </template>
      </el-table-column>
    </DataTable>

    <ProjectDialog ref="dialogRef" @success="fetch" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useListPage } from '@/composables/crud/useListPage'
import SearchForm from '@/components/crud/SearchForm.vue'
import DataTable from '@/components/crud/DataTable.vue'
import ProjectDialog from './ProjectDialog.vue'
import { projectApi, type Project } from '@/api/mock/projectApi'

const router = useRouter()
const dialogRef = ref<InstanceType<typeof ProjectDialog>>()

const { query, loading, list, total, fetch, search, reset, onPageChange, onPageSizeChange } = useListPage({
  fetcher: projectApi.listProjects,
  defaultQuery: {
    name: '',
    status: ''
  }
})

const handleCreate = () => {
  dialogRef.value?.open({ mode: 'create' })
}

const handleEdit = (row: Project) => {
  dialogRef.value?.open({ id: row.id, mode: 'edit' })
}

const handleView = (row: Project) => {
  // Option A: Use Dialog
  dialogRef.value?.open({ id: row.id, mode: 'view' })
  
  // Option B: Navigate to Detail Page (Uncomment to use)
  // router.push({ name: 'ProjectDetail', params: { id: row.id }, query: { mode: 'view' } })
}

const handleFreeze = async (row: Project) => {
  try {
    await projectApi.freezeProject(row.id)
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
