import { ref } from 'vue'
import { projectApi } from '@/api'
import type { ProjectTreeNode } from '@/api/modules/project'
import { handleError } from '@/utils/error'

export function useProjectTree() {
  const loading = ref(false)
  const treeData = ref<ProjectTreeNode[]>([])
  const selected = ref<ProjectTreeNode | null>(null)

  async function loadTree() {
    loading.value = true
    try {
      const data = await projectApi.getProjectTree()
      treeData.value = Array.isArray(data) ? data : []
      if (!selected.value && treeData.value.length > 0) {
        selected.value = treeData.value[0] || null
      }
    } catch (err) {
      treeData.value = []
      selected.value = null
      handleError(err)
    } finally {
      loading.value = false
    }
  }

  function onNodeClick(node: ProjectTreeNode) {
    selected.value = node
  }

  return { loading, treeData, selected, loadTree, onNodeClick }
}
