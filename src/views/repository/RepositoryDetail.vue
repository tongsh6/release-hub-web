<template>
  <div class="page-container">
    <el-card>
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

    <el-card style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>{{ t('repository.branchesMrSummary') }}</span>
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
const repo = route.params.repo as string
const { t } = useI18n()

function refresh() {}
</script>

<style scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
