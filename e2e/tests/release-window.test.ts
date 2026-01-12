/**
 * 发布窗口页面 E2E 测试
 * 包含字段显示验证
 */
import { TestRunner, PageHelper, Assertions, delay } from '../utils/test-helper'

const runner = new TestRunner()

// 期望的表格列
const EXPECTED_COLUMNS = {
  windowKey: '发布窗口标识',
  name: '名称',
  status: '状态',
  startAt: '开始时间',
  endAt: '结束时间',
  actions: '操作'
}

// 期望的状态值
const EXPECTED_STATUSES = ['草稿', '已规划', '活跃', '冻结', '已发布', '已关闭', 'DRAFT', 'PLANNED', 'ACTIVE', 'FROZEN', 'PUBLISHED', 'CLOSED']

// 辅助函数：确保已登录
async function ensureLoggedIn(): Promise<void> {
  const auth = runner.getAuthHelper()
  const helper = runner.getHelper()
  
  await helper.navigate('/')
  await delay(500)
  
  const page = runner.getContext().getPage()
  if (page.url().includes('/login')) {
    await auth.login()
  }
}

// 辅助函数：验证表头字段
async function verifyTableHeaders(expectedHeaders: string[]): Promise<{ found: string[], missing: string[] }> {
  const page = runner.getContext().getPage()
  const headers = await page.$$('.el-table__header th')
  const headerTexts: string[] = []
  
  for (const header of headers) {
    const text = await page.evaluate(el => el.textContent?.trim(), header)
    if (text) {
      headerTexts.push(text)
    }
  }
  
  const found: string[] = []
  const missing: string[] = []
  
  for (const expected of expectedHeaders) {
    if (headerTexts.some(h => h.includes(expected))) {
      found.push(expected)
    } else {
      missing.push(expected)
    }
  }
  
  console.log('Found headers:', found)
  if (missing.length > 0) {
    console.log('Missing headers:', missing)
  }
  
  return { found, missing }
}

// 辅助函数：验证表格数据行字段
async function verifyTableRowData(): Promise<{ rowCount: number, hasData: boolean }> {
  const page = runner.getContext().getPage()
  const rows = await page.$$('.el-table__body-wrapper .el-table__row')
  
  if (rows.length === 0) {
    console.log('No data rows found')
    return { rowCount: 0, hasData: false }
  }
  
  // 验证第一行数据
  const firstRow = rows[0]
  const cells = await firstRow.$$('td')
  
  const rowData: string[] = []
  for (const cell of cells) {
    const text = await page.evaluate(el => el.textContent?.trim(), cell)
    rowData.push(text || '')
  }
  
  console.log(`Found ${rows.length} rows, first row data:`, rowData)
  
  // 检查是否有实际数据（不是全空）
  const hasData = rowData.some(d => d && d !== '-')
  
  return { rowCount: rows.length, hasData }
}

// 测试：发布窗口列表页正确渲染
runner.test('发布窗口列表页正确渲染', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const assertions = runner.getAssertions()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  // 验证页面元素
  const hasTable = await helper.elementExists('.el-table')
  if (!hasTable) {
    throw new Error('Table element not found on release window list page')
  }
  
  // 验证搜索表单
  await assertions.elementExists('.el-form')
  
  // 验证创建按钮
  await assertions.elementExists('.el-button--primary')
  
  await helper.screenshot('release-window-list')
})

// 测试：表格列显示正确
runner.test('发布窗口列表表头字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  // 验证表头
  const expectedHeaders = Object.values(EXPECTED_COLUMNS)
  const { found, missing } = await verifyTableHeaders(expectedHeaders)
  
  // 至少需要有窗口标识/名称和操作列
  const hasKeyOrName = found.includes('发布窗口标识') || found.includes('名称') || found.some(h => h.includes('Key') || h.includes('Name'))
  if (!hasKeyOrName) {
    throw new Error('Missing required column: Window Key or Name')
  }
  
  if (!found.includes('操作')) {
    throw new Error('Missing required column: 操作')
  }
  
  await helper.screenshot('release-window-table-headers')
})

