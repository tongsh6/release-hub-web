<template>
  <div class="release-window-detail-page" v-loading="loading">
    <div class="page-header">
      <h2>{{ title }}</h2>
      <div class="actions">
        <el-button @click="goBack">{{ t('common.back') }}</el-button>
        <el-button
          v-perm.disable="'release-window:write'"
          type="primary"
          @click="goAttach"
        >
          {{ t('iteration.detail.attachToWindow') }}
        </el-button>
      </div>
    </div>

    <el-card v-if="form.id">
      <el-descriptions border :column="2" :title="t('common.basicInfo')">
        <el-descriptions-item :label="t('releaseWindow.windowKey')">{{ form.windowKey }}</el-descriptions-item>
        <el-descriptions-item :label="t('releaseWindow.name')">{{ form.name }}</el-descriptions-item>
        <el-descriptions-item :label="t('releaseWindow.status')">
          <el-tag>{{ form.status ? t(`releaseWindow.statusText.${form.status}`) : '-' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('releaseWindow.frozen')">
          <el-tag :type="form.frozen ? 'danger' : 'success'">{{ form.frozen ? t('common.yes') : t('common.no') }}</el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item :label="t('releaseWindow.startAt')">{{ form.startAt || '-' }}</el-descriptions-item>
        <el-descriptions-item :label="t('releaseWindow.endAt')">{{ form.endAt || '-' }}</el-descriptions-item>

        <el-descriptions-item :label="t('releaseWindow.createdAt')">
          {{ form.createdAt ? new Date(form.createdAt).toLocaleString() : '-' }}
        </el-descriptions-item>
         <el-descriptions-item :label="t('releaseWindow.updatedAt')">
          {{ form.updatedAt ? new Date(form.updatedAt).toLocaleString() : '-' }}
        </el-descriptions-item>

        <el-descriptions-item :label="t('releaseWindow.publishedAt')" v-if="form.publishedAt">
          {{ new Date(form.publishedAt).toLocaleString() }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { releaseWindowApi, type ReleaseWindow } from '@/api/modules/releaseWindow'
import { handleError } from '@/utils/error'
import { hasPerm } from '@/utils/perm'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const loading = ref(false)
const form = ref<Partial<ReleaseWindow>>({})

const load = async (id: string) => {
  loading.value = true
  try {
    form.value = await releaseWindowApi.get(id)
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    load(id)
  }
})

const title = computed(() => form.value.name || t('releaseWindow.details'))

const goBack = () => {
  router.back()
}

const goAttach = () => {
  if (!form.value?.id) return
  if (!hasPerm('release-window:write')) {
    ElMessage.warning(t('common.permissionDenied'))
    return
  }
  router.push({ name: 'ReleaseWindowAttach', params: { id: form.value.id } })
}
</script>

<style scoped>
.release-window-detail-page {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
