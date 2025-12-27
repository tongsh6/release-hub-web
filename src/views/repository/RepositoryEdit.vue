<template>
  <el-dialog
    v-model="visible"
    :title="mode === 'edit' ? t('common.edit') : t('repository.addOrSync')"
    width="520px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      status-icon
    >
      <el-form-item :label="t('repository.columns.projectId')" prop="projectId">
        <el-input v-model="form.projectId" :placeholder="t('repository.placeholders.projectId')" :disabled="mode === 'edit'" />
      </el-form-item>
      <el-form-item :label="t('repository.columns.repo')" prop="name">
        <el-input v-model="form.name" :placeholder="t('repository.placeholders.name')" />
      </el-form-item>
      <el-form-item :label="t('repository.columns.gitlabProjectId')" prop="gitlabProjectId">
        <el-input v-model.number="form.gitlabProjectId" :placeholder="t('repository.placeholders.gitlabProjectId')" type="number" />
      </el-form-item>
      <el-form-item :label="t('repository.columns.cloneUrl')" prop="cloneUrl">
        <el-input v-model="form.cloneUrl" :placeholder="t('repository.placeholders.cloneUrl')" />
      </el-form-item>
      <el-form-item :label="t('repository.columns.defaultBranch')" prop="defaultBranch">
        <el-input v-model="form.defaultBranch" :placeholder="t('repository.placeholders.defaultBranch')" />
      </el-form-item>
      <el-form-item :label="t('repository.columns.monoRepo')" prop="monoRepo">
        <el-switch v-model="form.monoRepo" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="submit">
          {{ t('common.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance } from 'element-plus'
import { repositoryApi, type CreateRepoReq } from '@/api/repositoryApi'

const emit = defineEmits(['success'])
const { t } = useI18n()

const visible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()
const mode = ref<'create' | 'edit'>('create')
const currentId = ref<string | null>(null)

const form = reactive<CreateRepoReq>({
  projectId: '',
  gitlabProjectId: undefined as unknown as number,
  name: '',
  cloneUrl: '',
  defaultBranch: 'master',
  monoRepo: false
})

const rules = {
  projectId: [
    { required: true, message: t('common.pleaseEnter') + t('repository.columns.projectId'), trigger: 'blur' },
    { max: 36, message: t('repository.validation.projectId'), trigger: 'blur' }
  ],
  gitlabProjectId: [{ required: true, message: t('repository.validation.gitlabId'), trigger: 'blur', type: 'number' }],
  name: [
    { required: true, message: t('common.pleaseEnter') + t('repository.columns.repo'), trigger: 'blur' },
    { max: 128, message: t('repository.validation.name'), trigger: 'blur' }
  ],
  cloneUrl: [
    { required: true, message: t('common.pleaseEnter') + t('repository.columns.cloneUrl'), trigger: 'blur' },
    { max: 512, message: t('repository.validation.cloneUrl'), trigger: 'blur' }
  ],
  defaultBranch: [
    { required: true, message: t('common.pleaseEnter') + t('repository.columns.defaultBranch'), trigger: 'blur' },
    { max: 128, message: t('repository.validation.defaultBranch'), trigger: 'blur' }
  ]
}

const open = (repo?: any) => {
  visible.value = true
  form.projectId = repo?.projectId || ''
  form.gitlabProjectId = (repo?.gitlabProjectId as number | undefined) ?? (undefined as unknown as number)
  form.name = repo?.name || ''
  form.cloneUrl = repo?.cloneUrl || ''
  form.defaultBranch = repo?.defaultBranch || 'master'
  form.monoRepo = repo?.monoRepo ?? false
  mode.value = repo ? 'edit' : 'create'
  currentId.value = repo?.id || null
}

const submit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (mode.value === 'edit' && currentId.value) {
          await repositoryApi.update(currentId.value, {
            gitlabProjectId: form.gitlabProjectId!,
            name: form.name,
            cloneUrl: form.cloneUrl,
            defaultBranch: form.defaultBranch,
            monoRepo: form.monoRepo
          })
        } else {
          await repositoryApi.create(form)
        }
        ElMessage.success(t('common.success'))
        visible.value = false
        emit('success')
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }
  })
}

defineExpose({
  open
})
</script>
