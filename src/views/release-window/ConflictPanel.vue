<template>
  <div v-loading="scanning" class="conflict-panel">
    <!-- 状态概览 -->
    <el-alert
      v-if="!report"
      type="info"
      :title="t('conflict.notScanned')"
      :description="t('conflict.notScannedHint')"
      show-icon
      :closable="false"
    />

    <el-alert
      v-else-if="report.hasConflicts"
      type="error"
      :title="t('conflict.hasConflicts', { count: report.totalCount })"
      show-icon
      :closable="false"
    />

    <el-alert
      v-else
      type="success"
      :title="t('conflict.noConflicts')"
      show-icon
      :closable="false"
    />

    <!-- 操作栏 -->
    <div class="panel-toolbar">
      <el-button :loading="scanning" type="primary" @click="handleScan">
        {{ t('conflict.rescan') }}
      </el-button>
      <span v-if="report" class="scan-time">
        {{ t('conflict.lastScanAt') }}: {{ formatTime(report.checkedAt) }}
      </span>
    </div>

    <!-- 冲突列表 -->
    <el-table
      v-if="report && report.conflicts.length > 0"
      :data="report.conflicts"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column prop="repoName" :label="t('conflict.repoName')" width="150" />
      <el-table-column prop="iterationKey" :label="t('conflict.iteration')" width="180" />
      <el-table-column :label="t('conflict.type')" width="180">
        <template #default="{ row }">
          <el-tag :type="getTagType(row.conflictType)">
            {{ t(`conflict.types.${row.conflictType}`) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('conflict.branches')" width="200">
        <template #default="{ row }">
          <span v-if="row.sourceBranch">
            {{ row.sourceBranch }} → {{ row.targetBranch }}
          </span>
          <span v-else-if="row.systemVersion">
            {{ row.systemVersion }} ≠ {{ row.repoVersion }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="message" :label="t('conflict.message')" min-width="300" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { checkConflicts, getConflicts, type ConflictReportView } from '@/api/modules/releaseWindow'
import dayjs from 'dayjs'

const props = defineProps<{ windowId: string }>()
const { t } = useI18n()

const report = ref<ConflictReportView | null>(null)
const scanning = ref(false)

const handleScan = async () => {
  scanning.value = true
  try {
    report.value = await checkConflicts(props.windowId)
  } finally {
    scanning.value = false
  }
}

const formatTime = (iso: string) => dayjs(iso).format('YYYY-MM-DD HH:mm:ss')

const getTagType = (type: string) => {
  switch (type) {
    case 'MISMATCH':
    case 'MERGE_CONFLICT':
      return 'danger'
    case 'BRANCH_EXISTS':
    case 'BRANCH_NONCOMPLIANT':
      return 'warning'
    case 'CROSS_REPO_VERSION_MISMATCH':
      return 'info'
    default:
      return ''
  }
}

defineExpose({ report })

onMounted(async () => {
  try {
    report.value = await getConflicts(props.windowId)
  } catch {
    // 首次访问，尚未扫描
  }
})
</script>

<style scoped>
.conflict-panel { padding: 16px 0; }
.panel-toolbar { margin-top: 16px; display: flex; align-items: center; gap: 12px; }
.scan-time { color: var(--el-text-color-secondary); font-size: 13px; }
</style>
