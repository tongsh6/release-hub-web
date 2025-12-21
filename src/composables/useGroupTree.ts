import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { i18n } from '@/i18n'
import { groupApi, type GroupNode } from '@/api/modules/group'

export function useGroupTree() {
  const loading = ref(false)
  const treeData = ref<GroupNode[]>([])
  const selected = ref<GroupNode | null>(null)

  const loadTree = async () => {
    loading.value = true
    try {
      const data = await groupApi.listTree()
      treeData.value = Array.isArray(data) ? data : []
    } catch {
      ElMessage.error(i18n.global.t('common.requestFailed'))
    } finally {
      loading.value = false
    }
  }

  const onNodeClick = (node: GroupNode) => {
    selected.value = node
  }

  return {
    loading,
    treeData,
    selected,
    loadTree,
    onNodeClick
  }
}
