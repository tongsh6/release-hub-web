<template>
  <div class="group-list-page">
    <SearchForm :loading="false" @search="search" @reset="reset">
      <el-form-item :label="t('common.keyword')">
        <el-input v-model="keyword" :placeholder="t('group.searchPlaceholder')" clearable />
      </el-form-item>
      <template #extra-actions>
        <el-button v-if="hasPerm('group:write')" type="primary" @click="handleCreateTop">{{ t('group.createTop') }}</el-button>
      </template>
    </SearchForm>

    <el-container class="content">
      <el-aside width="320px" class="tree-aside" v-loading="loading">
        <el-tree
          ref="treeRef"
          :data="filteredTree"
          node-key="code"
          :props="treeProps"
          default-expand-all
          :filter-node-method="filterNode"
          :highlight-current="true"
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <div class="tree-node">
              <span class="node-label">{{ data.name }}</span>
              <span class="node-code">{{ data.code }}</span>
              <div class="node-actions">
                <el-button link type="primary" @click.stop="handleView(data)">{{ t('common.detail') }}</el-button>
                <el-button 
                  v-if="hasPerm('group:write')" 
                  link 
                  type="primary" 
                  @click.stop="handleEdit(data)"
                >
                  {{ t('common.edit') }}
                </el-button>
                <el-button 
                  v-if="hasPerm('group:write')" 
                  link 
                  type="success" 
                  @click.stop="handleCreateChild(data)"
                >
                  {{ t('group.createChild') }}
                </el-button>
                <el-button 
                  v-if="hasPerm('group:delete')" 
                  link 
                  type="danger" 
                  @click.stop="handleDelete(data)"
                >
                  {{ t('common.delete') }}
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
        <el-empty v-if="!loading && treeData.length === 0" :description="t('group.empty')" />
      </el-aside>
      <el-main>
        <el-card v-if="selected" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>{{ t('group.detail') }}</span>
              <div>
                <el-button type="primary" @click="handleView(selected!)">{{ t('common.detail') }}</el-button>
                <el-button v-if="hasPerm('group:write')" @click="handleEdit(selected!)">{{ t('common.edit') }}</el-button>
                <el-button v-if="hasPerm('group:write')" type="success" @click="handleCreateChild(selected!)">{{ t('group.createChild') }}</el-button>
                <el-button v-if="hasPerm('group:delete')" type="danger" @click="handleDelete(selected!)">{{ t('common.delete') }}</el-button>
              </div>
            </div>
          </template>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">{{ t('group.name') }}</span>
              <span class="value">{{ selected!.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('group.code') }}</span>
              <span class="value">{{ selected!.code }}</span>
            </div>
            <div class="detail-item" v-if="selected!.parentCode">
              <span class="label">{{ t('group.parentCode') }}</span>
              <span class="value">{{ selected!.parentCode }}</span>
            </div>
          </div>
        </el-card>
        <el-empty v-else :description="t('group.notFound')" />
      </el-main>
    </el-container>
  </div>
  <GroupDialog ref="dialogRef" @success="loadTree" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ElTree } from 'element-plus'
import { useI18n } from 'vue-i18n'
import SearchForm from '@/components/crud/SearchForm.vue'
import { groupApi, type GroupNode } from '@/api/modules/group'
import GroupDialog from './GroupDialog.vue'
import { useGroupTree } from '@/composables/useGroupTree'
import { hasPerm } from '@/utils/perm'
import { ElMessageBox, ElMessage } from 'element-plus'

const { t } = useI18n()
const router = useRouter()
const { loading, treeData, selected, loadTree, onNodeClick } = useGroupTree()
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeProps = { children: 'children', label: 'name' }
const dialogRef = ref<InstanceType<typeof GroupDialog>>()

const keyword = ref('')
const filteredTree = computed(() => {
  if (!keyword.value) return treeData.value
  const k = keyword.value.toLowerCase()
  const filterFn = (node: GroupNode): GroupNode | null => {
    const match = node.name?.toLowerCase().includes(k) || node.code?.toLowerCase().includes(k)
    const children = (node.children || [])
      .map(filterFn)
      .filter((c): c is GroupNode => c !== null)
    if (match || children.length) {
      return { ...node, children }
    }
    return null
  }
  return treeData.value.map(filterFn).filter((n): n is GroupNode => n !== null)
})

watch(keyword, (val) => {
  treeRef.value?.filter(val)
})

const filterNode = (value: string, data: GroupNode) => {
  if (!value) return true
  return data.name?.toLowerCase().includes(value.toLowerCase())
}

const handleNodeClick = (node: GroupNode) => {
  onNodeClick(node)
}

const handleView = (node: GroupNode) => {
  router.push({ name: 'GroupDetail', params: { id: node.id } })
}

const handleCreateTop = () => {
  if (!hasPerm('group:write')) {
    ElMessage.warning(t('common.permissionDenied') || '无权限')
    return
  }
  dialogRef.value?.open()
}

const handleCreateChild = (parent: GroupNode) => {
  if (!hasPerm('group:write')) {
    ElMessage.warning(t('common.permissionDenied') || '无权限')
    return
  }
  dialogRef.value?.open({ parentCode: parent.code, parentName: parent.name })
}

const handleEdit = (node: GroupNode) => {
  if (!hasPerm('group:write')) {
    ElMessage.warning(t('common.permissionDenied') || '无权限')
    return
  }
  dialogRef.value?.openEdit(node.id!)
}

const handleDelete = async (node: GroupNode) => {
  if (!hasPerm('group:delete')) {
    ElMessage.warning(t('common.permissionDenied') || '无权限')
    return
  }
  await ElMessageBox.confirm(t('group.confirmDelete'), t('common.warning'), { type: 'warning' })
  await groupApi.remove(node.id!)
  ElMessage.success(t('group.deleteSuccess'))
  await loadTree()
}

const search = () => {
  // computed 已根据 keyword 过滤，无需额外处理
}
const reset = () => {
  keyword.value = ''
}

onMounted(loadTree)
</script>

<style scoped>
.group-list-page {
  padding: 16px;
}
.content {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  min-height: 520px;
}
.tree-aside {
  border-right: 1px solid #dcdfe6;
  padding: 12px;
}
.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.node-label {
  font-weight: 500;
}
.node-code {
  color: #909399;
  margin-left: 6px;
}
.node-actions {
  margin-left: auto;
  display: flex;
  gap: 6px;
}
.detail-card {
  margin: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.detail-item .label {
  color: #606266;
  margin-right: 8px;
}
.detail-item .value {
  font-weight: 500;
}
</style>