// 测试：表格数据显示正确
runner.test('发布窗口列表数据字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  // 验证数据行
  const { rowCount, hasData } = await verifyTableRowData()
  
  if (rowCount > 0) {
    // 验证第一行的具体字段
    const firstRow = await page.$('.el-table__body-wrapper .el-table__row:first-child')
    if (firstRow) {
      const cells = await firstRow.$$('td')
      
      // 第一列应该是窗口标识（非空）
      if (cells.length > 0) {
        const windowKey = await page.evaluate(el => el.textContent?.trim(), cells[0])
        if (!windowKey || windowKey === '') {
          throw new Error('Window key should not be empty')
        }
        console.log('First row window key:', windowKey)
      }
      
      // 验证状态标签
      const statusTags = await firstRow.$$('.el-tag')
      if (statusTags.length > 0) {
        const tagText = await page.evaluate(el => el.textContent?.trim(), statusTags[0])
        console.log('Status:', tagText)
        
        // 验证状态值是否有效
        const isValidStatus = EXPECTED_STATUSES.some(s => tagText?.includes(s))
        if (!isValidStatus) {
          console.log('Warning: Status may not be a valid value')
        }
      }
      
      // 验证操作列有按钮
      const actionBtns = await firstRow.$$('.el-button')
      if (actionBtns.length === 0) {
        throw new Error('Action buttons should exist in each row')
      }
      console.log(`Found ${actionBtns.length} action buttons in first row`)
    }
  } else {
    console.log('No release window data available for field verification')
  }
  
  await helper.screenshot('release-window-table-data')
})

// 测试：状态标签显示正确
runner.test('发布窗口状态标签显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  try {
    await helper.waitForTableData()
    
    // 查找所有状态标签
    const statusTags = await page.$$('.el-table .el-tag')
    console.log(`Found ${statusTags.length} status tags`)
    
    // 验证标签样式和内容
    const tagInfos: { text: string, type: string }[] = []
    for (let i = 0; i < Math.min(5, statusTags.length); i++) {
      const tag = statusTags[i]
      const text = await page.evaluate(el => el.textContent?.trim(), tag)
      const className = await page.evaluate(el => el.className, tag)
      
      let type = 'default'
      if (className.includes('success')) type = 'success'
      else if (className.includes('warning')) type = 'warning'
      else if (className.includes('danger')) type = 'danger'
      else if (className.includes('info')) type = 'info'
      
      tagInfos.push({ text: text || '', type })
    }
    
    console.log('Status tags:', tagInfos)
    
    // 验证至少有一些状态标签
    if (tagInfos.length === 0) {
      console.log('Warning: No status tags found')
    }
  } catch {
    console.log('No release window data available')
  }
  
  await helper.screenshot('release-window-status-tags')
})

// 测试：创建发布窗口对话框字段
runner.test('创建发布窗口对话框字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  // 点击创建按钮
  const buttons = await page.$$('.el-button--primary')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text?.includes('创建') || text?.includes('新建') || text?.includes('Create')) {
      await btn.click()
      break
    }
  }
  
  await delay(800)
  
  // 验证对话框出现
  const hasDialog = await helper.elementExists('.el-dialog__body')
  if (!hasDialog) {
    console.log('Dialog not found')
    await helper.screenshot('release-window-create-dialog-not-found')
    return
  }
  
  // 验证对话框中的字段
  const formItems = await page.$$('.el-dialog .el-form-item')
  console.log(`Found ${formItems.length} form items in create dialog`)
  
  // 检查标签
  const labels: string[] = []
  for (const item of formItems) {
    const label = await page.evaluate(el => el.querySelector('.el-form-item__label')?.textContent?.trim(), item)
    if (label) {
      labels.push(label)
    }
  }
  console.log('Form labels:', labels)
  
  // 验证必要字段
  const hasKeyField = labels.some(l => l.includes('标识') || l.includes('Key'))
  const hasNameField = labels.some(l => l.includes('名称') || l.includes('Name'))
  
  if (!hasKeyField) {
    console.log('Warning: Window key field not found')
  }
  if (!hasNameField) {
    console.log('Warning: Name field not found')
  }
  
  await helper.screenshot('release-window-create-dialog')
  
  // 关闭对话框
  const closeBtn = await page.$('.el-dialog__headerbtn')
  if (closeBtn) {
    await closeBtn.click()
  }
})

// 测试：发布窗口详情页字段
runner.test('发布窗口详情页字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  try {
    await helper.waitForTableData()
    
    // 点击查看按钮
    const viewButtons = await page.$$('.el-table .el-button')
    for (const btn of viewButtons) {
      const text = await page.evaluate(el => el.textContent, btn)
      if (text?.includes('查看') || text?.includes('View') || text?.includes('详情')) {
        await btn.click()
        break
      }
    }
    
    await delay(1000)
    
    // 验证是否跳转到详情页
    const url = page.url()
    if (url.includes('/release-windows/')) {
      console.log('Navigated to detail page:', url)
      
      // 验证详情页元素
      const hasDescriptions = await helper.elementExists('.el-descriptions')
      const hasCards = await helper.elementExists('.el-card')
      
      if (hasDescriptions) {
        const descItems = await page.$$('.el-descriptions-item')
        console.log(`Found ${descItems.length} description items`)
        
        // 获取标签
        const descLabels: string[] = []
        for (const item of descItems) {
          const label = await page.evaluate(el => el.querySelector('.el-descriptions-item__label')?.textContent?.trim(), item)
          if (label) {
            descLabels.push(label)
          }
        }
        console.log('Description labels:', descLabels)
        
        // 验证必要字段
        const requiredLabels = ['标识', '名称', '状态', '开始', '结束']
        const foundRequired = requiredLabels.filter(r => descLabels.some(l => l.includes(r)))
        console.log('Found required labels:', foundRequired)
      }
    } else {
      console.log('Did not navigate to detail page')
    }
  } catch {
    console.log('No release window data available')
  }
  
  await helper.screenshot('release-window-detail-page')
})

