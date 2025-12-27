<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('repository.columns.repo') }}: {{ repoId }}</span>
          <div>
            <el-button @click="handleSync" :loading="syncing">{{ t('common.sync') }}</el-button>
            <el-button @click="refresh">{{ t('common.refresh') }}</el-button>
            <el-button type="primary">{{ t('repository.openGitLab') }}</el-button>
          </div>
        </div>
      </template>
      <div class="mb-2">{{ t('repository.gateSummary') }}</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="Protected Branch">
          <el-tag :type="gateSummary?.protectedBranch ? 'success' : 'danger'">{{ gateSummary?.protectedBranch ? t('common.yes') : t('common.no') }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Approval Required">
          <el-tag :type="gateSummary?.approvalRequired ? 'success' : 'warning'">{{ gateSummary?.approvalRequired ? t('common.yes') : t('common.no') }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Pipeline Gate">
          <el-tag :type="gateSummary?.pipelineGate ? 'success' : 'warning'">{{ gateSummary?.pipelineGate ? t('common.yes') : t('common.no') }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Permission Denied">
          <el-tag :type="gateSummary?.permissionDenied ? 'danger' : 'success'">{{ gateSummary?.permissionDenied ? t('common.yes') : t('common.no') }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>{{ t('repository.branchesMrSummary') }}</span>
        </div>
      </template>
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="8">
          <el-statistic title="Total Branches" :value="branchSummary?.totalBranches || 0" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="Active Branches" :value="branchSummary?.activeBranches || 0" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="Non-Compliant" :value="branchSummary?.nonCompliantBranches || 0" :value-style="branchSummary?.nonCompliantBranches ? { color: 'var(--el-color-danger)' } : {}" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-statistic title="Active MRs" :value="branchSummary?.activeMrs || 0" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="Merged MRs" :value="branchSummary?.mergedMrs || 0" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="Closed MRs" :value="branchSummary?.closedMrs || 0" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { repositoryApi, type Repository, type GateSummary, type BranchSummary } from '@/api/repositoryApi'
import { ElMessage } from 'element-plus'

const route = useRoute()
const repoId = route.params.repo as string
const { t } = useI18n()

const detail = ref<Repository>()
const gateSummary = ref<GateSummary>()
const branchSummary = ref<BranchSummary>()
const syncing = ref(false)

async function handleSync() {
  if (!repoId) return
  syncing.value = true
  try {
    await repositoryApi.sync(repoId)
    ElMessage.success(t('common.success'))
    refresh()
  } catch (e) {
    console.error(e)
  } finally {
    syncing.value = false
  }
}

async function refresh() {
  if (!repoId) return
  try {
    const [d, g, b] = await Promise.all([
      repositoryApi.get(repoId),
      repositoryApi.getGateSummary(repoId),
      repositoryApi.getBranchSummary(repoId)
    ])
    detail.value = d
    gateSummary.value = g
    branchSummary.value = b
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  refresh()
})
</script>

<style scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
