# CRUD Templates

一套基于 Vue 3 + Element Plus 的标准化 CRUD 页面开发模板。

## 目录结构

- `src/components/crud/`: 通用 CRUD 组件（SearchForm, DataTable）
- `src/composables/crud/`: 页面级本地状态逻辑（useListPage, useDetailForm, useDialogForm）
- `src/views/_templates/crud/project/`: 示例模块（Project）

## 核心原则

1. **状态本地化**：页面自身的查询条件、表格数据、表单草稿等状态，必须放在组件本地（ref/reactive）或 `composables` 中，**严禁放入 Pinia**。Pinia 仅用于全局共享状态（如用户信息、字典、跨页缓存）。
2. **逻辑复用**：使用 `useListPage` 等 composables 复用通用逻辑（分页、loading、CRUD 流程），减少样板代码。
3. **类型安全**：严格使用 TypeScript 定义 API 接口和组件 Props。

## 如何使用

### 1. 列表页 (List)

复制 `src/views/_templates/crud/project/ProjectList.vue` 并修改：
- 替换 `projectApi` 为你的业务 API。
- 修改 `defaultQuery` 和 `SearchForm` 中的字段。
- 修改 `DataTable` 的列定义。
- 修改 `Dialog` 组件引用。

### 2. 弹窗编辑 (Dialog)

复制 `src/views/_templates/crud/project/ProjectDialog.vue` 并修改：
- 定义 `defaultForm` 结构。
- 替换 API 方法。
- 修改表单项和校验规则。

### 3. 详情/独立编辑页 (Detail)

复制 `src/views/_templates/crud/project/ProjectDetail.vue` 并修改：
- 类似 Dialog，替换 Form 和 API。
- 路由配置需支持 `:id?` 参数。

## API 规范

后端 API 函数建议符合以下签名（示例）：
- `list(query: PageQuery): Promise<PageResult<T>>`
- `get(id: Id): Promise<T>`
- `create(payload: T): Promise<T>`
- `update(id: Id, payload: T): Promise<T>`

## 依赖组件

- `SearchForm`: 封装了查询/重置布局。
- `DataTable`: 封装了 Table + Pagination。

## 示例运行

本项目包含 Mock API (`src/api/mock/projectApi.ts`)，可直接挂载示例路由查看效果。
