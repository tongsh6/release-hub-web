<template>
  <div class="project-detail-page" v-loading="loading">
    <div class="page-header">
      <h2>{{ title }}</h2>
      <div class="actions">
        <el-button @click="goBack">Back</el-button>
        <el-button 
          v-if="mode !== 'view'" 
          type="primary" 
          :loading="saving" 
          @click="handleSubmit"
        >
          Save
        </el-button>
      </div>
    </div>

    <el-card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        :disabled="mode === 'view'"
        class="detail-form"
      >
        <el-form-item label="Project Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter project name" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            placeholder="Enter description" 
            :rows="4" 
          />
        </el-form-item>

        <el-form-item label="Status" prop="status" v-if="mode !== 'create'">
          <el-radio-group v-model="form.status">
            <el-radio value="active">Active</el-radio>
            <el-radio value="frozen">Frozen</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Created At" v-if="mode !== 'create'">
          <span>{{ formatDateTime(form.createdAt) }}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDetailForm } from '@/composables/crud/useDetailForm'
import { projectApi, type Project } from '@/api/mock/projectApi'
import type { FormInstance, FormRules } from 'element-plus'
import { formatDateTime } from '@/utils/date'
import type { CrudMode } from '@/types/crud'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const { form, mode, loading, saving, load, submit } = useDetailForm<Project>({
  fetchById: projectApi.getProject,
  create: projectApi.createProject,
  update: projectApi.updateProject,
  defaultForm: {
    id: '',
    name: '',
    status: 'active',
    createdAt: '',
    description: ''
  }
})

onMounted(() => {
  const id = route.params.id as string
  const queryMode = route.query.mode as CrudMode
  
  if (id) {
    load(id, queryMode || 'edit')
  } else {
    mode.value = 'create'
  }
})

const title = computed(() => {
  const map = {
    create: 'Create Project',
    edit: 'Edit Project',
    view: 'Project Details'
  }
  return map[mode.value]
})

const rules: FormRules = {
  name: [
    { required: true, message: 'Please enter project name', trigger: 'blur' },
    { min: 3, max: 50, message: 'Length should be 3 to 50', trigger: 'blur' }
  ],
  status: [
    { required: true, message: 'Please select status', trigger: 'change' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      await submit()
      goBack()
    }
  })
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.project-detail-page {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.detail-form {
  max-width: 800px;
}
</style>
