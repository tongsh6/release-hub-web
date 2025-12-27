<template>
  <el-dialog
    v-model="visible"
    :title="t('repository.addOrSync')"
    width="500px"
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
        <el-input v-model="form.projectId" placeholder="e.g. 12345" />
      </el-form-item>
      <el-form-item :label="t('repository.columns.repo')" prop="name">
        <el-input v-model="form.name" placeholder="e.g. backend-service" />
      </el-form-item>
      <el-form-item :label="t('repository.columns.cloneUrl')" prop="cloneUrl">
        <el-input v-model="form.cloneUrl" placeholder="git@gitlab.com:group/project.git" />
      </el-form-item>
      <el-form-item :label="t('repository.columns.defaultBranch')" prop="defaultBranch">
        <el-input v-model="form.defaultBranch" placeholder="master or main" />
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

const form = reactive<CreateRepoReq>({
  projectId: '',
  name: '',
  cloneUrl: '',
  defaultBranch: 'master',
  monoRepo: false
})

const rules = {
  projectId: [{ required: true, message: t('common.pleaseEnter') + t('repository.columns.projectId'), trigger: 'blur' }],
  name: [{ required: true, message: t('common.pleaseEnter') + t('repository.columns.repo'), trigger: 'blur' }],
  cloneUrl: [{ required: true, message: t('common.pleaseEnter') + t('repository.columns.cloneUrl'), trigger: 'blur' }],
  defaultBranch: [{ required: true, message: t('common.pleaseEnter') + t('repository.columns.defaultBranch'), trigger: 'blur' }]
}

const open = () => {
  visible.value = true
  form.projectId = ''
  form.name = ''
  form.cloneUrl = ''
  form.defaultBranch = 'master'
  form.monoRepo = false
}

const submit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await repositoryApi.create(form)
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
