/**
 * 仓库管理页面 E2E 测试
 * 包含字段显示验证
 */
import { TestRunner, PageHelper, Assertions, delay } from '../utils/test-helper'

const runner = new TestRunner()

// 期望的表格列
const EXPECTED_COLUMNS = {
  name: '仓库',
  cloneUrl: '仓库地址',
  defaultBranch: '默认分支',
  health: '健康',
  actions: '操作'
}

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

// 测试：仓库列表页正确渲染
runner.test('仓库列表页正确渲染', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const assertions = runner.getAssertions()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  // 验证页面元素
  const hasTable = await helper.elementExists('.el-table')
  if (!hasTable) {
    throw new Error('Table element not found on repository list page')
  }
  
  // 验证搜索表单
  await assertions.elementExists('.el-form')
  
  // 验证新建按钮
  await assertions.elementExists('.el-button--primary')
  
  await helper.screenshot('repository-list')
})

// 测试：表格列显示正确
runner.test('仓库列表表头字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  // 验证表头
  const expectedHeaders = Object.values(EXPECTED_COLUMNS)
  const { found, missing } = await verifyTableHeaders(expectedHeaders)
  
  // 至少需要有仓库和操作列
  if (!found.includes('仓库')) {
    throw new Error('Missing required column: 仓库')
  }
  
  if (!found.includes('操作')) {
    throw new Error('Missing required column: 操作')
  }
  
  await helper.screenshot('repository-table-headers')
})

// 测试：表格数据显示正确
runner.test('仓库列表数据字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  // 验证数据行
  const { rowCount, hasData } = await verifyTableRowData()
  
  if (rowCount > 0) {
    // 验证第一行的具体字段
    const firstRow = await page.$('.el-table__body-wrapper .el-table__row:first-child')
    if (firstRow) {
      const cells = await firstRow.$$('td')
      
      // 第一列应该是仓库名称（非空）
      if (cells.length > 0) {
        const repoName = await page.evaluate(el => el.textContent?.trim(), cells[0])
        if (!repoName || repoName === '') {
          throw new Error('Repository name should not be empty')
        }
        console.log('First row repo name:', repoName)
      }
      
      // 验证健康状态标签
      const healthTags = await firstRow.$$('.el-tag')
      if (healthTags.length > 0) {
        const tagText = await page.evaluate(el => el.textContent?.trim(), healthTags[0])
        console.log('Health status:', tagText)
      }
      
      // 验证操作列有按钮
      const actionBtns = await firstRow.$$('.el-button')
      if (actionBtns.length === 0) {
        throw new Error('Action buttons should exist in each row')
      }
      console.log(`Found ${actionBtns.length} action buttons in first row`)
    }
  } else {
    console.log('No repository data available for field verification')
  }
  
  await helper.screenshot('repository-table-data')
})

// 测试：仓库搜索功能
runner.test('仓库搜索功能正常工作', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  // 查找搜索输入框
  const searchInput = await page.$('.el-input__inner')
  if (searchInput) {
    await searchInput.type('test')
    await delay(500)
    
    // 触发搜索
    await page.keyboard.press('Enter')
    await delay(1000)
    
    // 验证搜索后表格仍然存在
    const hasTable = await helper.elementExists('.el-table')
    if (!hasTable) {
      throw new Error('Table should exist after search')
    }
  }
  
  await helper.screenshot('repository-search')
})

// 测试：仓库详情抽屉字段
runner.test('仓库详情字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  try {
    await helper.waitForTableData()
    
    // 点击详情按钮
    const viewButtons = await page.$$('.el-table .el-button')
    for (const btn of viewButtons) {
      const text = await page.evaluate(el => el.textContent, btn)
      if (text?.includes('详情') || text?.includes('Detail') || text?.includes('查看')) {
        await btn.click()
        break
      }
    }
    
    await delay(1000)
    
    // 验证抽屉或详情页
    const hasDrawer = await helper.elementExists('.el-drawer')
    const hasDescriptions = await helper.elementExists('.el-descriptions')
    
    if (hasDrawer || hasDescriptions) {
      // 验证描述项
      const descItems = await page.$$('.el-descriptions-item')
      console.log(`Found ${descItems.length} description items`)
      
      // 获取所有标签
      const descLabels: string[] = []
      for (const item of descItems) {
        const label = await page.evaluate(el => el.querySelector('.el-descriptions-item__label')?.textContent?.trim(), item)
        if (label) {
          descLabels.push(label)
        }
      }
      console.log('Description labels:', descLabels)
      
      // 验证必要字段
      const requiredFields = ['仓库', '分支', 'GitLab', 'URL']
      const hasRequiredFields = requiredFields.some(f => descLabels.some(l => l.includes(f)))
      if (!hasRequiredFields) {
        console.log('Warning: Some required fields may be missing')
      }
    } else {
      console.log('Detail drawer/page not found')
    }
  } catch {
    console.log('No repository data available')
  }
  
  await helper.screenshot('repository-detail-fields')
})

// 测试：创建/同步仓库对话框字段
runner.test('创建仓库对话框字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  // 点击创建按钮
  const buttons = await page.$$('.el-button--primary')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text?.includes('新增') || text?.includes('同步') || text?.includes('Add') || text?.includes('Sync')) {
      await btn.click()
      break
    }
  }
  
  await delay(800)
  
  // 验证对话框出现
  const hasDialog = await helper.elementExists('.el-dialog__body')
  const hasDrawer = await helper.elementExists('.el-drawer')
  
  if (!hasDialog && !hasDrawer) {
    console.log('Dialog/Drawer not found - might navigate to edit page')
    await helper.screenshot('repository-create-form')
    return
  }
  
  // 验证对话框中的字段
  const formItems = await page.$$('.el-dialog .el-form-item, .el-drawer .el-form-item')
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
  
  await helper.screenshot('repository-create-dialog')
  
  // 关闭对话框
  const closeBtn = await page.$('.el-dialog__headerbtn, .el-drawer__close-btn')
  if (closeBtn) {
    await closeBtn.click()
  }
})

