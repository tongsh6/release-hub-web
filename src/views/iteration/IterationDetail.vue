<template>
  <div class="page-container" v-loading="loading">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('iteration.columns.key') }}: {{ iterationKey }}</span>
          <el-button v-perm.disable="'iteration:write'" type="primary" @click="openAttachWindow">{{ t('iteration.detail.attachToWindow') }}</el-button>
        </div>
      </template>
      <div>{{ t('iteration.detail.associatedRepos') }}</div>
      <div v-if="iteration">
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="t('iteration.columns.repos')">
            {{ iteration.repoCount }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('iteration.columns.attachAt')">
            {{ iteration.attachAt ? new Date(iteration.attachAt).toLocaleString() : '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-empty v-else :description="t('common.noData')" />
    </el-card>

    <el-card style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>{{ t('iteration.detail.mountedWindows') }}</span>
          <el-button v-perm.disable="'iteration:write'" type="primary" @click="openOrchestrate">{{ t('iteration.detail.orchestrateThisIteration') }}</el-button>
        </div>
      </template>
      <div v-if="iteration">
        <el-descriptions :column="1" border>
          <el-descriptions-item :label="t('iteration.columns.mountedWindows')">
            {{ iteration.mountedWindows }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-empty v-else :description="t('common.noData')" />
    </el-card>
  </div>
  <AttachWindowDialog ref="attachRef" @success="fetchDetail" />
  <OrchestrateDialog ref="orchestrateRef" @success="fetchDetail" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { ref, onMounted } from 'vue'
import { iterationApi, type Iteration } from '@/api/iterationApi'
import { handleError } from '@/utils/error'
import AttachWindowDialog from './AttachWindowDialog.vue'
import OrchestrateDialog from './OrchestrateDialog.vue'
import { hasPerm } from '@/utils/perm'
import { ElMessage } from 'element-plus'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const iterationKey = route.params.iterationKey as string
const userStore = useUserStore()

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
</script>

<style scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
