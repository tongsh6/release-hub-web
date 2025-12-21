<template>
  <EntityDialog
    ref="entityRef"
    :title="t('iteration.detail.orchestrateThisIteration')"
    :confirm-text="t('iteration.detail.orchestrateThisIteration')"
    :cancel-text="t('common.cancel')"
    @confirm="submit"
    @opened="onOpened"
  >
    <template #default>
      <el-form :model="form" ref="formRef" label-width="120px">
        <el-form-item :label="t('releaseWindow.name')">
          <el-select v-model="form.windowId" :placeholder="t('common.pleaseSelect') + t('releaseWindow.name')">
            <el-option v-for="w in windows" :key="w.id" :label="w.name" :value="w.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-perm.disable="'iteration:write'" type="primary" @click="previewPlan">{{ t('common.preview') }}</el-button>
        </el-form-item>
      </el-form>
      <div v-if="planText" class="plan-preview">
        <pre>{{ planText }}</pre>
      </div>
    </template>
  </EntityDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import EntityDialog from '@/components/common/EntityDialog.vue'
import { releaseWindowApi, type ReleaseWindowView } from '@/api/modules/releaseWindow'
import { handleError } from '@/utils/error'
import { hasPerm } from '@/utils/perm'

const { t } = useI18n()
const emit = defineEmits<{ (e: 'success'): void }>()

const entityRef = ref<InstanceType<typeof EntityDialog>>()
const formRef = ref<FormInstance>()
const windows = ref<ReleaseWindowView[]>([])
const form = ref<{ windowId: string | null }>({ windowId: null })
const planText = ref('')

const open = async () => {
  form.value.windowId = null
  planText.value = ''
  entityRef.value?.open()
  await loadWindows()
}

const loadWindows = async () => {
  try {
    windows.value = await releaseWindowApi.list({ page: 1, pageSize: 100 } as any)
  } catch (err) {
    handleError(err)
  }
}

const previewPlan = async () => {
  if (!form.value.windowId) return
  try {
    const resp = await releaseWindowApi.getDryPlan(form.value.windowId)
    planText.value = typeof resp === 'string' ? resp : JSON.stringify(resp, null, 2)
  } catch (err) {
    handleError(err)
  }
}

const submit = async () => {
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  if (!form.value.windowId) return
  try {
    await releaseWindowApi.orchestrate(form.value.windowId)
    ElMessage.success(t('common.success'))
    emit('success')
    entityRef.value?.close()
  } catch (err) {
    handleError(err)
  }
}

const onOpened = () => {
  formRef.value?.clearValidate()
}

defineExpose({ open })
</script>

<style scoped>
.plan-preview {
  margin-top: 12px;
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
}
</style>
