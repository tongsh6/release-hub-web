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
            <span>{{ t('run.detail.title') }}: {{ runId }}</span>
            <div>
              <el-button type="primary">{{ t('run.detail.exportJson') }}</el-button>
            </div>
          </div>
        </template>
        <div class="run-params">TODO: {{ t('common.detail') }}</div>
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>{{ t('run.detail.triplesTitle') }}</span>
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

const { t } = useI18n()

const visible = ref(false)
const runId = ref('')

const open = (id: string) => {
  runId.value = id
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
