<template>
  <div class="page-container">
    <el-card>
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

    <el-card style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>{{ t('run.detail.triplesTitle') }}</span>
        </div>
      </template>
      <el-empty :description="t('common.todo')" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
const route = useRoute()
const runId = route.params.runId as string
const { t } = useI18n()
</script>

<style scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
