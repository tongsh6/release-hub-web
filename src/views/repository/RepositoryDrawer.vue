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
            <span>{{ t('repository.columns.repo') }}: {{ repo }}</span>
            <div>
              <el-button @click="refresh">{{ t('common.refresh') }}</el-button>
              <el-button type="primary">{{ t('repository.openGitLab') }}</el-button>
            </div>
          </div>
        </template>
        <div>{{ t('repository.gateSummary') }}</div>
        <el-empty :description="t('common.todo')" />
      </el-card>

      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>{{ t('repository.branchesMrSummary') }}</span>
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
const repo = ref('')

const open = (repoName: string) => {
  repo.value = repoName
  visible.value = true
}

const refresh = () => {
  // TODO: refresh logic
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
