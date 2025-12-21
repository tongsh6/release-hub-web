<template>
  <div class="attach-page" v-loading="loading">
    <div class="page-header">
      <h2>{{ t('iteration.detail.attachToWindow') }}</h2>
      <div>
        <el-button @click="goBack">{{ t('common.back') }}</el-button>
      </div>
    </div>
    <el-card>
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="t('releaseWindow.windowKey')">{{ window?.windowKey || '-' }}</el-descriptions-item>
        <el-descriptions-item :label="t('releaseWindow.name')">{{ window?.name || '-' }}</el-descriptions-item>
        <el-descriptions-item :label="t('releaseWindow.status')"><el-tag>{{ window?.status || '-' }}</el-tag></el-descriptions-item>
        <el-descriptions-item :label="t('releaseWindow.startAt')">{{ window?.startAt || '-' }}</el-descriptions-item>
        <el-descriptions-item :label="t('releaseWindow.endAt')">{{ window?.endAt || '-' }}</el-descriptions-item>
      </el-descriptions>
      <div class="tips">
        <el-alert
          :title="canAttach ? t('common.ready') : t('common.disabled')"
          :type="canAttach ? 'success' : 'warning'"
          show-icon
        />
      </div>
    </el-card>
    <AttachIterationsDialog ref="dialogRef" @success="reload" />
    <div class="actions">
      <el-button
        v-perm.disable="'release-window:write'"
        type="primary"
        :disabled="!canAttach"
        @click="openAttach"
      >
        {{ t('iteration.detail.attachToWindow') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AttachIterationsDialog from './AttachIterationsDialog.vue'
import { releaseWindowApi, type ReleaseWindowView } from '@/api/modules/releaseWindow'
import { handleError } from '@/utils/error'
import { hasPerm } from '@/utils/perm'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const dialogRef = ref<InstanceType<typeof AttachIterationsDialog>>()

const loading = ref(false)
const window = ref<ReleaseWindowView | null>(null)

const load = async () => {
  const id = route.params.id as string
  if (!id) return
  loading.value = true
  try {
    window.value = await releaseWindowApi.get(id)
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const canAttach = computed(() => {
  const s = window.value?.status
  return s === 'INIT' || s === 'OPEN'
})

const openAttach = () => {
  if (!hasPerm('release-window:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  const id = route.params.id as string
  dialogRef.value?.open(id)
}

const reload = () => {
  load()
}

const goBack = () => router.back()
</script>

<style scoped>
.attach-page { padding: 20px; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.tips { margin-top: 12px; }
.actions { margin-top: 16px; }
</style>
