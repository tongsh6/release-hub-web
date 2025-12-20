<template>
  <div class="release-window-detail-page" v-loading="loading">
    <div class="page-header">
      <h2>{{ title }}</h2>
      <div class="actions">
        <el-button @click="goBack">{{ t('common.back') }}</el-button>
        <el-button 
          v-if="mode !== 'view'" 
          type="primary" 
          :loading="saving" 
          @click="handleSubmit"
        >
          {{ t('common.save') }}
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
        <el-form-item :label="t('releaseWindow.name')" prop="name">
          <el-input v-model="form.name" :placeholder="t('releaseWindow.placeholder.enterName')" />
        </el-form-item>

        <el-form-item :label="t('releaseWindow.description')" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :placeholder="t('releaseWindow.placeholder.enterDesc')" 
            :rows="4" 
          />
        </el-form-item>

        <el-form-item :label="t('releaseWindow.status')" prop="status" v-if="mode !== 'create'">
          <el-radio-group v-model="form.status">
            <el-radio value="active">{{ t('releaseWindow.active') }}</el-radio>
            <el-radio value="frozen">{{ t('releaseWindow.frozen') }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="t('releaseWindow.createdAt')" v-if="mode !== 'create'">
          <span>{{ form.createdAt ? new Date(form.createdAt).toLocaleString() : '-' }}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDetailForm } from '@/composables/crud/useDetailForm'
import { releaseWindowApi, type ReleaseWindow } from '@/api/releaseWindowApi'
import type { FormInstance, FormRules } from 'element-plus'
import type { CrudMode } from '@/types/crud'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

const { form, mode, loading, saving, load, submit } = useDetailForm<ReleaseWindow>({
  fetchById: releaseWindowApi.get,
  create: releaseWindowApi.create,
  update: releaseWindowApi.update,
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

const { t } = useI18n()
const title = computed(() => {
  const map = {
    create: t('releaseWindow.create'),
    edit: t('releaseWindow.editTitle'),
    view: t('releaseWindow.details')
  }
  return map[mode.value]
})

const rules: FormRules = {
  name: [
    { required: true, message: t('releaseWindow.validation.nameRequired'), trigger: 'blur' },
    { min: 3, max: 50, message: t('releaseWindow.validation.nameLength'), trigger: 'blur' }
  ],
  status: [
    { required: true, message: t('releaseWindow.validation.statusRequired'), trigger: 'change' }
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
.release-window-detail-page {
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
