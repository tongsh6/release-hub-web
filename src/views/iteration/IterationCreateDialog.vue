<template>
  <EntityDialog
    ref="entityRef"
    :title="t('iteration.new')"
    :confirm-text="t('common.confirm')"
    :cancel-text="t('common.cancel')"
    @confirm="submit"
    @opened="onOpened"
  >
    <template #default>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="96px">
        <el-form-item :label="t('iteration.columns.key')" prop="iterationKey">
          <el-input v-model="form.iterationKey" :placeholder="t('common.pleaseEnter') + t('iteration.columns.key')" />
        </el-form-item>
      </el-form>
    </template>
  </EntityDialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import EntityDialog from '@/components/common/EntityDialog.vue'
  import { useDialogForm } from '@/composables/crud/useDialogForm'
  import { iterationApi, type CreateIterationRequest } from '@/api/iterationApi'
  
  const { t } = useI18n()
  const emit = defineEmits<{ (e: 'success'): void }>()
  
  const entityRef = ref<InstanceType<typeof EntityDialog>>()
  const formRef = ref<FormInstance>()
  
  const {
    visible,
    mode,
    loading,
    saving,
    form,
    open,
    close,
    submit,
    onSuccess
  } = useDialogForm<CreateIterationRequest>({
    fetchById: async (id) => {
      const key = String(id)
      const res = await iterationApi.get(key)
      return { iterationKey: res.iterationKey }
    },
    create: async (payload: CreateIterationRequest) => {
      await iterationApi.create(payload)
      ElMessage.success(t('common.save'))
    },
    update: async (id, payload: CreateIterationRequest) => {
      await iterationApi.create(payload)
      ElMessage.success(t('common.save'))
    },
    defaultForm: {
      iterationKey: ''
    }
  })
  
  onSuccess(() => {
    entityRef.value?.close()
    emit('success')
  })
  
  const rules: FormRules = {
    iterationKey: [{ required: true, message: t('common.pleaseEnter') + t('iteration.columns.key'), trigger: 'blur' }]
  }
  
  const openCreate = () => {
    open({ mode: 'create' })
    entityRef.value?.open()
  }
  
  const onOpened = () => {
    formRef.value?.clearValidate()
  }
  
  defineExpose({ open: openCreate })
  </script>
  
  <style scoped>
  </style>
