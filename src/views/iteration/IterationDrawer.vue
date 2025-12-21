<template>
  <el-drawer
    v-model="visible"
    :title="t('common.detail')"
    size="50%"
    destroy-on-close
  >
    <div class="drawer-content" v-loading="loading">
      <el-card shadow="never" class="mb-4">
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
              {{ new Date(iteration.attachAt).toLocaleString() }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-empty v-else :description="t('common.noData')" />
      </el-card>

      <el-card shadow="never">
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
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { iterationApi, type Iteration } from '@/api/iterationApi'
import { handleError } from '@/utils/error'
import AttachWindowDialog from './AttachWindowDialog.vue'
import OrchestrateDialog from './OrchestrateDialog.vue'
import { hasPerm } from '@/utils/perm'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const userStore = useUserStore()

const visible = ref(false)
const iterationKey = ref('')
const iteration = ref<Iteration | null>(null)
const loading = ref(false)
const attachRef = ref<InstanceType<typeof AttachWindowDialog>>()
const orchestrateRef = ref<InstanceType<typeof OrchestrateDialog>>()

const open = (key: string) => {
  iterationKey.value = key
  fetchDetail()
  visible.value = true
}

const fetchDetail = async () => {
  loading.value = true
  iteration.value = null
  try {
    const res = await iterationApi.get(iterationKey.value)
    iteration.value = res
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

defineExpose({
  open
})

const openAttachWindow = () => {
  if (!iterationKey.value) return
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  attachRef.value?.open(iterationKey.value)
}

const openOrchestrate = () => {
  if (!iterationKey.value) return
  if (!hasPerm('iteration:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  orchestrateRef.value?.open()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
