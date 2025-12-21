<template>
  <EntityDialog
    ref="entityRef"
    :title="mode === 'edit' ? t('group.edit') : t('group.create')"
    :confirm-text="t('common.confirm')"
    :cancel-text="t('common.cancel')"
    @confirm="submit"
    @opened="onOpened"
  >
    <template #default>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="96px">
        <el-form-item :label="t('group.name')" prop="name">
          <el-input v-model="form.name" :placeholder="t('common.pleaseEnter') + t('group.name')" />
        </el-form-item>
        <el-form-item :label="t('group.code')" prop="code">
          <el-input v-model="form.code" :placeholder="t('common.pleaseEnter') + t('group.code')" />
        </el-form-item>
        <el-form-item v-if="form.parentCode" :label="t('group.parentCode')">
          <el-tag type="info">{{ presetParentName }}</el-tag>
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
import { groupApi, type GroupView } from '@/api/modules/group'
import { useDialogForm } from '@/composables/crud/useDialogForm'

const { t } = useI18n()
const emit = defineEmits<{ (e: 'success'): void }>()

const entityRef = ref<InstanceType<typeof EntityDialog>>()
const formRef = ref<FormInstance>()
const presetParentName = ref<string | undefined>(undefined)

type GroupForm = Pick<GroupView, 'name' | 'code' | 'parentCode'>

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
} = useDialogForm<GroupForm>({
  fetchById: async (id) => {
    const code = String(id)
    const res = await groupApi.get(code)
    return { name: res.name!, code: res.code!, parentCode: res.parentCode }
  },
  create: async (payload: GroupForm) => {
    await groupApi.create({
      name: payload.name!,
      code: payload.code!,
      parentCode: payload.parentCode
    })
    ElMessage.success(t('group.createSuccess'))
  },
  update: async (id, payload: GroupForm) => {
    const code = String(id)
    await groupApi.update(code, {
      name: payload.name!,
      code: payload.code!,
      parentCode: payload.parentCode
    })
    ElMessage.success(t('group.updateSuccess'))
  },
  defaultForm: {
    name: '',
    code: '',
    parentCode: undefined
  }
})

onSuccess(() => emit('success'))
onSuccess(() => {
  entityRef.value?.close()
  emit('success')
})

const rules: FormRules = {
  name: [{ required: true, message: t('common.pleaseEnter') + t('group.name'), trigger: 'blur' }],
  code: [{ required: true, message: t('common.pleaseEnter') + t('group.code'), trigger: 'blur' }]
}

const openWithPreset = (opts?: { parentCode?: string; parentName?: string }) => {
  presetParentName.value = opts?.parentName
  open({ mode: 'create', preset: { parentCode: opts?.parentCode } })
  entityRef.value?.open()
}

const openEdit = (code: string) => {
  open({ mode: 'edit', id: code })
  entityRef.value?.open()
}

const onOpened = () => {
  formRef.value?.clearValidate()
}

defineExpose({ open: openWithPreset, openEdit })
</script>

<style scoped>
</style>
