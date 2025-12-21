<template>
  <div class="group-detail-page" v-loading="loading">
    <el-page-header @back="handleBack" :content="t('group.detail')" />
    <el-card class="mt-12">
      <template #header>
        <div class="card-header">
          <span>{{ detail?.name || t('group.title') }}</span>
          <div>
            <el-button type="primary" @click="handleBack">{{ t('common.back') }}</el-button>
            <el-button v-perm.disable="'group:write'" @click="openEdit()">{{ t('common.edit') }}</el-button>
            <el-button v-perm.disable="'group:delete'" type="danger" @click="handleDelete()">{{ t('common.delete') }}</el-button>
          </div>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item :label="t('group.name')">
          {{ detail?.name }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('group.code')">
          {{ detail?.code }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('group.parentCode')" v-if="detail?.parentCode">
          {{ detail?.parentCode }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-empty v-if="!loading && !detail" :description="t('group.notFound')" />
    <GroupDialog ref="dialogRef" @success="load" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { groupApi, type GroupView } from '@/api/modules/group'
import { hasPerm } from '@/utils/perm'
import GroupDialog from './GroupDialog.vue'
import { ElMessageBox } from 'element-plus'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const detail = ref<GroupView | null>(null)
const dialogRef = ref<InstanceType<typeof GroupDialog>>()

const load = async () => {
  const id = route.params.id as string
  if (!id) return
  loading.value = true
  try {
    detail.value = await groupApi.get(id)
  } catch (e) {
    ElMessage.error(t('common.requestFailed'))
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push({ name: 'Groups' })
}

const openEdit = () => {
  if (!detail.value) return
  dialogRef.value?.openEdit(detail.value.id!)
}

const handleDelete = async () => {
  if (!detail.value) return
  await ElMessageBox.confirm(t('group.confirmDelete'), t('common.warning'), { type: 'warning' })
  await groupApi.remove(detail.value.id!)
  ElMessage.success(t('common.success'))
  handleBack()
}

onMounted(load)
watch(() => route.params.id, load)
</script>

<style scoped>
.mt-12 {
  margin-top: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