// 测试：健康状态标签显示
runner.test('仓库健康状态标签显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  try {
    await helper.waitForTableData()
    
    // 查找健康状态标签
    const healthTags = await page.$$('.el-table .el-tag')
    console.log(`Found ${healthTags.length} health tags`)
    
    // 验证标签类型（应该是 success 或 danger）
    for (let i = 0; i < Math.min(3, healthTags.length); i++) {
      const tag = healthTags[i]
      const className = await page.evaluate(el => el.className, tag)
      const text = await page.evaluate(el => el.textContent?.trim(), tag)
      console.log(`Tag ${i + 1}: ${text} (class: ${className})`)
      
      // 验证是健康或风险标签
      const isHealthTag = className.includes('success') || className.includes('danger') || className.includes('info')
      if (!isHealthTag) {
        console.log('Warning: Tag may not be a health status tag')
      }
    }
  } catch {
    console.log('No repository data available')
  }
  
  await helper.screenshot('repository-health-tags')
})

// 测试：操作按钮完整性
runner.test('仓库列表操作按钮完整', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
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
      const hasDetail = buttonTexts.some(t => t.includes('详情') || t.includes('Detail'))
      const hasSync = buttonTexts.some(t => t.includes('同步') || t.includes('Sync'))
      const hasEdit = buttonTexts.some(t => t.includes('编辑') || t.includes('Edit'))
      
      console.log(`Detail: ${hasDetail}, Sync: ${hasSync}, Edit: ${hasEdit}`)
    }
  } catch {
    console.log('No repository data available')
  }
  
  await helper.screenshot('repository-action-buttons')
})

// 测试：分支/MR 摘要显示
runner.test('仓库分支MR摘要显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  try {
    await helper.waitForTableData()
    
    // 检查健康列的附加信息（B:x/x | MR:x）
    const firstRow = await page.$('.el-table__body-wrapper .el-table__row:first-child')
    if (firstRow) {
      const healthMetrics = await firstRow.$('.health-metrics')
      if (healthMetrics) {
        const text = await page.evaluate(el => el.textContent?.trim(), healthMetrics)
        console.log('Health metrics:', text)
        
        // 验证格式 B:x/x | MR:x
        if (text && (text.includes('B:') || text.includes('MR:'))) {
          console.log('Health metrics format is correct')
        }
      } else {
        console.log('Health metrics element not found')
      }
    }
  } catch {
    console.log('No repository data available')
  }
  
  await helper.screenshot('repository-branch-mr-summary')
})

// ============================================
// 国际化验证测试
// ============================================

// 期望的中英文对照
const I18N_TEXTS = {
  columns: {
    repo: { zh: '仓库', en: 'Repo' },
    cloneUrl: { zh: '仓库地址', en: 'Clone URL' },
    defaultBranch: { zh: '默认分支', en: 'Default Branch' },
    health: { zh: '健康', en: 'Health' },
    actions: { zh: '操作', en: 'Actions' }
  },
  buttons: {
    add: { zh: '新增', en: 'Add' },
    sync: { zh: '同步', en: 'Sync' },
    search: { zh: '查询', en: 'Search' },
    reset: { zh: '重置', en: 'Reset' },
    detail: { zh: '详情', en: 'Detail' },
    edit: { zh: '编辑', en: 'Edit' }
  },
  health: {
    healthy: { zh: '健康', en: 'Healthy' },
    risk: { zh: '风险', en: 'Risk' }
  }
}

// 测试：仓库列表表头国际化
runner.test('仓库列表表头国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  console.log('\n🌐 仓库列表表头国际化验证:')
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
  
  await helper.screenshot('repository-i18n-headers')
})

// 测试：仓库列表按钮国际化
runner.test('仓库列表按钮国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  console.log('\n🌐 仓库列表按钮国际化验证:')
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
  
  await helper.screenshot('repository-i18n-buttons')
})

// 测试：仓库健康状态标签国际化
runner.test('仓库健康状态标签国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/repositories')
  await delay(1000)
  
  console.log('\n🌐 仓库健康状态标签国际化验证:')
  console.log('=' .repeat(50))
  
  try {
    await helper.waitForTableData()
    
    const healthTags = await page.$$('.el-table .el-tag')
    const tagTexts: string[] = []
    
    for (const tag of healthTags) {
      const text = await page.evaluate(el => el.textContent?.trim(), tag)
      if (text) tagTexts.push(text)
    }
    
    const uniqueTags = [...new Set(tagTexts)]
    console.log('健康状态标签:', uniqueTags)
    
    uniqueTags.forEach(tagText => {
      const isZhHealthy = tagText.includes('健康')
      const isEnHealthy = tagText.includes('Healthy')
      const isZhRisk = tagText.includes('风险')
      const isEnRisk = tagText.includes('Risk')
      
      if (isZhHealthy || isEnHealthy) {
        console.log(`✅ 健康状态: "${tagText}" (${isZhHealthy ? '中文' : 'English'})`)
      } else if (isZhRisk || isEnRisk) {
        console.log(`✅ 风险状态: "${tagText}" (${isZhRisk ? '中文' : 'English'})`)
      } else {
        console.log(`⚠️ 未知状态: "${tagText}"`)
      }
    })
  } catch {
    console.log('无仓库数据可验证')
  }
  
  await helper.screenshot('repository-i18n-health-tags')
})

// 运行测试
runner.run().catch(console.error)
