<template>
  <el-drawer
    v-model="visible"
    :title="t('common.detail')"
    size="50%"
    destroy-on-close
  >
    <div class="drawer-content">
      <el-card shadow="never" class="mb-4">
        <template #header>
          <div class="card-header">
            <span>{{ t('iteration.columns.key') }}: {{ iterationKey }}</span>
            <el-button type="primary" :disabled="!canWrite">{{ t('iteration.detail.attachToWindow') }}</el-button>
          </div>
        </template>
        <div>{{ t('iteration.detail.associatedRepos') }}</div>
        <el-empty :description="t('common.todo')" />
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>{{ t('iteration.detail.mountedWindows') }}</span>
            <el-button type="primary" :disabled="!canWrite">{{ t('iteration.detail.orchestrateThisIteration') }}</el-button>
          </div>
        </template>
        <el-empty :description="t('common.todo')" />
      </el-card>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const userStore = useUserStore()
const canWrite = userStore.hasPermission('iteration:write')

const visible = ref(false)
const iterationKey = ref('')

const open = (key: string) => {
  iterationKey.value = key
  visible.value = true
}

defineExpose({
  open
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