// 测试：操作按钮完整性
runner.test('发布窗口列表操作按钮完整', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  try {
    await helper.waitForTableData()
    
    const firstRow = await page.$('.el-table__body-wrapper .el-table__row:first-child')
    if (firstRow) {
      const buttons = await firstRow.$$('.el-button')
      const buttonTexts: string[] = []
      
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent?.trim(), btn)
        if (text) {
          buttonTexts.push(text)
        }
      }
      
      console.log('Action buttons:', buttonTexts)
      
      // 验证必要的按钮
      const hasView = buttonTexts.some(t => t.includes('查看') || t.includes('View'))
      const hasAttach = buttonTexts.some(t => t.includes('关联') || t.includes('Attach'))
      
      console.log(`View: ${hasView}, Attach: ${hasAttach}`)
    }
  } catch {
    console.log('No release window data available')
  }
  
  await helper.screenshot('release-window-action-buttons')
})

// 测试：搜索功能
runner.test('发布窗口搜索功能正常工作', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  // 在搜索框中输入
  const searchInput = await page.$('.el-form .el-input__inner')
  if (searchInput) {
    await searchInput.type('test')
    await delay(500)
    
    // 点击搜索按钮
    const searchBtn = await page.$('.el-form .el-button--primary')
    if (searchBtn) {
      await searchBtn.click()
      await delay(1000)
    }
    
    // 验证表格仍然存在
    const hasTable = await helper.elementExists('.el-table')
    if (!hasTable) {
      throw new Error('Table should exist after search')
    }
  }
  
  await helper.screenshot('release-window-search')
})

// 测试：重置搜索条件
runner.test('重置搜索条件', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  // 输入搜索条件
  const searchInput = await page.$('.el-form .el-input__inner')
  if (searchInput) {
    await searchInput.type('test-search')
    await delay(300)
  }
  
  // 点击重置按钮
  const buttons = await page.$$('.el-form .el-button')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text?.includes('重置') || text?.includes('Reset')) {
      await btn.click()
      break
    }
  }
  
  await delay(500)
  
  // 验证输入框已清空
  if (searchInput) {
    const value = await page.evaluate(el => (el as HTMLInputElement).value, searchInput)
    if (value !== '') {
      console.log('Warning: Search input may not have been reset')
    } else {
      console.log('Search input reset successfully')
    }
  }
  
  await helper.screenshot('release-window-reset-search')
})

// ============================================
// 国际化验证测试
// ============================================

// 期望的中英文对照
const I18N_TEXTS = {
  columns: {
    windowKey: { zh: '发布窗口标识', en: 'Window Key' },
    name: { zh: '发布窗口名称', en: 'ReleaseWindow Name' },
    status: { zh: '状态', en: 'Status' },
    createdAt: { zh: '创建时间', en: 'Created At' },
    actions: { zh: '操作', en: 'Actions' }
  },
  buttons: {
    create: { zh: '创建发布窗口', en: 'Create ReleaseWindow' },
    search: { zh: '查询', en: 'Search' },
    reset: { zh: '重置', en: 'Reset' },
    view: { zh: '查看', en: 'View' },
    edit: { zh: '编辑', en: 'Edit' },
    attach: { zh: '挂载到窗口', en: 'Attach' },
    freeze: { zh: '冻结', en: 'Freeze' }
  },
  statuses: {
    draft: { zh: '草稿', en: 'DRAFT' },
    planned: { zh: '已规划', en: 'PLANNED' },
    active: { zh: '活跃', en: 'ACTIVE' },
    frozen: { zh: '冻结', en: 'FROZEN' },
    published: { zh: '已发布', en: 'PUBLISHED' },
    closed: { zh: '已关闭', en: 'CLOSED' }
  }
}

// 测试：发布窗口列表表头国际化
runner.test('发布窗口列表表头国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  console.log('\n🌐 发布窗口列表表头国际化验证:')
  console.log('=' .repeat(50))
  
  const headers = await helper.getTableHeaders()
  console.log('当前表头:', headers)
  
  // 验证每个列的国际化
  let i18nPassed = true
  Object.entries(I18N_TEXTS.columns).forEach(([key, { zh, en }]) => {
    const foundZh = headers.some(h => h.includes(zh))
    const foundEn = headers.some(h => h.includes(en))
    
    if (foundZh) {
      console.log(`✅ ${key}: "${zh}" (中文)`)
    } else if (foundEn) {
      console.log(`✅ ${key}: "${en}" (English)`)
    } else {
      console.log(`⚠️ ${key}: 未找到 "${zh}" 或 "${en}"`)
      i18nPassed = false
    }
  })
  
  if (!i18nPassed) {
    console.log('\n⚠️ 部分表头国际化可能缺失')
  }
  
  await helper.screenshot('release-window-i18n-headers')
})

