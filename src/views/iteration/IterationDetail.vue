<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('iteration.columns.key') }}: {{ iterationKey }}</span>
          <el-button type="primary" :disabled="!canWrite">{{ t('iteration.detail.attachToWindow') }}</el-button>
        </div>
      </template>
      <div>{{ t('iteration.detail.associatedRepos') }}</div>
      <el-empty :description="t('common.todo')" />
    </el-card>

    <el-card style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>{{ t('iteration.detail.mountedWindows') }}</span>
          <el-button type="primary" :disabled="!canWrite">{{ t('iteration.detail.orchestrateThisIteration') }}</el-button>
        </div>
      </template>
      <el-empty :description="t('common.todo')" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const iterationKey = route.params.iterationKey as string
const userStore = useUserStore()
const canWrite = userStore.hasPermission('iteration:write')
</script>

<style scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
