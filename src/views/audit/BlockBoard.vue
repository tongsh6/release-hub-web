<template>
  <div class="page-container">
    <div class="toolbar">
      <el-button type="primary">{{ t('audit.retrySelected') }}</el-button>
    </div>
    <el-row :gutter="16">
      <el-col :span="8" v-for="group in groups" :key="group.reasonKey">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ t(`audit.reasons.${group.reasonKey}`) }}</span>
              <el-tag type="warning">{{ group.items.length }}</el-tag>
            </div>
          </template>
          <el-empty :description="t('common.todo')" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const groups = [
  { reasonKey: 'conflict', items: [] },
  { reasonKey: 'pipelineFailed', items: [] },
  { reasonKey: 'approvalRequired', items: [] }
]
</script>

<style scoped>
.page-container { padding: 20px; }
.toolbar { display: flex; justify-content: flex-end; margin-bottom: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