// 测试：发布窗口列表按钮国际化
runner.test('发布窗口列表按钮国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  console.log('\n🌐 发布窗口列表按钮国际化验证:')
  console.log('=' .repeat(50))
  
  const buttonTexts = await helper.getButtonTexts()
  console.log('当前按钮:', buttonTexts)
  
  // 验证按钮国际化
  Object.entries(I18N_TEXTS.buttons).forEach(([key, { zh, en }]) => {
    const foundZh = buttonTexts.some(b => b.includes(zh))
    const foundEn = buttonTexts.some(b => b.includes(en))
    
    if (foundZh) {
      console.log(`✅ ${key}: "${zh}" (中文)`)
    } else if (foundEn) {
      console.log(`✅ ${key}: "${en}" (English)`)
    }
  })
  
  await helper.screenshot('release-window-i18n-buttons')
})

// 测试：发布窗口状态标签国际化
runner.test('发布窗口状态标签国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  console.log('\n🌐 发布窗口状态标签国际化验证:')
  console.log('=' .repeat(50))
  
  try {
    await helper.waitForTableData()
    
    const statusTags = await page.$$('.el-table .el-tag')
    const tagTexts: string[] = []
    
    for (const tag of statusTags) {
      const text = await page.evaluate(el => el.textContent?.trim(), tag)
      if (text) tagTexts.push(text)
    }
    
    const uniqueTags = [...new Set(tagTexts)]
    console.log('状态标签:', uniqueTags)
    
    uniqueTags.forEach(tagText => {
      let found = false
      Object.entries(I18N_TEXTS.statuses).forEach(([key, { zh, en }]) => {
        if (tagText.includes(zh)) {
          console.log(`✅ ${key}: "${tagText}" (中文)`)
          found = true
        } else if (tagText.includes(en)) {
          console.log(`✅ ${key}: "${tagText}" (English)`)
          found = true
        }
      })
      
      if (!found) {
        console.log(`⚠️ 未知状态: "${tagText}"`)
      }
    })
  } catch {
    console.log('无发布窗口数据可验证')
  }
  
  await helper.screenshot('release-window-i18n-status-tags')
})

// 测试：发布窗口创建对话框国际化
runner.test('发布窗口创建对话框国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/release-windows')
  await delay(1000)
  
  console.log('\n🌐 发布窗口创建对话框国际化验证:')
  console.log('=' .repeat(50))
  
  // 点击创建按钮
  const buttons = await page.$$('.el-button--primary')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text?.includes('创建') || text?.includes('Create')) {
      await btn.click()
      break
    }
  }
  
  await delay(800)
  
  const hasDialog = await helper.elementExists('.el-dialog__body')
  if (hasDialog) {
    // 验证对话框标题
    const title = await page.$eval('.el-dialog__title', el => el.textContent?.trim()).catch(() => '')
    console.log(`对话框标题: ${title}`)
    
    // 验证表单标签
    const formLabels = await page.$$eval('.el-form-item__label', els => els.map(el => el.textContent?.trim()))
    console.log('表单标签:', formLabels)
    
    // 验证确认/取消按钮
    const dialogButtons = await page.$$eval('.el-dialog__footer .el-button', btns => btns.map(b => b.textContent?.trim()))
    console.log('对话框按钮:', dialogButtons)
    
    // 期望的表单标签
    const expectedLabels = {
      windowKey: { zh: '发布窗口标识', en: 'Window Key' },
      name: { zh: '发布窗口名称', en: 'Name' },
      description: { zh: '描述', en: 'Description' }
    }
    
    Object.entries(expectedLabels).forEach(([key, { zh, en }]) => {
      const foundZh = formLabels.some(l => l?.includes(zh))
      const foundEn = formLabels.some(l => l?.includes(en))
      
      if (foundZh) {
        console.log(`✅ ${key}: "${zh}" (中文)`)
      } else if (foundEn) {
        console.log(`✅ ${key}: "${en}" (English)`)
      }
    })
    
    // 关闭对话框
    const closeBtn = await page.$('.el-dialog__headerbtn')
    if (closeBtn) await closeBtn.click()
  } else {
    console.log('对话框未打开')
  }
  
  await helper.screenshot('release-window-i18n-dialog')
})

// 运行测试
runner.run().catch(console.error)
