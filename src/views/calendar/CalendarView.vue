<template>
  <div class="calendar-page">
    <div class="calendar-header">
      <div class="calendar-title">
        <h2>{{ t('calendar.title') }}</h2>
      </div>
      <div class="calendar-controls">
        <el-button-group>
          <el-button :icon="ArrowLeft" @click="prevMonth" />
          <el-button @click="goToday">{{ t('calendar.today') }}</el-button>
          <el-button :icon="ArrowRight" @click="nextMonth" />
        </el-button-group>
        <span class="current-month">{{ currentMonthLabel }}</span>
      </div>
    </div>

    <div v-loading="loading" class="calendar-grid">
      <!-- 星期标题 -->
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>

      <!-- 日期格子 -->
      <div class="calendar-days">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="calendar-day"
          :class="{
            'other-month': !day.isCurrentMonth,
            'today': day.isToday,
            'has-events': day.events.length > 0
          }"
        >
          <div class="day-number">{{ day.date.getDate() }}</div>
          <div class="day-events">
            <div
              v-for="event in day.events.slice(0, 3)"
              :key="event.id"
              class="event-item"
              :class="getEventClass(event)"
              :title="event.name"
              @click="handleEventClick(event)"
            >
              <span v-if="event.frozen" class="frozen-icon">❄️</span>
              <span class="event-name">{{ event.name }}</span>
            </div>
            <div v-if="day.events.length > 3" class="more-events">
              +{{ day.events.length - 3 }} {{ t('calendar.more') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="calendar-legend">
      <span class="legend-item">
        <span class="legend-dot status-draft"></span>
        {{ t('releaseWindow.statusText.DRAFT') }}
      </span>
      <span class="legend-item">
        <span class="legend-dot status-published"></span>
        {{ t('releaseWindow.statusText.PUBLISHED') }}
      </span>
      <span class="legend-item">
        <span class="legend-dot status-closed"></span>
        {{ t('releaseWindow.statusText.CLOSED') }}
      </span>
      <span class="legend-item">
        <span class="frozen-icon">❄️</span>
        {{ t('releaseWindow.frozen') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { list, type ReleaseWindowView } from '@/api/modules/releaseWindow'
import { handleError } from '@/utils/error'

const { t, locale } = useI18n()
const router = useRouter()

// 状态
const loading = ref(false)
const currentDate = ref(new Date())
const releaseWindows = ref<ReleaseWindowView[]>([])

// 星期标题
const weekdays = computed(() => {
  if (locale.value === 'zh-CN') {
    return ['日', '一', '二', '三', '四', '五', '六']
  }
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
})

// 当前月份标签
const currentMonthLabel = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  if (locale.value === 'zh-CN') {
    return `${year}年${month + 1}月`
  }
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return `${monthNames[month]} ${year}`
})

// 日历格子数据
interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: ReleaseWindowView[]
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 当月第一天
  const firstDay = new Date(year, month, 1)
  // 当月最后一天
  const lastDay = new Date(year, month + 1, 0)
  
  // 日历开始日期（上月末尾）
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  // 日历结束日期（下月开头，确保6行）
  const endDate = new Date(lastDay)
  const remainingDays = 6 - lastDay.getDay()
  endDate.setDate(endDate.getDate() + remainingDays)
  
  const days: CalendarDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const current = new Date(startDate)
  while (current <= endDate) {
    const date = new Date(current)
    const isCurrentMonth = date.getMonth() === month
    const isToday = date.getTime() === today.getTime()
    
    // 查找当天的发布窗口
    const events = releaseWindows.value.filter(rw => {
      if (!rw.plannedReleaseAt) return false
      const rwDate = new Date(rw.plannedReleaseAt)
      return rwDate.getFullYear() === date.getFullYear() &&
             rwDate.getMonth() === date.getMonth() &&
             rwDate.getDate() === date.getDate()
    })
    
    days.push({ date, isCurrentMonth, isToday, events })
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

// 获取事件样式类
function getEventClass(event: ReleaseWindowView) {
  const classes = [`status-${event.status.toLowerCase()}`]
  if (event.frozen) {
    classes.push('frozen')
  }
  return classes
}

// 事件点击处理
function handleEventClick(event: ReleaseWindowView) {
  router.push(`/release-windows/${event.id}`)
}

// 导航方法
function prevMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

function nextMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

function goToday() {
  currentDate.value = new Date()
}

// 获取发布窗口数据
async function fetchReleaseWindows() {
  loading.value = true
  try {
    // 获取当前月份前后各一个月的数据
    const result = await list({ page: 1, pageSize: 100 })
    releaseWindows.value = result.list
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
}

// 监听月份变化重新加载数据
watch(currentDate, () => {
  fetchReleaseWindows()
})

onMounted(() => {
  fetchReleaseWindows()
})
</script>

<style scoped>
.calendar-page {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-month {
  font-size: 18px;
  font-weight: 500;
  min-width: 150px;
  text-align: center;
}

.calendar-grid {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.weekday {
  padding: 12px 8px;
  text-align: center;
  font-weight: 500;
  color: #606266;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 100px;
  padding: 8px;
  border-right: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fff;
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day:nth-last-child(-n+7) {
  border-bottom: none;
}

.calendar-day.other-month {
  background-color: #fafafa;
}

.calendar-day.other-month .day-number {
  color: #c0c4cc;
}

.calendar-day.today {
  background-color: #ecf5ff;
}

.calendar-day.today .day-number {
  background-color: #409eff;
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.day-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-item {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.event-item:hover {
  opacity: 0.8;
}

.event-item.status-draft {
  background-color: #e6a23c;
  color: #fff;
}

.event-item.status-published {
  background-color: #67c23a;
  color: #fff;
}

.event-item.status-closed {
  background-color: #909399;
  color: #fff;
}

.event-item.frozen {
  border: 2px solid #409eff;
}

.frozen-icon {
  font-size: 10px;
}

.event-name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-events {
  font-size: 11px;
  color: #909399;
  padding: 2px 6px;
}

.calendar-legend {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-dot.status-draft {
  background-color: #e6a23c;
}

.legend-dot.status-published {
  background-color: #67c23a;
}

.legend-dot.status-closed {
  background-color: #909399;
}
</style>
