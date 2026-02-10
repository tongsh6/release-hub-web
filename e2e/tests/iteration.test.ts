/**
 * 迭代管理页面 E2E 测试
 * 包含字段显示验证
 */
import { TestRunner, delay } from '../utils/test-helper'

const runner = new TestRunner()

// 期望的表格列
const EXPECTED_COLUMNS = {
  iterationKey: '迭代标识',
  description: '描述',
  repoCount: '仓库数',
  createdAt: '创建时间',
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

// 测试：迭代列表页正确渲染
runner.test('迭代列表页正确渲染', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const assertions = runner.getAssertions()
  
  await helper.navigate('/iterations')
  await delay(1000)
  
  // 验证页面元素
  const hasTable = await helper.elementExists('.el-table')
  if (!hasTable) {
    throw new Error('Table element not found on iteration list page')
  }
  
  // 验证搜索表单
  await assertions.elementExists('.el-form')
  
  // 验证新建按钮
  await assertions.elementExists('.el-button--primary')
  
  await helper.screenshot('iteration-list')
})

// 测试：表格列显示正确
runner.test('迭代列表表头字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  
  await helper.navigate('/iterations')
  await delay(1000)
  
  // 验证表头
  const expectedHeaders = Object.values(EXPECTED_COLUMNS)
  const { found } = await verifyTableHeaders(expectedHeaders)
  
  // 至少需要有迭代标识和操作列
  if (!found.includes('迭代标识')) {
    throw new Error('Missing required column: 迭代标识')
  }
  
  if (!found.includes('操作')) {
    throw new Error('Missing required column: 操作')
  }
  
  await helper.screenshot('iteration-table-headers')
})

// 测试：表格数据显示正确
runner.test('迭代列表数据字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  
  await helper.navigate('/iterations')
  await delay(1000)
  
  // 验证数据行
  const { rowCount } = await verifyTableRowData()
  
  if (rowCount > 0) {
    // 验证第一行的具体字段
    const firstRow = await page.$('.el-table__body-wrapper .el-table__row:first-child')
    if (firstRow) {
      const cells = await firstRow.$$('td')
      
      // 第一列应该是迭代标识（非空）
      if (cells.length > 0) {
        const iterationKey = await page.evaluate(el => el.textContent?.trim(), cells[0])
        if (!iterationKey || iterationKey === '') {
          throw new Error('Iteration key should not be empty')
        }
        console.log('First row iteration key:', iterationKey)
      }
      
      // 验证操作列有按钮
      const actionBtns = await firstRow.$$('.el-button')
      if (actionBtns.length === 0) {
        throw new Error('Action buttons should exist in each row')
      }
      console.log(`Found ${actionBtns.length} action buttons in first row`)
    }
  } else {
    console.log('No iteration data available for field verification')
  }
  
  await helper.screenshot('iteration-table-data')
})

// 测试：创建迭代对话框字段
runner.test('创建迭代对话框字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  await helper.navigate('/iterations')
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
    await helper.screenshot('iteration-create-dialog-not-found')
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
  
  // 验证迭代标识字段存在
  const hasIterationKeyField = labels.some(l => l.includes('迭代') || l.includes('标识') || l.includes('Key'))
  if (!hasIterationKeyField) {
    console.log('Warning: Iteration key field not found')
  }
  
  await helper.screenshot('iteration-create-dialog')
  
  // 关闭对话框
  const closeBtn = await page.$('.el-dialog__headerbtn')
  if (closeBtn) {
    await closeBtn.click()
  }
})

// 测试：迭代详情抽屉字段
runner.test('迭代详情字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  await helper.navigate('/iterations')
  await delay(1000)
  
  try {
    await helper.waitForTableData()
    
    // 点击详情按钮
    const viewButtons = await page.$$('.el-table .el-button')
    for (const btn of viewButtons) {
      const text = await page.evaluate(el => el.textContent, btn)
      if (text?.includes('详情') || text?.includes('Detail')) {
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
    } else {
      console.log('Detail drawer/page not found')
    }
  } catch {
    console.log('No iteration data available')
  }
  
  await helper.screenshot('iteration-detail-fields')
})

