<template>
  <div class="page-container">
    <div class="search-area">
      <el-form :inline="true" :model="searchForm">
        <el-form-item :label="t('versionPolicy.name')">
          <el-input v-model="searchForm.name" :placeholder="t('versionPolicy.name')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ t('common.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="action-area">
      <el-button type="primary" :icon="Plus" @click="handleAdd">{{ t('versionPolicy.create') }}</el-button>
    </div>

    <div class="table-area">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" :label="t('versionPolicy.name')" min-width="150" />
        <el-table-column prop="strategy" :label="t('versionPolicy.strategy')" min-width="150" />
        <el-table-column :label="t('releaseWindow.actions')" width="150" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">{{ t('common.edit') }}</el-button>
            <el-button link type="danger" size="small">{{ t('common.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'

const { t } = useI18n()

const searchForm = reactive({
  name: ''
})

const tableData = ref([
  {
    id: '1',
    name: 'Semantic Versioning',
    strategy: 'Major.Minor.Patch'
  },
  {
    id: '2',
    name: 'Date Based',
    strategy: 'YYYY.MM.DD'
  }
])

const handleSearch = () => {
  console.log('Search', searchForm)
}

const handleAdd = () => {
  console.log('Add policy')
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.search-area {
  background-color: #fff;
  padding: 18px 18px 0;
  margin-bottom: 20px;
  border-radius: 4px;
}
.action-area {
  margin-bottom: 20px;
}
.table-area {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}
</style>
