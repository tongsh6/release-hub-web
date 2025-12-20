<template>
  <div class="mr-first-timeline">
    <el-steps :active="4" finish-status="success">
      <el-step :title="t('timeline.steps.ensureFeature')" :description="t('timeline.desc.ensureFeature')" />
      <el-step :title="t('timeline.steps.ensureRelease')" :description="t('timeline.desc.ensureRelease')" />
      <el-step :title="t('timeline.steps.ensureMR')" :description="t('timeline.desc.ensureMR')" />
      <el-step :title="t('timeline.steps.tryMerge')" :description="t('timeline.desc.tryMerge')" />
    </el-steps>
    <div class="timeline-body">
      <el-empty :description="t('common.todo')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.mr-first-timeline { padding: 12px 0; }
.timeline-body { margin-top: 12px; }
</style>
