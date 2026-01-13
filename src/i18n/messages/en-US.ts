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
    remove: 'Remove',
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
    businessError: 'Business error',
    basicInfo: 'Basic Info',
    selectDateTime: 'Select date and time',
    success: 'Success',
    warning: 'Warning',
    permissionDenied: 'Permission denied',
    partialSuccess: 'Partial success',
    sync: 'Sync',
    view: 'View',
    featureComingSoon: 'Feature coming soon',
    preview: 'Preview',
    execute: 'Execute',
    plan: 'Plan',
    clear: 'Clear',
    loginRequired: 'Please login first',
    close: 'Close',
    maxLength: 'Maximum {max} characters'
  },
  dashboard: {
    totalRepositories: 'Total Repositories',
    totalIterations: 'Total Iterations',
    activeWindows: 'Active Windows',
    recentRuns: 'Recent Runs',
    recentActivity: 'Recent Activity',
    noActivity: 'No recent activity',
    quickActions: 'Quick Actions',
    newRelease: 'New Release',
    refresh: 'Refresh',
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
    windowKey: 'Window Key',
    startAt: 'Start At',
    endAt: 'End At',
    updatedAt: 'Updated At',
    publishedAt: 'Published At',
    publish: 'Publish',
    close: 'Close',
    configureTime: 'Configure Time',
    confirmFreeze: 'Confirm to freeze this release window?',
    confirmPublish: 'Confirm to publish this release window?',
    confirmClose: 'Confirm to close this release window?',
    placeholder: {
      name: 'Search by name',
      status: 'Select status',
      enterName: 'Enter name',
      enterDesc: 'Enter description',
      enterWindowKey: 'Enter window key',
      enterDescription: 'Enter description',
    },
    description: 'Description',
    plannedReleaseAt: 'Planned Release',
    attachIterations: 'Attach Iterations',
    associatedIterations: 'Associated Iterations',
    noIterations: 'No associated iterations',
    noRepos: 'No associated repositories',
    confirmDetach: 'Confirm to detach this iteration?',
    details: 'ReleaseWindow Details',
    editTitle: 'Edit ReleaseWindow',
    validation: {
      nameRequired: 'Please enter name',
      nameLength: 'Length should be 3 to 50',
      statusRequired: 'Please select status',
      required: 'This field is required'
    },
    statusText: {
      DRAFT: 'Draft',
      PUBLISHED: 'Published',
      CLOSED: 'Closed'
    },
    versionUpdate: {
      title: 'Execute Version Update',
      execute: 'Execute Version Update',
      repoId: 'Repository',
      buildTool: 'Build Tool',
      targetVersion: 'Target Version',
      repoPath: 'Repository Path',
      pomPath: 'POM File Path',
      gradlePropertiesPath: 'Gradle Properties Path',
      selectRepo: 'Please select a repository',
      targetVersionPlaceholder: 'e.g., 1.2.3',
      repoPathPlaceholder: 'Local repository path, e.g., /path/to/repo',
      pomPathPlaceholder: 'POM file path, leave empty for default pom.xml',
      gradlePropertiesPathPlaceholder: 'Gradle properties path, leave empty for default gradle.properties',
      repoIdRequired: 'Please select a repository',
      targetVersionRequired: 'Please enter target version',
      buildToolRequired: 'Please select build tool',
      repoPathRequired: 'Please enter repository path',
      targetVersionTip: 'Format examples: 1.2.3 (SemVer) or 2024.01.27 (Date version)',
      repoPathTip: 'Local file system path, e.g., /path/to/repository or C:\\path\\to\\repository',
      validationFailed: 'Please check if the form is filled correctly',
      executing: 'Executing version update, please wait...',
      success: 'Version update started, Run ID: {runId}',
      failed: 'Version update failed, please check error message'
    },
    codeMerge: {
      button: 'Code Merge',
      title: 'Code Merge',
      info: 'Merge latest code from feature branches to release branch',
      mergeAll: 'Merge All Iterations',
      mergeSingle: 'Merge Single Iteration',
      selectIteration: 'Select iteration',
      execute: 'Execute Merge',
      sourceBranch: 'Source Branch',
      targetBranch: 'Target Branch',
      status: {
        SUCCESS: 'Success',
        CONFLICT: 'Conflict',
        FAILED: 'Failed'
      },
      allSuccess: 'All repositories merged successfully',
      hasConflict: 'Some repositories have conflicts, please resolve in GitLab',
      hasFailed: 'Some repositories failed to merge, please check error messages'
    }
  },
  project: {
    filter: 'Filter projects',
    noProject: 'No projects, please create first',
    selectTip: 'Please select a project/subproject',
    create: 'Create Project',
    edit: 'Edit Project',
    name: 'Project Name',
    namePlaceholder: 'Enter project name',
    nameRequired: 'Project name is required',
    type: 'Type',
    status: 'Status',
    statusActive: 'Active',
    statusArchived: 'Archived',
    code: 'Code',
    repoUrl: 'Repo URL',
    buildTool: 'Build Tool',
    defaultBranch: 'Default Branch',
    description: 'Description',
    descriptionPlaceholder: 'Enter project description',
    keyword: 'Keyword',
    enterKeyword: 'Enter keyword',
    active: 'Active',
    archived: 'Archived',
    archive: 'Archive',
    archiveSuccess: 'Archived successfully',
    dateRange: 'Created Date',
  },
  branchRule: {
    name: 'Rule Name',
    pattern: 'Branch Pattern',
    type: 'Type',
    create: 'Add Rule',
    edit: 'Edit Rule',
    typeAllow: 'Allow',
    typeBlock: 'Block',
    namePlaceholder: 'Enter rule name',
    patternPlaceholder: 'Enter branch pattern, e.g. feature/*',
    nameRequired: 'Rule name is required',
    patternRequired: 'Branch pattern is required',
    typeRequired: 'Please select rule type',
  },
  versionPolicy: {
    name: 'Policy Name',
    strategy: 'Strategy',
    scheme: 'Version Scheme',
    bumpRule: 'Bump Rule',
    create: 'Add Policy',
    builtInNote: 'Version policies are built-in. Supports SemVer (Semantic Versioning) and DATE (Date-based) schemes.',
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
    confirmDelete: 'Are you sure to delete iteration "{key}"? This action cannot be undone',
    columns: {
      key: 'Iteration Key',
      name: 'Iteration Name',
      description: 'Description',
      expectedReleaseAt: 'Expected Release',
      repos: 'Repos',
      mountedWindows: 'Mounted Windows',
      attachAt: 'Latest Mount Time',
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    },
    detail: {
      title: 'Iteration Detail',
      associatedRepos: 'Associated Repositories',
      noRepos: 'No repositories associated',
      addRepos: 'Add Repos',
      confirmRemoveRepo: 'Are you sure to remove repository "{repoId}"?',
      mountedWindows: 'Mounted Windows',
      attachToWindow: 'Attach to Window',
      orchestrateThisIteration: 'Orchestrate (this iteration)',
      operations: 'Operations',
      searchRepos: 'Search repository name',
      alreadyAdded: 'Already Added',
      selectedCount: '{count} new repositories selected',
      noNewRepos: 'Please select at least one new repository'
    }
  },
  repository: {
    addOrSync: 'Add / Sync Repo',
    searchPlaceholder: 'Search by name/URL',
    sync: 'Sync',
    healthLabel: 'Health',
    columns: {
      repo: 'Repository',
      name: 'Repository Name',
      cloneUrl: 'Clone URL',
      defaultBranch: 'Default Branch',
      monoRepo: 'Mono Repo',
      writable: 'Writable?'
    },
    openGitLab: 'Open in GitLab',
    gateSummary: 'Gate Summary',
    branchesMrSummary: 'Branches & MR Summary',
    placeholders: {
      name: 'e.g. backend-service',
      cloneUrl: 'git@gitlab.com:group/project.git',
      defaultBranch: 'master or main'
    },
    gateSummaryLabels: {
      protectedBranch: 'Protected Branch',
      approvalRequired: 'Approval Required',
      pipelineGate: 'Pipeline Gate',
      permissionDenied: 'Permission Denied'
    },
    branchSummary: {
      totalBranches: 'Total Branches',
      activeBranches: 'Active Branches',
      nonCompliant: 'Non-Compliant',
      activeMrs: 'Active MRs',
      mergedMrs: 'Merged MRs',
      closedMrs: 'Closed MRs'
    },
    gitlabMissing: 'Configure GitLab settings first',
    gitlabUrlNotAvailable: 'GitLab URL not available',
    health: {
      healthy: 'Healthy',
      risk: 'Risk'
    },
    validation: {
      name: 'Name max 128 chars',
      cloneUrl: 'Clone URL max 512 chars',
      defaultBranch: 'Default branch max 128 chars'
    }
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
      end: 'End',
      operator: 'Operator'
    },
    retryConfirm: 'Confirm to retry this run?',
    noFailedItems: 'No failed items',
    retrySuccess: 'Retry started',
    actions: {
      detail: 'Detail',
      retry: 'Retry',
      export: 'Export'
    },
    detail: {
      title: 'Run',
      triplesTitle: 'Triples (executedOrder)',
      exportJson: 'Export JSON'
    },
    steps: 'Execution Steps',
    diff: {
      title: 'Version Update Diff',
      noDiff: 'No diff information'
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
      token: 'Token',
      featureTemplate: 'Feature Branch Template',
      releaseTemplate: 'Release Branch Template'
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
    searchPlaceholder: 'Filter by name or code',
    emptyFiltered: 'No matching groups',
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
    updateFailed: 'Update failed',
    deleteSuccess: 'Deleted successfully',
    deleteBlocked: 'Cannot delete group with children',
    validation: {
      nameRequired: 'Please enter name',
      codeRequired: 'Please enter code',
      nameLength: 'Name must be at most 128 characters',
      codeLength: 'Code must be at most 64 characters',
      parentLength: 'Parent code must be at most 64 characters',
      codeImmutable: 'Code cannot be changed'
    }
  }
}
