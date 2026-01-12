<template>
  <div class="page-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>{{ t('run.detail.title') }}: {{ runId }}</span>
          <div>
            <el-button type="primary" @click="handleExport">{{ t('run.detail.exportJson') }}</el-button>
          </div>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="t('run.columns.type')">{{ detail?.runType }}</el-descriptions-item>
        <el-descriptions-item :label="t('run.columns.status')">{{ detail?.status }}</el-descriptions-item>
        <el-descriptions-item :label="t('run.columns.start')">{{ detail?.startedAt }}</el-descriptions-item>
        <el-descriptions-item :label="t('run.columns.end')">{{ detail?.finishedAt }}</el-descriptions-item>
        <el-descriptions-item :label="t('run.columns.operator')">{{ detail?.operator }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card style="margin-top: 16px;" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>{{ t('run.detail.triplesTitle') }}</span>
        </div>
      </template>
      <el-table :data="detail?.items || []" style="width: 100%">
        <el-table-column prop="repo" :label="t('run.filters.repo')" />
        <el-table-column prop="windowKey" :label="t('run.filters.windowKey')" />
        <el-table-column prop="iterationKey" :label="t('run.filters.iterationKey')" />
        <el-table-column prop="finalResult" :label="t('run.columns.status')" />
        <el-table-column type="expand">
          <template #default="{ row }">
            <div style="padding: 10px">
              <MRFirstTimeline :steps="row.steps" />
              <el-divider />
              <h4>{{ t('run.steps') }}</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(step, index) in row.steps"
                  :key="index"
                  :timestamp="step.startedAt"
                  :type="getStepType(step.result)"
                >
                  <div>
                    <div class="step-header">
                      <strong>{{ step.actionType }}</strong>: 
                      <el-tag :type="getResultTagType(step.result)" size="small">{{ step.result }}</el-tag>
                    </div>
                    <div class="step-message" v-if="step.message">
                      <div v-if="step.actionType === 'UPDATE_VERSION' && extractDiff(step.message)">
                        <div class="version-info">{{ extractVersionInfo(step.message) }}</div>
                        <DiffViewer :diff="extractDiff(step.message)" />
                      </div>
                      <div v-else>{{ step.message }}</div>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { runApi, type RunDetail } from '@/api/runApi'
import MRFirstTimeline from '@/components/run/MRFirstTimeline.vue'
import DiffViewer from '@/components/run/DiffViewer.vue'

const route = useRoute()
const runId = route.params.runId as string
const { t } = useI18n()
const loading = ref(false)
const detail = ref<RunDetail>()

async function fetchDetail() {
  loading.value = true
  try {
    detail.value = await runApi.getRunById(runId)
  } finally {
    loading.value = false
  }
}

function handleExport() {
  window.open(`/api/v1/runs/${runId}/export.json`, '_blank')
}

function getStepType(result: string): string {
  if (result === 'VERSION_UPDATE_SUCCESS' || result === 'SUCCESS') return 'success'
  if (result === 'VERSION_UPDATE_FAILED' || result === 'FAILED') return 'danger'
  return 'primary'
}

function getResultTagType(result: string): string {
  if (result === 'VERSION_UPDATE_SUCCESS' || result === 'SUCCESS') return 'success'
  if (result === 'VERSION_UPDATE_FAILED' || result === 'FAILED') return 'danger'
  return 'info'
}

function extractVersionInfo(message: string): string {
  // 提取版本更新信息（第一行）
  const lines = message.split('\n')
  return lines[0] || message
}

function extractDiff(message: string): string | null {
  // 提取 diff 部分（支持多种格式）
  // 格式1: "--- Diff ---\n..."
  // 格式2: "Diff preview:\n..."
  // 格式3: 包含 "@@ " 的 unified diff
  
  let diffIndex = message.indexOf('--- Diff ---')
  if (diffIndex !== -1) {
    return message.substring(diffIndex + '--- Diff ---\n'.length).trim()
  }
  
  diffIndex = message.indexOf('Diff preview:')
  if (diffIndex !== -1) {
    return message.substring(diffIndex + 'Diff preview:\n'.length).trim()
  }
  
  // 如果消息中直接包含 unified diff 格式
  diffIndex = message.indexOf('@@ ')
  if (diffIndex !== -1) {
    return message.substring(diffIndex).trim()
  }
  
  return null
}

onMounted(fetchDetail)
</script>

<style scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.step-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.step-message {
  margin-top: 8px;
  color: #606266;
}
.version-info {
  margin-bottom: 8px;
  font-weight: 500;
}
</style>
