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
                  :type="step.result === 'SUCCESS' ? 'success' : step.result === 'FAILED' ? 'danger' : 'primary'"
                >
                  {{ step.actionType }}: {{ step.result }} ({{ step.message }})
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

onMounted(fetchDetail)
</script>

<style scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
