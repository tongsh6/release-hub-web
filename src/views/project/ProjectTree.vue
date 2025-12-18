<template>
  <div class="page-container">
    <el-container class="tree-container">
      <el-aside width="300px" class="tree-aside" v-loading="loading">
        <div class="tree-header">
          <el-input v-model="filterText" :placeholder="t('project.filter')" />
        </div>
        <el-tree
          v-if="treeData.length > 0"
          ref="treeRef"
          class="filter-tree"
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          :highlight-current="true"
          @node-click="handleNodeClick"
        />
        <el-empty v-else-if="!loading" :description="t('project.noProject')" />
      </el-aside>
      <el-main>
        <div v-if="selectedNode" class="project-detail">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ selectedNode.name }}</span>
                <el-button type="primary" link>{{ t('common.edit') }}</el-button>
              </div>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item :label="t('project.name')">{{ selectedNode.name }}</el-descriptions-item>
              <el-descriptions-item :label="t('project.type')">{{ selectedNode.type }}</el-descriptions-item>
              <el-descriptions-item :label="t('project.status')">{{ selectedNode.status }}</el-descriptions-item>
              <el-descriptions-item v-if="selectedNode.code" :label="t('project.code')">{{ selectedNode.code }}</el-descriptions-item>
              
              <template v-if="selectedNode.repo">
                <el-descriptions-item :label="t('project.repoUrl')">{{ selectedNode.repo.repoUrl }}</el-descriptions-item>
                <el-descriptions-item :label="t('project.buildTool')">{{ selectedNode.repo.buildTool }}</el-descriptions-item>
                <el-descriptions-item v-if="selectedNode.repo.defaultBranch" :label="t('project.defaultBranch')">{{ selectedNode.repo.defaultBranch }}</el-descriptions-item>
              </template>
            </el-descriptions>
          </el-card>
        </div>
        <div v-else class="empty-state">
          <el-empty :description="t('project.selectTip')" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ElTree } from 'element-plus'
import type { ProjectTreeNode } from '@/api/modules/project'
import { useProjectTree } from '@/composables/useProjectTree'

const { t } = useI18n()
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const { loading, treeData, selected: selectedNode, loadTree, onNodeClick: handleNodeClick } = useProjectTree()

const defaultProps = {
  children: 'children',
  label: 'name',
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: ProjectTreeNode) => {
  if (!value) return true
  return data.name.includes(value)
}

onMounted(() => {
  loadTree()
})
</script>

<style scoped>
.page-container {
  height: calc(100vh - 100px); /* Adjust based on layout header/padding */
  padding: 20px;
}
.tree-container {
  height: 100%;
  background-color: #fff;
  border: 1px solid #dcdfe6;
}
.tree-aside {
  border-right: 1px solid #dcdfe6;
  padding: 10px;
}
.tree-header {
  margin-bottom: 10px;
}
.project-detail {
  padding: 20px;
}
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
