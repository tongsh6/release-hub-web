<template>
  <div class="page-container" v-loading="loading">
    <!-- 基本信息卡片 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">{{ t('iteration.columns.key') }}: {{ iterationKey }}</span>
          <div class="actions">
            <el-button v-perm.disable="'iteration:write'" type="primary" @click="openAttachWindow">{{ t('iteration.detail.attachToWindow') }}</el-button>
          </div>
        </div>
      </template>
      <div v-if="iteration">
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="t('iteration.columns.key')">
            {{ iteration.iterationKey }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('iteration.columns.description')">
            {{ iteration.description || '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('iteration.columns.createdAt')">
            {{ iteration.createdAt ? new Date(iteration.createdAt).toLocaleString() : '-' }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('iteration.columns.updatedAt')">
            {{ iteration.updatedAt ? new Date(iteration.updatedAt).toLocaleString() : '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-empty v-else :description="t('common.noData')" />
    </el-card>

    <!-- 关联仓库卡片 -->
    <el-card style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span class="title">{{ t('iteration.detail.associatedRepos') }} ({{ iteration?.repoCount || 0 }})</span>
          <div class="actions">
            <el-button v-perm.disable="'iteration:write'" type="primary" size="small" @click="openAddRepos">{{ t('iteration.detail.addRepos') }}</el-button>
          </div>
        </div>
      </template>
      <div v-if="iteration && iteration.repoIds && iteration.repoIds.length > 0">
        <el-tag 
          v-for="repoId in iteration.repoIds" 
          :key="repoId" 
          style="margin: 4px;"
          closable
          @close="handleRemoveRepo(repoId)"
        >
          {{ repoId }}
        </el-tag>
      </div>
      <el-empty v-else :description="t('iteration.detail.noRepos')" />
    </el-card>

    <!-- 操作卡片 -->
    <el-card style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span class="title">{{ t('iteration.detail.operations') }}</span>
        </div>
      </template>
      <div class="operations">
        <el-button v-perm.disable="'iteration:write'" type="primary" @click="openOrchestrate">{{ t('iteration.detail.orchestrateThisIteration') }}</el-button>
      </div>
    </el-card>
  </div>
  <AttachWindowDialog ref="attachRef" @success="fetchDetail" />
  <OrchestrateDialog ref="orchestrateRef" @success="fetchDetail" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { iterationApi, type Iteration } from '@/api/iterationApi'
import { handleError } from '@/utils/error'
import AttachWindowDialog from './AttachWindowDialog.vue'
import OrchestrateDialog from './OrchestrateDialog.vue'
import { hasPerm } from '@/utils/perm'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const iterationKey = route.params.iterationKey as string

const loading = ref(false)
const iteration = ref<Iteration | null>(null)
const attachRef = ref<InstanceType<typeof AttachWindowDialog>>()
const orchestrateRef = ref<InstanceType<typeof OrchestrateDialog>>()

const fetchDetail = async () => {
  loading.value = true
  iteration.value = null
  try {
    const res = await iterationApi.get(iterationKey)
    iteration.value = res
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetail)

const openAttachWindow = () => {
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  attachRef.value?.open(iterationKey)
}

const openOrchestrate = () => {
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  orchestrateRef.value?.open()
}

const openAddRepos = () => {
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  // TODO: 打开添加仓库对话框
  ElMessage.info(t('common.featureComingSoon'))
}

const handleRemoveRepo = async (repoId: string) => {
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  
  try {
    await ElMessageBox.confirm(
      t('iteration.detail.confirmRemoveRepo', { repoId }),
      t('common.warning'),
      { type: 'warning' }
    )
    
    await iterationApi.removeRepos(iterationKey, [repoId])
    ElMessage.success(t('common.success'))
    fetchDetail()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error(t('common.requestFailed'))
    }
  }
}
</script>

<style scoped>
.page-container { 
  padding: 20px; 
}

.card-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}

.card-header .title {
  font-weight: 500;
}

.card-header .actions {
  display: flex;
  gap: 8px;
}

.operations {
  display: flex;
  gap: 12px;
}
</style>
