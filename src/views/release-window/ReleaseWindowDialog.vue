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
      label-width="120px"
      v-loading="loading"
      :disabled="mode === 'view'"
    >
      <el-form-item :label="t('releaseWindow.windowKey')" prop="windowKey" v-if="mode === 'create'">
        <el-input v-model="form.windowKey" :placeholder="t('releaseWindow.placeholder.enterWindowKey')" />
      </el-form-item>

      <el-form-item :label="t('releaseWindow.name')" prop="name" v-if="mode === 'create'">
        <el-input v-model="form.name" :placeholder="t('releaseWindow.placeholder.enterName')" />
      </el-form-item>
      
      <el-form-item :label="t('releaseWindow.startAt')" prop="startAt" v-if="mode === 'edit'">
         <el-date-picker
            v-model="form.startAt"
            type="datetime"
            :placeholder="t('common.selectDateTime')"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
      </el-form-item>

      <el-form-item :label="t('releaseWindow.endAt')" prop="endAt" v-if="mode === 'edit'">
         <el-date-picker
            v-model="form.endAt"
            type="datetime"
            :placeholder="t('common.selectDateTime')"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
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
import { releaseWindowApi, type ReleaseWindow } from '@/api/modules/releaseWindow'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'success', payload: any): void
}>()

const formRef = ref<FormInstance>()

// Define a local interface that covers all fields we might edit
interface DialogFormState {
  id: string
  windowKey: string
  name: string
  startAt: string
  endAt: string
}

const { visible, mode, loading, saving, form, open, close, submit, onSuccess } = useDialogForm<DialogFormState>({
  fetchById: async (id) => {
    const res = await releaseWindowApi.get(String(id))
    return {
      id: res.id,
      windowKey: res.windowKey,
      name: res.name,
      startAt: res.startAt || '',
      endAt: res.endAt || ''
    }
  },
  create: async (data) => {
    return releaseWindowApi.create({
      windowKey: data.windowKey,
      name: data.name
    })
  },
  update: async (id, data) => {
    // In edit mode, we are configuring the window time
    return releaseWindowApi.configure(String(id), {
      startAt: data.startAt,
      endAt: data.endAt
    })
  },
  defaultForm: {
    id: '',
    windowKey: '',
    name: '',
    startAt: '',
    endAt: ''
  }
})

// Bind success callback to emit
onSuccess((payload) => {
  emit('success', payload)
})

const title = computed(() => {
  const map: Record<string, string> = {
    create: t('releaseWindow.create'),
    edit: t('releaseWindow.configureTime'), // Changed title for edit mode
    view: t('releaseWindow.details')
  }
  return map[mode.value]
})

const rules = computed<FormRules>(() => {
  if (mode.value === 'create') {
    return {
      windowKey: [
        { required: true, message: t('releaseWindow.validation.required'), trigger: 'blur' }
      ],
      name: [
        { required: true, message: t('releaseWindow.validation.required'), trigger: 'blur' }
      ]
    }
  }
  if (mode.value === 'edit') {
     return {
      startAt: [
        { required: true, message: t('releaseWindow.validation.required'), trigger: 'change' }
      ],
      endAt: [
        { required: true, message: t('releaseWindow.validation.required'), trigger: 'change' }
      ]
    }
  }
  return {}
})

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      await submit()
      // onSuccess is handled inside useDialogForm submit logic, 
      // but if we want to ensure emit happens only on success and then close
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
