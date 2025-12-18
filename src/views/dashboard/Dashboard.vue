<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('dashboard.totalProjects') }}</span>
            </div>
          </template>
          <div class="card-value">12</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('dashboard.activeWindows') }}</span>
            </div>
          </template>
          <div class="card-value">3</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('dashboard.pendingApprovals') }}</span>
            </div>
          </template>
          <div class="card-value">5</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('dashboard.recentScans') }}</span>
            </div>
          </template>
          <div class="card-value">8</div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('dashboard.recentActivity') }}</span>
            </div>
          </template>
          <el-empty :description="t('dashboard.noActivity')" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ t('dashboard.quickActions') }}</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" plain>{{ t('dashboard.newRelease') }}</el-button>
            <el-button type="success" plain>{{ t('dashboard.runScan') }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-value {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  padding: 10px 0;
}
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