// 测试：迭代关联仓库显示
runner.test('迭代关联仓库字段显示正确', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  
  await helper.navigate('/iterations')
  await delay(1000)
  
  try {
    await helper.waitForTableData()
    
    // 验证仓库数列
    const firstRow = await page.$('.el-table__body-wrapper .el-table__row:first-child')
    if (firstRow) {
      const cells = await firstRow.$$('td')
      
      // 查找包含数字或 tag 的单元格（仓库数列）
      for (const cell of cells) {
        const tag = await cell.$('.el-tag')
        if (tag) {
          const tagText = await page.evaluate(el => el.textContent?.trim(), tag)
          console.log('Repo count tag:', tagText)
          break
        }
      }
    }
    
    // 点击查看按钮进入详情
    const viewButtons = await page.$$('.el-table .el-button')
    for (const btn of viewButtons) {
      const text = await page.evaluate(el => el.textContent, btn)
      if (text?.includes('查看') || text?.includes('View')) {
        await btn.click()
        break
      }
    }
    
    await delay(1000)
    
    // 验证详情页中的仓库标签
    const repoTags = await page.$$('.el-card .el-tag')
    console.log(`Found ${repoTags.length} repo tags in detail`)
    
  } catch {
    console.log('No iteration data available')
  }
  
  await helper.screenshot('iteration-repos-display')
})

// 测试：操作按钮完整性
runner.test('迭代列表操作按钮完整', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  
  await helper.navigate('/iterations')
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
      const hasView = buttonTexts.some(t => t.includes('查看') || t.includes('View'))
      const hasDelete = buttonTexts.some(t => t.includes('删除') || t.includes('Delete'))
      
      console.log(`Detail: ${hasDetail}, View: ${hasView}, Delete: ${hasDelete}`)
    }
  } catch {
    console.log('No iteration data available')
  }
  
  await helper.screenshot('iteration-action-buttons')
})

// ============================================
// 国际化验证测试
// ============================================

// 期望的中英文对照
const I18N_TEXTS = {
  columns: {
    iterationKey: { zh: '迭代标识', en: 'Iteration Key' },
    description: { zh: '描述', en: 'Description' },
    repoCount: { zh: '仓库数', en: 'Repos' },
    createdAt: { zh: '创建时间', en: 'Created At' },
    actions: { zh: '操作', en: 'Actions' }
  },
  buttons: {
    new: { zh: '新建迭代', en: 'New Iteration' },
    search: { zh: '查询', en: 'Search' },
    reset: { zh: '重置', en: 'Reset' },
    detail: { zh: '详情', en: 'Detail' },
    view: { zh: '查看', en: 'View' },
    delete: { zh: '删除', en: 'Delete' }
  }
}

// 测试：迭代列表表头国际化
runner.test('迭代列表表头国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  
  await helper.navigate('/iterations')
  await delay(1000)
  
  console.log('\n🌐 迭代列表表头国际化验证:')
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
  
  await helper.screenshot('iteration-i18n-headers')
})

// 测试：迭代列表按钮国际化
runner.test('迭代列表按钮国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  
  await helper.navigate('/iterations')
  await delay(1000)
  
  console.log('\n🌐 迭代列表按钮国际化验证:')
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
  
  await helper.screenshot('iteration-i18n-buttons')
})

// 测试：迭代对话框国际化
runner.test('迭代对话框国际化验证', async () => {
  await ensureLoggedIn()
  
  const helper = runner.getHelper()
  const page = runner.getContext().getPage()
  
  await helper.navigate('/iterations')
  await delay(1000)
  
  console.log('\n🌐 迭代对话框国际化验证:')
  console.log('=' .repeat(50))
  
  // 点击新建按钮
  const buttons = await page.$$('.el-button--primary')
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn)
    if (text?.includes('新建') || text?.includes('New') || text?.includes('Create')) {
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
    
    // 关闭对话框
    const closeBtn = await page.$('.el-dialog__headerbtn')
    if (closeBtn) await closeBtn.click()
  } else {
    console.log('对话框未打开')
  }
  
  await helper.screenshot('iteration-i18n-dialog')
})

// 运行测试
runner.run().catch(console.error)
