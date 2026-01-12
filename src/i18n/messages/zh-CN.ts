export default {
  app: {
    title: 'ReleaseHub',
  },
  lang: {
    zh: '中文',
    en: 'English',
    switch: '语言',
  },
  menu: {
    dashboard: '仪表盘',
    projects: '项目管理',
    releaseWindows: '发布窗口',
    branchRules: '分支规则',
    versionPolicies: '版本策略',
    versionOps: '版本操作',
    login: '登录',
    iterations: '迭代',
    repositories: '仓库',
    runs: '执行记录',
    blockBoard: '阻塞看板',
    settings: '配置',
    groups: '分组设置'
  },
  common: {
    search: '查询',
    reset: '重置',
    create: '新增',
    edit: '编辑',
    confirm: '确认',
    save: '保存',
    cancel: '取消',
    back: '返回',
    logout: '退出登录',
    refresh: '刷新',
    delete: '删除',
    noData: '暂无数据',
    todo: '待完善',
    pleaseEnter: '请输入',
    pleaseSelect: '请选择',
    startDate: '开始日期',
    endDate: '结束日期',
    startTime: '开始时间',
    endTime: '结束时间',
    to: '至',
    actions: '操作',
    detail: '详情',
    export: '导出',
    copy: '复制',
    yes: '是',
    no: '否',
    keyword: '关键字',
    requestFailed: '请求失败',
    unknownError: '未知错误',
    networkError: '网络异常',
    businessError: '业务异常',
    basicInfo: '基本信息',
    selectDateTime: '请选择日期时间',
    success: '操作成功',
    warning: '警告',
    permissionDenied: '权限不足',
    partialSuccess: '部分成功',
    sync: '同步',
    view: '查看',
    featureComingSoon: '功能开发中',
    preview: '预览',
    execute: '执行',
    plan: '计划',
    clear: '清空',
    loginRequired: '请先登录',
    close: '关闭'
  },
  dashboard: {
    totalProjects: '项目总数',
    activeWindows: '活跃发布窗口',
    pendingApprovals: '待审批',
    recentScans: '近期扫描',
    recentActivity: '近期活动',
    noActivity: '暂无活动',
    quickActions: '快捷操作',
    newRelease: '新建发布',
    runScan: '执行扫描',
  },
  releaseWindow: {
    name: '发布窗口名称',
    status: '状态',
    create: '创建发布窗口',
    id: 'ID',
    createdAt: '创建时间',
    actions: '操作',
    view: '查看',
    freeze: '冻结',
    unfreeze: '解冻',
    active: '活跃',
    frozen: '已冻结',
    windowKey: '发布窗口标识',
    startAt: '开始时间',
    endAt: '结束时间',
    updatedAt: '更新时间',
    publishedAt: '发布时间',
    publish: '发布',
    close: '关闭',
    configureTime: '配置时间',
    confirmFreeze: '确认冻结此发布窗口？',
    confirmPublish: '确认发布此发布窗口？',
    confirmClose: '确认关闭此发布窗口？',
    placeholder: {
      name: '按名称搜索',
      status: '选择状态',
      enterName: '请输入名称',
      enterDesc: '请输入描述',
      enterWindowKey: '请输入窗口标识'
    },
    description: '描述',
    details: '发布窗口详情',
    editTitle: '编辑发布窗口',
    validation: {
      nameRequired: '请输入名称',
      nameLength: '长度应在 3 到 50 个字符之间',
      statusRequired: '请选择状态',
      required: '该字段为必填项'
    },
    statusText: {
      DRAFT: '草稿',
      INIT: '初始化',
      OPEN: '开启',
      FROZEN: '已冻结',
      CLOSED: '已关闭',
      PUBLISHED: '已发布'
    },
    versionUpdate: {
      title: '执行版本更新',
      execute: '执行版本更新',
      repoId: '仓库',
      buildTool: '构建工具',
      targetVersion: '目标版本号',
      repoPath: '仓库路径',
      pomPath: 'POM 文件路径',
      gradlePropertiesPath: 'Gradle Properties 路径',
      selectRepo: '请选择仓库',
      targetVersionPlaceholder: '例如: 1.2.3',
      repoPathPlaceholder: '本地仓库路径，例如: /path/to/repo',
      pomPathPlaceholder: 'POM 文件路径，留空则使用默认 pom.xml',
      gradlePropertiesPathPlaceholder: 'Gradle Properties 路径，留空则使用默认 gradle.properties',
      repoIdRequired: '请选择仓库',
      targetVersionRequired: '请输入目标版本号',
      buildToolRequired: '请选择构建工具',
      repoPathRequired: '请输入仓库路径',
      targetVersionTip: '格式示例：1.2.3（SemVer）或 2024.01.27（日期版本）',
      repoPathTip: '本地文件系统路径，例如：/path/to/repository 或 C:\\path\\to\\repository',
      validationFailed: '请检查表单填写是否正确',
      executing: '正在执行版本更新，请稍候...',
      success: '版本更新已启动，执行记录 ID: {runId}',
      failed: '版本更新失败，请查看错误信息'
    }
  },
  project: {
    filter: '筛选项目',
    noProject: '暂无项目，请先创建项目/子项目',
    selectTip: '请选择一个项目/子项目',
    create: '新建项目',
    name: '项目名称',
    type: '类型',
    status: '状态',
    code: '编码',
    repoUrl: '仓库地址',
    buildTool: '构建工具',
    defaultBranch: '默认分支',
    description: '描述',
    keyword: '关键字',
    enterKeyword: '请输入关键字',
    active: '进行中',
    archived: '已归档',
    dateRange: '创建时间',
  },
  branchRule: {
    name: '规则名称',
    pattern: '分支模式',
    type: '类型',
    create: '新增规则',
  },
  versionPolicy: {
    name: '策略名称',
    strategy: '策略',
    create: '新增策略',
  },
  versionOps: {
    scanConfig: '扫描配置',
    runScan: '执行扫描',
    targetBranch: '目标分支',
    selectBranch: '选择分支',
    scanType: '扫描类型',
    dependencyCheck: '依赖检查',
    codeQuality: '代码质量',
    scanHistory: '扫描历史',
    runId: '运行ID',
    date: '日期',
    branch: '分支',
    status: '状态',
    viewDetails: '查看详情',
  },
  login: {
    title: 'ReleaseHub 登录',
    username: '用户名',
    password: '密码',
    placeholder: {
      username: '请输入用户名',
      password: '请输入密码',
    },
    rememberMe: '记住我',
    signIn: '登录',
    validation: {
      usernameRequired: '请输入用户名',
      passwordRequired: '请输入密码',
    },
    message: {
      success: '登录成功',
      authFailed: '用户名或密码错误',
      failed: '登录失败',
    }
  },
  iteration: {
    new: '新建迭代',
    confirmDelete: '确认删除迭代 "{key}"？此操作不可恢复',
    columns: {
      key: '迭代标识',
      description: '描述',
      repos: '仓库数',
      mountedWindows: '挂载窗口数',
      attachAt: '最近挂载时间',
      createdAt: '创建时间',
      updatedAt: '更新时间'
    },
    detail: {
      associatedRepos: '关联仓库',
      noRepos: '暂无关联仓库',
      addRepos: '添加仓库',
      confirmRemoveRepo: '确认移除仓库 "{repoId}"？',
      mountedWindows: '挂载窗口',
      attachToWindow: '挂载到窗口',
      orchestrateThisIteration: '编排（此迭代）',
      operations: '操作'
    }
  },
  repository: {
    addOrSync: '新增/同步仓库',
    searchPlaceholder: '按名称/URL/项目/GitLab ID 搜索',
    sync: '同步',
    healthLabel: '健康',
    columns: {
      repo: '仓库',
      projectId: '项目ID',
      gitlabProjectId: 'GitLab 项目ID',
      cloneUrl: '仓库地址',
      defaultBranch: '默认分支',
      monoRepo: '单仓',
      writable: '可写？'
    },
    openGitLab: '打开 GitLab',
    gateSummary: '门禁摘要',
    branchesMrSummary: '分支与 MR 摘要',
    placeholders: {
      projectId: '例如 12345',
      name: '例如 backend-service',
      gitlabProjectId: '例如 123456',
      cloneUrl: 'git@gitlab.com:group/project.git',
      defaultBranch: 'master 或 main'
    },
    gateSummaryLabels: {
      protectedBranch: '保护分支',
      approvalRequired: '需要审批',
      pipelineGate: '流水线门禁',
      permissionDenied: '权限不足'
    },
    branchSummary: {
      totalBranches: '分支总数',
      activeBranches: '活跃分支',
      nonCompliant: '不合规',
      activeMrs: '活跃 MR',
      mergedMrs: '已合并 MR',
      closedMrs: '已关闭 MR'
    },
    gitlabMissing: '请先在系统设置中配置 GitLab',
    health: {
      healthy: '健康',
      risk: '风险'
    },
    validation: {
      projectId: '项目ID 最长 36 个字符',
      gitlabId: '请输入 GitLab 项目ID',
      name: '名称最长 128 个字符',
      cloneUrl: '仓库地址最长 512 个字符',
      defaultBranch: '默认分支最长 128 个字符'
    }
  },
  run: {
    filters: {
      windowKey: '发布窗口标识',
      repo: '仓库',
      iterationKey: '迭代标识',
      status: '状态'
    },
    columns: {
      runId: '运行ID',
      type: '类型',
      status: '状态',
      start: '开始时间',
      end: '结束时间',
      operator: '操作人'
    },
    retryConfirm: '确认重试此运行？',
    noFailedItems: '没有失败的执行项',
    retrySuccess: '重试已启动',
    actions: {
      detail: '详情',
      retry: '重试',
      export: '导出'
    },
    detail: {
      title: '运行',
      triplesTitle: '三元组（executedOrder）',
      exportJson: '导出 JSON'
    },
    steps: '执行步骤',
    diff: {
      title: '版本更新差异',
      noDiff: '无差异信息'
    }
  },
  audit: {
    retrySelected: '批量重试',
    reasons: {
      conflict: '冲突',
      pipelineFailed: '流水线失败',
      approvalRequired: '需要审批',
      protectedBranch: '受保护分支',
      permissionDenied: '权限不足',
      unknown: '未知'
    }
  },
  settings: {
    tabs: {
      gitlab: 'GitLab',
      naming: '命名策略',
      refs: '基线 Ref',
      blockPolicy: '阻塞策略',
      display: '显示偏好'
    },
    labels: {
      baseUrl: '基础 URL',
      token: '令牌'
    },
    buttons: {
      testConnection: '测试连接'
    },
    policy: {
      failFast: 'FAIL_FAST（默认）',
      continueOnBlock: 'CONTINUE_ON_BLOCK（显式选择）'
    }
  },
  evidence: {
    projectId: 'projectId',
    mrIid: 'MR iid',
    source: 'source',
    target: 'target',
    mrUrl: 'MR url',
    blockReason: 'blockReason'
  },
  timeline: {
    steps: {
      ensureFeature: 'ENSURE_FEATURE',
      ensureRelease: 'ENSURE_RELEASE',
      ensureMR: 'ENSURE_MR',
      tryMerge: 'TRY_MERGE'
    },
    desc: {
      ensureFeature: '确保 feature/{iterationKey}',
      ensureRelease: '确保 release/{windowKey}',
      ensureMR: '复用或创建 MR',
      tryMerge: '尝试合并到 release/{windowKey}'
    }
  }
  ,
  header: {
    title: 'ReleaseHub'
  }
  ,
  group: {
    title: '分组设置',
    name: '名称',
    code: '编码',
    parentCode: '父级编码',
    searchPlaceholder: '按名称或编码筛选',
    emptyFiltered: '没有匹配的分组',
    create: '新增分组',
    createTop: '新增顶层分组',
    createChild: '新增下级分组',
    detail: '分组详情',
    notFound: '未找到分组',
    empty: '暂无分组',
    createSuccess: '创建成功',
    createFailed: '创建失败',
    edit: '编辑分组',
    delete: '删除分组',
    confirmDelete: '确认删除该分组？此操作不可恢复',
    updateSuccess: '更新成功',
    updateFailed: '更新失败',
    deleteSuccess: '删除成功',
    deleteBlocked: '存在子分组，无法删除',
    validation: {
      nameRequired: '请输入名称',
      codeRequired: '请输入编码',
      nameLength: '名称最长 128 个字符',
      codeLength: '编码最长 64 个字符',
      parentLength: '父级编码最长 64 个字符',
      codeImmutable: '编码不可修改'
    }
  }
}
