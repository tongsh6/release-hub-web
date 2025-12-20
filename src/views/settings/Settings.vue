<template>
  <div class="page-container">
    <el-tabs v-model="active">
      <el-tab-pane :label="t('settings.tabs.gitlab')" name="gitlab">
        <el-form label-width="140px" class="pane-card">
          <el-form-item :label="t('settings.labels.baseUrl')">
            <el-input />
          </el-form-item>
          <el-form-item :label="t('settings.labels.token')">
            <el-input type="password" />
          </el-form-item>
          <el-form-item>
            <el-button>{{ t('settings.buttons.testConnection') }}</el-button>
            <el-button type="primary">{{ t('common.save') }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="t('settings.tabs.naming')" name="naming">
        <el-empty :description="t('common.todo')" />
      </el-tab-pane>
      <el-tab-pane :label="t('settings.tabs.refs')" name="refs">
        <el-empty :description="t('common.todo')" />
      </el-tab-pane>
      <el-tab-pane :label="t('settings.tabs.blockPolicy')" name="block-policy">
        <el-radio-group v-model="policy">
          <el-radio label="FAIL_FAST">{{ t('settings.policy.failFast') }}</el-radio>
          <el-radio label="CONTINUE_ON_BLOCK">{{ t('settings.policy.continueOnBlock') }}</el-radio>
        </el-radio-group>
        <div style="margin-top: 12px;">
          <el-button type="primary">{{ t('common.save') }}</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="t('settings.tabs.display')" name="display">
        <el-empty :description="t('common.todo')" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const active = ref('gitlab')
const policy = ref('FAIL_FAST')
const { t } = useI18n()
</script>

<style scoped>
.page-container { padding: 20px; }
.pane-card { background: #fff; padding: 20px; border-radius: 4px; }
</style>
