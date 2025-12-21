export default {
  app: {
    title: 'ReleaseHub',
  },
  lang: {
    zh: 'Chinese',
    en: 'English',
    switch: 'Language',
  },
  menu: {
    dashboard: 'Dashboard',
    projects: 'Projects',
    releaseWindows: 'Release Windows',
    branchRules: 'Branch Rules',
    versionPolicies: 'Version Policies',
    versionOps: 'Version Ops',
    login: 'Login',
    iterations: 'Iterations',
    repositories: 'Repositories',
    runs: 'Runs',
    blockBoard: 'Blocks',
    settings: 'Settings',
    groups: 'Groups'
  },
  common: {
    search: 'Search',
    reset: 'Reset',
    create: 'Create',
    edit: 'Edit',
    confirm: 'Confirm',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    logout: 'Logout',
    refresh: 'Refresh',
    delete: 'Delete',
    noData: 'No Data',
    todo: 'TODO',
    pleaseEnter: 'Please enter ',
    pleaseSelect: 'Please select ',
    startDate: 'Start Date',
    endDate: 'End Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    to: 'To',
    actions: 'Actions',
    detail: 'Detail',
    export: 'Export',
    copy: 'Copy',
    yes: 'Yes',
    no: 'No',
    keyword: 'Keyword',
    requestFailed: 'Request failed',
    unknownError: 'Unknown error',
    networkError: 'Network error',
    businessError: 'Business error'
  },
  dashboard: {
    totalProjects: 'Total Projects',
    activeWindows: 'Active Release Windows',
    pendingApprovals: 'Pending Approvals',
    recentScans: 'Recent Scans',
    recentActivity: 'Recent Activity',
    noActivity: 'No recent activity',
    quickActions: 'Quick Actions',
    newRelease: 'New Release',
    runScan: 'Run Scan',
  },
  releaseWindow: {
    name: 'ReleaseWindow Name',
    status: 'Status',
    create: 'Create ReleaseWindow',
    id: 'ID',
    createdAt: 'Created At',
    actions: 'Actions',
    view: 'View',
    freeze: 'Freeze',
    unfreeze: 'Unfreeze',
    active: 'Active',
    frozen: 'Frozen',
    placeholder: {
      name: 'Search by name',
      status: 'Select status',
      enterName: 'Enter name',
      enterDesc: 'Enter description',
    },
    description: 'Description',
    details: 'ReleaseWindow Details',
    editTitle: 'Edit ReleaseWindow',
    validation: {
      nameRequired: 'Please enter name',
      nameLength: 'Length should be 3 to 50',
      statusRequired: 'Please select status',
    }
  },
  project: {
    filter: 'Filter projects',
    noProject: 'No projects, please create first',
    selectTip: 'Please select a project/subproject',
    create: 'Create Project',
    name: 'Project Name',
    type: 'Type',
    status: 'Status',
    code: 'Code',
    repoUrl: 'Repo URL',
    buildTool: 'Build Tool',
    defaultBranch: 'Default Branch',
    description: 'Description',
    keyword: 'Keyword',
    enterKeyword: 'Enter keyword',
    active: 'Active',
    archived: 'Archived',
    dateRange: 'Created Date',
  },
  branchRule: {
    name: 'Rule Name',
    pattern: 'Branch Pattern',
    type: 'Type',
    create: 'Add Rule',
  },
  versionPolicy: {
    name: 'Policy Name',
    strategy: 'Strategy',
    create: 'Add Policy',
  },
  versionOps: {
    scanConfig: 'Scan Configuration',
    runScan: 'Run Scan',
    targetBranch: 'Target Branch',
    selectBranch: 'Select Branch',
    scanType: 'Scan Type',
    dependencyCheck: 'Dependency Check',
    codeQuality: 'Code Quality',
    scanHistory: 'Scan History',
    runId: 'Run ID',
    date: 'Date',
    branch: 'Branch',
    status: 'Status',
    viewDetails: 'View Details',
  },
  login: {
    title: 'ReleaseHub Login',
    username: 'Username',
    password: 'Password',
    placeholder: {
      username: 'Enter username',
      password: 'Enter password',
    },
    rememberMe: 'Remember Me',
    signIn: 'Sign In',
    validation: {
      usernameRequired: 'Please input username',
      passwordRequired: 'Please input password',
    },
    message: {
      success: 'Login successfully',
      authFailed: 'Invalid username or password',
      failed: 'Login failed',
    }
  },
  iteration: {
    new: 'New Iteration',
    columns: {
      key: 'Iteration Key',
      repos: 'Repos',
      mountedWindows: 'Mounted Windows',
      attachAt: 'Latest Mount Time'
    },
    detail: {
      associatedRepos: 'Associated Repositories',
      mountedWindows: 'Mounted Windows',
      attachToWindow: 'Attach to Window',
      orchestrateThisIteration: 'Orchestrate (this iteration)'
    }
  },
  repository: {
    addOrSync: 'Add / Sync Repo',
    columns: {
      repo: 'Repository',
      projectId: 'Project ID',
      defaultBranch: 'Default Branch',
      writable: 'Writable?'
    },
    openGitLab: 'Open in GitLab',
    gateSummary: 'Gate Summary',
    branchesMrSummary: 'Branches & MR Summary'
  },
  run: {
    filters: {
      windowKey: 'Window Key',
      repo: 'Repository',
      iterationKey: 'Iteration Key',
      status: 'Status'
    },
    columns: {
      runId: 'Run ID',
      type: 'Type',
      status: 'Status',
      start: 'Start',
      end: 'End'
    },
    actions: {
      detail: 'Detail',
      retry: 'Retry',
      export: 'Export'
    },
    detail: {
      title: 'Run',
      triplesTitle: 'Triples (executedOrder)',
      exportJson: 'Export JSON'
    }
  },
  audit: {
    retrySelected: 'Retry Selected',
    reasons: {
      conflict: 'CONFLICT',
      pipelineFailed: 'PIPELINE_FAILED',
      approvalRequired: 'APPROVAL_REQUIRED',
      protectedBranch: 'PROTECTED_BRANCH',
      permissionDenied: 'PERMISSION_DENIED',
      unknown: 'UNKNOWN'
    }
  },
  settings: {
    tabs: {
      gitlab: 'GitLab',
      naming: 'Naming Strategy',
      refs: 'Baseline Refs',
      blockPolicy: 'Block Policy',
      display: 'Display'
    },
    labels: {
      baseUrl: 'Base URL',
      token: 'Token'
    },
    buttons: {
      testConnection: 'Test Connection'
    },
    policy: {
      failFast: 'FAIL_FAST (default)',
      continueOnBlock: 'CONTINUE_ON_BLOCK (explicit)'
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
      ensureFeature: 'ensure feature/{iterationKey}',
      ensureRelease: 'ensure release/{windowKey}',
      ensureMR: 'reuse or create MR',
      tryMerge: 'try merge to release/{windowKey}'
    }
  }
  ,
  header: {
    title: 'ReleaseHub'
  }
  ,
  group: {
    title: 'Groups',
    name: 'Name',
    code: 'Code',
    parentCode: 'Parent Code',
    searchPlaceholder: 'Filter by group name',
    create: 'Create Group',
    createTop: 'Create Top-Level Group',
    createChild: 'Create Child Group',
    detail: 'Group Detail',
    notFound: 'Group Not Found',
    empty: 'No Groups',
    createSuccess: 'Created successfully',
    createFailed: 'Creation failed',
    edit: 'Edit Group',
    delete: 'Delete Group',
    confirmDelete: 'Confirm delete this group? This action cannot be undone.',
    updateSuccess: 'Updated successfully',
    updateFailed: 'Update failed'
    ,
    deleteSuccess: 'Deleted successfully'
  }
}
