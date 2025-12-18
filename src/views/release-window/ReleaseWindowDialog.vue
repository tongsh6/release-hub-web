<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    :before-close="handleBeforeClose"
    append-to-body
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
      :disabled="mode === 'view'"
    >
      <el-form-item :label="t('releaseWindow.name')" prop="name">
        <el-input v-model="form.name" :placeholder="t('releaseWindow.placeholder.enterName')" />
      </el-form-item>
      
      <el-form-item :label="t('releaseWindow.description')" prop="description">
        <el-input 
          v-model="form.description" 
          type="textarea" 
          :placeholder="t('releaseWindow.placeholder.enterDesc')" 
          :rows="3" 
        />
      </el-form-item>

      <el-form-item :label="t('releaseWindow.status')" prop="status" v-if="mode !== 'create'">
        <el-radio-group v-model="form.status">
          <el-radio value="active">{{ t('releaseWindow.active') }}</el-radio>
          <el-radio value="frozen">{{ t('releaseWindow.frozen') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">{{ t('common.cancel') }}</el-button>
        <el-button 
          v-if="mode !== 'view'" 
          type="primary" 
          :loading="saving" 
          @click="handleSubmit"
        >
          {{ t('common.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDialogForm } from '@/composables/crud/useDialogForm'
import { releaseWindowApi, type ReleaseWindow } from '@/api/releaseWindowApi'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'success', payload: any): void
}>()

const formRef = ref<FormInstance>()

const { visible, mode, loading, saving, form, open, close, submit, onSuccess } = useDialogForm<ReleaseWindow>({
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

// Bind success callback to emit
onSuccess((payload) => {
  emit('success', payload)
})

const title = computed(() => {
  const map: Record<string, string> = {
    create: t('releaseWindow.create'),
    edit: t('releaseWindow.editTitle'),
    view: t('releaseWindow.details')
  }
  return map[mode.value]
})

const rules = computed<FormRules>(() => ({
  name: [
    { required: true, message: t('releaseWindow.validation.nameRequired'), trigger: 'blur' },
    { min: 3, max: 50, message: t('releaseWindow.validation.nameLength'), trigger: 'blur' }
  ],
  status: [
    { required: true, message: t('releaseWindow.validation.statusRequired'), trigger: 'change' }
  ]
}))

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      await submit()
    }
  })
}

const handleBeforeClose = (done: () => void) => {
  if (saving.value) return
  done()
}

defineExpose({
  open,
  close
})
</script>
