
// ============================================================
// JOCE IDE - JO Code Editor - Complete Browser-Based IDE
// Version 2.3 - Production-Ready Extension System
// ============================================================

// ===== OFFLINE STORAGE =====
const Storage = {
  prefix: 'joce_',
  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch(e) { console.warn('Storage error:', e); }
  },
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch(e) { return defaultValue; }
  },
  remove(key) {
    try { localStorage.removeItem(this.prefix + key); } catch(e) {}
  },
  saveProject() {
    this.set('files', State.files);
    this.set('folders', [...State.folders]);
    this.set('openTabs', State.openTabs);
    this.set('activeTab', State.activeTab);
    this.set('expandedFolders', [...State.expandedFolders]);
    this.set('projectName', document.getElementById('projectName').textContent);
  },
  loadProject() {
    const files = this.get('files');
    if (files) State.files = files;
    const folders = this.get('folders', []);
    State.folders = new Set(folders);
    State.openTabs = this.get('openTabs', []);
    State.activeTab = this.get('activeTab');
    const expanded = this.get('expandedFolders', []);
    State.expandedFolders = new Set(expanded);
    const name = this.get('projectName', 'Untitled Project');
    document.getElementById('projectName').textContent = name;
  },
  saveSettings() {
    this.set('settings', {
      theme: State.theme,
      accentColor: State.accentColor,
      bgType: State.bgType,
      bgImage: State.bgImage,
      bgOpacity: State.bgOpacity,
      bgBlur: State.bgBlur,
      bgBrightness: State.bgBrightness,
      bgContrast: State.bgContrast,
      bgSaturation: State.bgSaturation,
      bgSize: State.bgSize,
      bgPosition: State.bgPosition,
      bgRepeat: State.bgRepeat,
      glassBlur: State.glassBlur,
      atmosphereEnabled: State.atmosphereEnabled,
      autoSave: State.autoSave,
      liveRefresh: State.liveRefresh,
      wordWrap: State.wordWrap,
      language: State.language,
      extensions: State.extensions,
      updateLog: State.updateLog,
      lastSeenVersion: State.lastSeenVersion
    });
  },
  loadSettings() {
    const s = this.get('settings', {});
    if (s.theme) State.theme = s.theme;
    if (s.accentColor) State.accentColor = s.accentColor;
    if (s.bgType) State.bgType = s.bgType;
    if (s.bgImage) State.bgImage = s.bgImage;
    if (s.bgOpacity !== undefined) State.bgOpacity = s.bgOpacity;
    if (s.bgBlur !== undefined) State.bgBlur = s.bgBlur;
    if (s.bgBrightness !== undefined) State.bgBrightness = s.bgBrightness;
    if (s.bgContrast !== undefined) State.bgContrast = s.bgContrast;
    if (s.bgSaturation !== undefined) State.bgSaturation = s.bgSaturation;
    if (s.bgSize) State.bgSize = s.bgSize;
    if (s.bgPosition) State.bgPosition = s.bgPosition;
    if (s.bgRepeat) State.bgRepeat = s.bgRepeat;
    if (s.glassBlur !== undefined) State.glassBlur = s.glassBlur;
    if (s.atmosphereEnabled !== undefined) State.atmosphereEnabled = s.atmosphereEnabled;
    if (s.autoSave !== undefined) State.autoSave = s.autoSave;
    if (s.liveRefresh !== undefined) State.liveRefresh = s.liveRefresh;
    if (s.wordWrap !== undefined) State.wordWrap = s.wordWrap;
    if (s.language) State.language = s.language;
    if (s.extensions) State.extensions = s.extensions;
    if (Array.isArray(s.updateLog)) State.updateLog = s.updateLog;
    if (s.lastSeenVersion) State.lastSeenVersion = s.lastSeenVersion;
  }
};

// ===== SVG ICON LIBRARY =====
const Icons = {
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  fileHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="8 16 10 14 8 12"/><line x1="13" y1="16" x2="16" y2="16"/></svg>',
  fileCss: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h3a1.5 1.5 0 010 3H8"/></svg>',
  fileJs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 16s.5 1 2 1 2-1 2-1"/><line x1="10" y1="12" x2="10" y2="14"/></svg>',
  fileJson: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13a2 2 0 002 2h4a2 2 0 002-2"/></svg>',
  fileImage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  fileMd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="8" y2="17"/><polyline points="8 13 10 15 12 13"/><line x1="12" y1="13" x2="12" y2="17"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
  folderOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 19a2 2 0 01-2-2V5a2 2 0 012-2h4l2 3h9a2 2 0 012 2v1"/><path d="M5 19h14.2a2 2 0 001.9-1.4l2-6.6a1 1 0 00-1-1.3H7.8a2 2 0 00-1.9 1.4L4 17.5"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  move: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  zip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M12 2v8l-2-2"/><path d="M12 10l2-2"/><rect x="10" y="14" width="4" height="4" rx="0.5"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  puzzle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 8h-1V6a4 4 0 00-8 0v2H9a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2z"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  power: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>'
};

function icon(name, w, h) {
  w = w || 14;
  h = h || 14;
  return '<span style="display:inline-flex;width:' + w + 'px;height:' + h + 'px;flex-shrink:0">' + (Icons[name] || Icons.file) + '</span>';
}

// ===== STATE MANAGEMENT =====
const State = {
  files: {},
  folders: new Set(),
  openTabs: [],
  activeTab: null,
  expandedFolders: new Set(),
  selectedItem: null,
  clipboard: null,
  undoStack: {},
  redoStack: {},
  previewVisible: false,
  sidebarVisible: true,
  wordWrap: false,
  autoSave: true,
  theme: 'dark',
  language: 'en',
  accentColor: '#58a6ff',
  bgType: 'default',
  bgImage: null,
  bgOpacity: 0.25,
  bgBlur: 0,
  bgBrightness: 100,
  bgContrast: 100,
  bgSaturation: 100,
  bgSize: 'cover',
  bgPosition: 'center center',
  bgRepeat: 'no-repeat',
  glassBlur: 12,
  atmosphereEnabled: true,
  liveRefresh: true,
  refreshTimer: null,
  searchQuery: '',
  searchScope: 'project',
  dragItem: null,
  fullscreen: false,
  importTargetFolder: null,
  extensions: [],
  updateLog: [],
  lastSeenVersion: '0.0.0',
  suggestions: { visible: false, items: [], selected: 0 },
  currentExtensionView: null
};


// ============================================================
// ===== LOCALIZATION / I18N =====
// ============================================================
const I18N = {
  en: {
    appName: 'JOCE IDE',
    explorer: 'Explorer',
    search: 'Search',
    newFile: 'New File',
    newFolder: 'New Folder',
    import: 'Import',
    save: 'Save',
    format: 'Format',
    preview: 'Preview',
    export: 'Export',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    appearance: 'Appearance',
    background: 'Background',
    editor: 'Editor',
    project: 'Project',
    projectName: 'Project Name',
    appInfo: 'App Information',
    version: 'Version',
    updateLog: 'Update Log',
    viewHistory: 'View History',
    lastUpdate: 'Last Update',
    historyEntries: 'History Entries',
    releaseNotes: 'Release Notes',
    markAsRead: 'Mark as Read',
    searchFilesCommands: 'Search files or type > for commands...',
    dark: 'Dark',
    light: 'Light',
    noRepeat: 'No Repeat',
    autoSave: 'Auto-save',
    wordWrap: 'Word Wrap',
    livePreview: 'Live Preview',
    glassBlur: 'Glass Blur',
    accentColor: 'Accent Color',
    backgroundImage: 'Background Image',
    chooseImage: 'Choose Image',
    current: 'Current',
    clear: 'Clear',
    opacity: 'Opacity',
    blur: 'Blur',
    brightness: 'Brightness',
    contrast: 'Contrast',
    saturation: 'Saturation',
    atmosphereEffect: 'Atmosphere Effect',
    backgroundSize: 'Background Size',
    backgroundPosition: 'Background Position',
    backgroundRepeat: 'Background Repeat',
    cover: 'Cover',
    contain: 'Contain',
    tile: 'Tile',
    center: 'Center',
    topLeft: 'Top Left',
    topRight: 'Top Right',
    bottomLeft: 'Bottom Left',
    bottomRight: 'Bottom Right',
    english: 'English',
    arabic: 'Arabic',
    chooseLanguage: 'Choose Language',
    noFilesYet: 'No files yet',
    createFile: 'Create File',
    welcomeTitle: 'Welcome to JOCE IDE',
    welcomeDesc: 'A professional browser-based development environment. Create a new file, import a project, or drag and drop files to get started.',
    importFiles: 'Import Files',
    importProject: 'Import Project',
    importProjectFolder: 'Import Project Folder',
    importIntoFolder: 'Import Files Into Folder',
    importFilesHere: 'Import Files Here',
    searchProject: 'Search in project...',
    searchThisFile: 'Current file only',
    caseSensitive: 'Case sensitive',
    regex: 'Regex',
    resultFound: 'result(s) found',
    noResultsFound: 'No results found',
    extensions: 'Extensions',
    extensionSettings: 'Extension Settings',
    extensionInfo: 'Extension Info',
    installed: 'Installed',
    active: 'Active',
    inactive: 'Inactive',
    error: 'Error',
    statusReady: 'Ready',
    autoSaveOn: 'Auto-save: On',
    autoSaveOff: 'Auto-save: Off',
    open: 'Open',
    rename: 'Rename',
    duplicate: 'Duplicate',
    copyPath: 'Copy Path',
    download: 'Download',
    moveTo: 'Move to...',
    delete: 'Delete',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All',
    importFolderProject: 'Import Folder / Project',
    importHere: 'Import Here'
  },
  ar: {
    appName: 'JOCE IDE',
    explorer: 'المستكشف',
    search: 'بحث',
    newFile: 'ملف جديد',
    newFolder: 'مجلد جديد',
    import: 'استيراد',
    save: 'حفظ',
    format: 'تنسيق',
    preview: 'معاينة',
    export: 'تصدير',
    settings: 'الإعدادات',
    theme: 'الثيم',
    language: 'اللغة',
    appearance: 'المظهر',
    background: 'الخلفية',
    editor: 'المحرر',
    project: 'المشروع',
    projectName: 'اسم المشروع',
    appInfo: 'معلومات التطبيق',
    version: 'الإصدار',
    updateLog: 'سجل التحديثات',
    viewHistory: 'عرض السجل',
    lastUpdate: 'آخر تحديث',
    historyEntries: 'عدد السجلات',
    releaseNotes: 'ملاحظات الإصدار',
    markAsRead: 'تعيين كمقروء',
    searchFilesCommands: 'ابحث في الملفات أو اكتب > للأوامر...',
    dark: 'داكن',
    light: 'فاتح',
    noRepeat: 'بدون تكرار',
    autoSave: 'حفظ تلقائي',
    wordWrap: 'التفاف النص',
    livePreview: 'معاينة مباشرة',
    glassBlur: 'ضبابية الزجاج',
    accentColor: 'لون التمييز',
    backgroundImage: 'صورة الخلفية',
    chooseImage: 'اختيار صورة',
    current: 'الحالي',
    clear: 'مسح',
    opacity: 'الشفافية',
    blur: 'الضبابية',
    brightness: 'الإضاءة',
    contrast: 'التباين',
    saturation: 'التشبع',
    atmosphereEffect: 'تأثير الأجواء',
    backgroundSize: 'حجم الخلفية',
    backgroundPosition: 'موضع الخلفية',
    backgroundRepeat: 'تكرار الخلفية',
    cover: 'ملء',
    contain: 'احتواء',
    tile: 'تكرار',
    center: 'الوسط',
    topLeft: 'أعلى اليسار',
    topRight: 'أعلى اليمين',
    bottomLeft: 'أسفل اليسار',
    bottomRight: 'أسفل اليمين',
    english: 'English',
    arabic: 'العربية',
    chooseLanguage: 'اختيار اللغة',
    noFilesYet: 'لا توجد ملفات بعد',
    createFile: 'إنشاء ملف',
    welcomeTitle: 'مرحبًا بك في JOCE IDE',
    welcomeDesc: 'بيئة تطوير احترافية داخل المتصفح. أنشئ ملفًا جديدًا أو استورد مشروعًا أو اسحب الملفات وابدأ العمل.',
    importFiles: 'استيراد ملفات',
    importProject: 'استيراد مشروع',
    importProjectFolder: 'استيراد مجلد مشروع',
    importIntoFolder: 'استيراد ملفات إلى المجلد',
    importFilesHere: 'استيراد الملفات هنا',
    searchProject: 'ابحث في المشروع...',
    searchThisFile: 'الملف الحالي فقط',
    caseSensitive: 'حساسية الأحرف',
    regex: 'تعبير منتظم',
    resultFound: 'نتيجة/نتائج',
    noResultsFound: 'لا توجد نتائج',
    extensions: 'الإضافات',
    extensionSettings: 'إعدادات الإضافة',
    extensionInfo: 'معلومات الإضافة',
    installed: 'تم التثبيت',
    active: 'نشط',
    inactive: 'غير نشط',
    error: 'خطأ',
    statusReady: 'جاهز',
    autoSaveOn: 'الحفظ التلقائي: مفعل',
    autoSaveOff: 'الحفظ التلقائي: متوقف',
    open: 'فتح',
    rename: 'إعادة تسمية',
    duplicate: 'نسخ',
    copyPath: 'نسخ المسار',
    download: 'تحميل',
    moveTo: 'نقل إلى...',
    delete: 'حذف',
    close: 'إغلاق',
    closeOthers: 'إغلاق الآخرين',
    closeAll: 'إغلاق الكل',
    importFolderProject: 'استيراد مجلد / مشروع',
    importHere: 'استيراد هنا'
  }
};

function t(key) {
  const lang = State.language === 'ar' ? 'ar' : 'en';
  return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || key;
}

function translateStatusText() {
  const auto = document.getElementById('autoSaveLabel');
  if (auto) auto.textContent = State.autoSave ? t('autoSaveOn') : t('autoSaveOff');
  const status = document.getElementById('statusText');
  if (status) status.textContent = t('statusReady');
}

function updateLocalizedUI() {
  document.documentElement.lang = State.language === 'ar' ? 'ar' : 'en';
  document.documentElement.dir = State.language === 'ar' ? 'rtl' : 'ltr';
  const textarea = document.getElementById('codeTextarea');
  if (textarea) textarea.dir = 'ltr';

  const projectName = document.getElementById('projectName');
  if (projectName && !projectName.textContent) {
    projectName.textContent = t('appName');
  }

  const sidebarTitle = document.getElementById('sidebarTitle');
  if (sidebarTitle) sidebarTitle.textContent = t('explorer');

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t('searchProject');

  const cpInput = document.getElementById('cpInput');
  if (cpInput) cpInput.placeholder = t('searchFilesCommands');

  const autoSaveLabel = document.getElementById('autoSaveLabel');
  if (autoSaveLabel) autoSaveLabel.textContent = State.autoSave ? t('autoSaveOn') : t('autoSaveOff');

  const emptyTitle = document.querySelector('.empty-state-title');
  if (emptyTitle) emptyTitle.textContent = t('welcomeTitle');
  const emptyDesc = document.querySelector('.empty-state-desc');
  if (emptyDesc) emptyDesc.textContent = t('welcomeDesc');

  const previewBtn = document.getElementById('togglePreviewBtn');
  if (previewBtn) previewBtn.title = State.language === 'ar' ? 'تبديل المعاينة (Ctrl+Shift+P)' : 'Toggle Preview (Ctrl+Shift+P)';
  const wrapBtn = document.getElementById('toggleWrapBtn');
  if (wrapBtn) wrapBtn.title = State.language === 'ar' ? 'تبديل التفاف النص' : 'Toggle Word Wrap';
}


function setLanguage(lang) {
  State.language = lang === 'ar' ? 'ar' : 'en';
  Storage.saveSettings();
  updateLocalizedUI();
  ExtensionAPI.triggerEvent('language:change', { language: State.language });
  showToast(State.language === 'ar' ? 'تم تغيير اللغة' : 'Language changed', 'success');
}

function formatUpdateTimestamp(ts) {
  try {
    return new Date(ts).toLocaleString(State.language === 'ar' ? 'ar-EG' : undefined);
  } catch (e) {
    return String(ts || '');
  }
}

function getDefaultUpdateLog() {
  return JSON.parse(JSON.stringify(APP_CHANGELOG));
}

function normalizeUpdateLogEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  return {
    version: entry.version || '1.0.0',
    time: entry.time || new Date().toISOString(),
    title: entry.title || { en: 'Update', ar: 'تحديث' },
    items: entry.items || { en: ['No details available.'], ar: ['لا توجد تفاصيل متاحة.'] }
  };
}

function ensureUpdateLog() {
  if (!Array.isArray(State.updateLog) || State.updateLog.length === 0) {
    State.updateLog = getDefaultUpdateLog();
  } else {
    State.updateLog = State.updateLog.map(normalizeUpdateLogEntry).filter(Boolean);
    const hasCurrentVersion = State.updateLog.some(function(entry) {
      return entry.version === APP_VERSION;
    });
    if (!hasCurrentVersion && APP_CHANGELOG[0]) {
      State.updateLog.unshift(normalizeUpdateLogEntry(APP_CHANGELOG[0]));
    }
  }

  State.updateLog.sort(function(a, b) {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  if (!State.lastSeenVersion) {
    State.lastSeenVersion = APP_VERSION;
  }
}

function markUpdateLogAsRead() {
  State.lastSeenVersion = APP_VERSION;
  Storage.saveSettings();
  showToast(State.language === 'ar' ? 'تم تعليم سجل التحديثات كمقروء' : 'Update log marked as read', 'success');
  closeModal();
}

function openUpdateLog() {
  ensureUpdateLog();
  const lang = State.language === 'ar' ? 'ar' : 'en';
  const isArabic = lang === 'ar';

  let html = '<div class="settings-section">' +
    '<div class="settings-section-title">' + t('updateLog') + '</div>' +
    '<div class="settings-row">' +
      '<span class="settings-row-label">' + t('version') + '</span>' +
      '<span class="settings-row-value">v' + APP_VERSION + '</span>' +
    '</div>' +
    '<div class="settings-row">' +
      '<span class="settings-row-label">' + t('historyEntries') + '</span>' +
      '<span class="settings-row-value">' + State.updateLog.length + '</span>' +
    '</div>' +
  '</div>';

  if (State.updateLog.length === 0) {
    html += '<div class="cp-empty" style="padding:24px">' + (isArabic ? 'لا يوجد سجل تحديثات بعد.' : 'No update history yet.') + '</div>';
  } else {
    html += '<div class="extensions-list">';
    State.updateLog.forEach(function(entry) {
      const entryTitle = isArabic ? (entry.title.ar || entry.title.en) : (entry.title.en || entry.title.ar);
      const details = isArabic ? (entry.items.ar || entry.items.en) : (entry.items.en || entry.items.ar);
      html += '<div class="extension-card">' +
        '<div class="extension-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v5l3 2"/><circle cx="12" cy="12" r="9"/></svg>' +
        '</div>' +
        '<div class="extension-info">' +
          '<div class="extension-header">' +
            '<span class="extension-name">' + Syntax.escapeHtml(entryTitle) + '</span>' +
            '<span class="extension-version">v' + Syntax.escapeHtml(entry.version) + '</span>' +
          '</div>' +
          '<div class="extension-meta">' +
            '<span class="extension-install-date">' + formatUpdateTimestamp(entry.time) + '</span>' +
          '</div>' +
          '<div class="extension-desc">' + (isArabic ? 'تفاصيل هذا الإصدار:' : 'Release details:') + '</div>' +
          '<ul class="extension-warning-list" style="margin-left:0;padding-left:18px">' +
            (Array.isArray(details) ? details : [details]).map(function(item) {
              return '<li>' + Syntax.escapeHtml(item) + '</li>';
            }).join('') +
          '</ul>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';
  }

  showModal(t('updateLog'),
    html +
    '<div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">' +
      '<button class="btn btn-secondary" onclick="markUpdateLogAsRead()">' + t('markAsRead') + '</button>' +
      '<button class="btn btn-secondary" onclick="openUpdateLog()">' + t('viewHistory') + '</button>' +
    '</div>',
  false);
}

function syncUpdateLogState() {
  ensureUpdateLog();
  if (State.lastSeenVersion !== APP_VERSION) {
    State.lastSeenVersion = APP_VERSION;
    Storage.saveSettings();
    setTimeout(function() {
      showToast(State.language === 'ar'
        ? 'يوجد إصدار جديد: ' + APP_VERSION
        : 'New version available: ' + APP_VERSION, 'info');
    }, 500);
  }
}

// ============================================================
// ===== PRODUCTION EXTENSION SYSTEM =====
// ============================================================


// ============================================================

// Valid permissions that extensions can request
const VALID_PERMISSIONS = [
  'file:read', 'file:write', 'file:delete',
  'editor:read', 'editor:write',
  'ui:toast', 'ui:modal', 'ui:statusbar', 'ui:toolbar', 'ui:sidebar', 'ui:contextmenu', 'ui:style',
  'clipboard', 'storage', 'commands', 'themes', 'shortcuts', 'events', 'localization', 'workspace'
];

// App version for compatibility checking
const APP_VERSION = '2.4.0';

const APP_CHANGELOG = [
{
  version: '2.4.0',
  time: '2026-07-08T14:54:59Z',
  title: {
    en: 'JOCE IDE 2.4.0 — Consent, developer center and project platform upgrade',
    ar: 'JOCE IDE 2.4.0 — الموافقة وغرفة المطور وتطوير المنصة'
  },
  items: {
    en: [
      'Added a first-run consent gate with explicit Terms of Use and Privacy Policy acceptance before startup.',
      'Expanded the safe local Developer Center and documented its permissions and local-only scope.',
      'Improved background scope controls, settings organization, and project management workflows.',
      'Added more local-only protection around developer features and release history.',
      'Refined startup boot flow and version-aware update log handling.'
    ],
    ar: [
      'إضافة شاشة موافقة أول مرة مع شروط الاستخدام وسياسة الخصوصية قبل التشغيل.',
      'توسيع غرفة المطور المحلية الآمنة مع توثيق الصلاحيات والنطاق المحلي فقط.',
      'تحسين نطاقات الخلفية وتنظيم الإعدادات وتدفقات إدارة المشاريع.',
      'تعزيز حماية ميزات المطور وسجل الإصدارات المحلي.',
      'تحسين آلية التشغيل الأولى وسجل التحديثات المرتبط بالإصدار.'
    ]
  }
},
  {
    version: '2.3.0',
    time: '2026-07-08T10:28:36Z',
    title: {
      en: 'JOCE IDE 2.3.0 — Update log and stability release',
      ar: 'JOCE IDE 2.3.0 — إصدار سجل التحديثات وتحسين الثبات'
    },
    items: {
      en: [
        'Added a real update log system inside Settings with version history, timestamps, and detailed notes.',
        'Upgraded app version display to 2.3.0 and persisted the last seen version locally.',
        'Improved the background workflow so custom background settings are preserved and re-applied reliably.',
        'Polished the settings experience and made update information easier to review anytime.',
        'Added better localization hooks for update-related UI text and command palette helpers.'
      ],
      ar: [
        'إضافة نظام سجل تحديثات حقيقي داخل الإعدادات مع تاريخ الإصدارات والتوقيت والتفاصيل.',
        'تحديث رقم الإصدار إلى 2.3.0 مع حفظ آخر إصدار تمت مراجعته محليًا.',
        'تحسين مسار الخلفيات بحيث يتم حفظها وإعادة تطبيقها بشكل أكثر ثباتًا.',
        'تحسين واجهة الإعدادات لتصبح مراجعة التحديثات أسهل في أي وقت.',
        'إضافة مفاتيح ترجمة أفضل للنصوص المرتبطة بالتحديثات والاختصارات.'
      ]
    }
  },
  {
    version: '2.2.0',
    time: '2026-07-06T21:09:28Z',
    title: {
      en: 'JOCE IDE 2.2.0 — Extensions, localization, and workspace polish',
      ar: 'JOCE IDE 2.2.0 — الإضافات واللغة وتحسينات مساحة العمل'
    },
    items: {
      en: [
        'Improved extension compatibility and contribution handling.',
        'Expanded localization support for Arabic and English workflows.',
        'Refined project import, folder import, and file organization behavior.',
        'Improved quick search, command palette, and editor responsiveness.'
      ],
      ar: [
        'تحسين توافق الإضافات وطريقة تسجيل المساهمات.',
        'توسيع دعم الترجمة للعربية والإنجليزية.',
        'تحسين استيراد المشاريع والمجلدات وتنظيم الملفات.',
        'تحسين البحث السريع ولوحة الأوامر واستجابة المحرر.'
      ]
    }
  },
  {
    version: '2.1.0',
    time: '2026-07-05T10:16:14Z',
    title: {
      en: 'JOCE IDE 2.1.0 — Foundation release',
      ar: 'JOCE IDE 2.1.0 — الإصدار الأساسي'
    },
    items: {
      en: [
        'Initial offline-first editor foundation.',
        'Core extensions system bootstrap.',
        'Background customization and workspace persistence.',
        'Search, preview, and tab workflow improvements.'
      ],
      ar: [
        'الأساس الأول للمحرر بنمط العمل بدون إنترنت.',
        'الانطلاقة الأولى لنظام الإضافات.',
        'تخصيص الخلفية وحفظ مساحة العمل.',
        'تحسينات البحث والمعاينة والتبويبات.'
      ]
    }
  }
];

// --- Extension Logger ---
const ExtensionLogger = {
  logs: {},
  
  init(extId) {
    if (!this.logs[extId]) this.logs[extId] = [];
  },
  
  log(extId, level, message) {
    if (!this.logs[extId]) this.logs[extId] = [];
    const entry = {
      time: new Date().toISOString(),
      level: level,
      message: typeof message === 'string' ? message : JSON.stringify(message)
    };
    this.logs[extId].push(entry);
    if (this.logs[extId].length > 200) this.logs[extId].shift();
    
    const prefix = '[Ext:' + extId + ']';
    if (level === 'error') {
      console.error(prefix, message);
    } else if (level === 'warn') {
      console.warn(prefix, message);
    } else {
      console.log(prefix, message);
    }
  },
  
  info(extId, msg) { this.log(extId, 'info', msg); },
  warn(extId, msg) { this.log(extId, 'warn', msg); },
  error(extId, msg) { this.log(extId, 'error', msg); },
  success(extId, msg) { this.log(extId, 'success', msg); },
  
  getLogs(extId) {
    return this.logs[extId] || [];
  },
  
  clear(extId) {
    this.logs[extId] = [];
  }
};

// --- Extension Validator ---
const ExtensionValidator = {
  validate(manifest) {
    const errors = [];
    const warnings = [];
    
    // Check required fields
    if (!manifest || typeof manifest !== 'object') {
      errors.push('Manifest must be a valid object');
      return { valid: false, errors, warnings };
    }
    
    if (!manifest.id) {
      errors.push('Missing required field: id');
    } else if (typeof manifest.id !== 'string') {
      errors.push('Field "id" must be a string');
    } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(manifest.id)) {
      errors.push('Invalid extension ID: must be lowercase alphanumeric with hyphens, cannot start or end with hyphen');
    } else if (manifest.id.length > 100) {
      errors.push('Extension ID is too long (max 100 characters)');
    }
    
    if (!manifest.name) {
      errors.push('Missing required field: name');
    } else if (typeof manifest.name !== 'string') {
      errors.push('Field "name" must be a string');
    } else if (manifest.name.length > 200) {
      errors.push('Extension name is too long (max 200 characters)');
    }
    
    if (!manifest.version) {
      errors.push('Missing required field: version');
    } else if (typeof manifest.version !== 'string') {
      errors.push('Field "version" must be a string');
    } else if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(manifest.version)) {
      errors.push('Invalid version format: must follow semver (e.g. 1.0.0)');
    }
    
    if (manifest.description && typeof manifest.description !== 'string') {
      errors.push('Field "description" must be a string');
    }
    if (manifest.description && manifest.description.length > 1000) {
      warnings.push('Description is very long (over 1000 characters)');
    }
    
    if (manifest.author && typeof manifest.author !== 'string') {
      errors.push('Field "author" must be a string');
    }
    
    // Validate permissions
    if (manifest.permissions !== undefined) {
      if (!Array.isArray(manifest.permissions)) {
        errors.push('Field "permissions" must be an array');
      } else {
        manifest.permissions.forEach(function(p) {
          if (typeof p !== 'string') {
            errors.push('Each permission must be a string');
          } else if (!VALID_PERMISSIONS.includes(p)) {
            warnings.push('Unknown permission: "' + p + '" (valid: ' + VALID_PERMISSIONS.join(', ') + ')');
          }
        });
      }
    }
    
    // Validate dependencies
    if (manifest.dependencies !== undefined) {
      if (!Array.isArray(manifest.dependencies)) {
        errors.push('Field "dependencies" must be an array');
      } else {
        manifest.dependencies.forEach(function(d) {
          if (typeof d !== 'string') {
            errors.push('Each dependency must be a string (extension ID)');
          }
        });
      }
    }
    
    // Validate minAppVersion
    if (manifest.minAppVersion !== undefined) {
      if (typeof manifest.minAppVersion !== 'string') {
        errors.push('Field "minAppVersion" must be a string');
      } else if (!/^\d+\.\d+\.\d+/.test(manifest.minAppVersion)) {
        errors.push('Invalid minAppVersion format: must follow semver');
      } else {
        if (!ExtensionValidator.checkVersionCompatibility(manifest.minAppVersion, APP_VERSION)) {
          errors.push('Extension requires app version >= ' + manifest.minAppVersion + ' but current is ' + APP_VERSION);
        }
      }
    }
    
    // Validate contributes
    if (manifest.contributes !== undefined) {
      if (typeof manifest.contributes !== 'object' || manifest.contributes === null) {
        errors.push('Field "contributes" must be an object');
      } else {
        const c = manifest.contributes;
        
        if (c.commands !== undefined) {
          if (!Array.isArray(c.commands)) {
            errors.push('contributes.commands must be an array');
          } else {
            c.commands.forEach(function(cmd, i) {
              if (!cmd.id) errors.push('Command at index ' + i + ' missing "id"');
              if (!cmd.title) errors.push('Command at index ' + i + ' missing "title"');
            });
          }
        }
        
        if (c.menus !== undefined) {
          if (typeof c.menus !== 'object' || c.menus === null) {
            errors.push('contributes.menus must be an object');
          } else {
            if (c.menus.context !== undefined) {
              if (!Array.isArray(c.menus.context)) {
                errors.push('contributes.menus.context must be an array');
              } else {
                c.menus.context.forEach(function(m, i) {
                  if (!m.command) errors.push('Context menu item at index ' + i + ' missing "command"');
                  if (!m.title) errors.push('Context menu item at index ' + i + ' missing "title"');
                });
              }
            }
            if (c.menus.toolbar !== undefined) {
              if (!Array.isArray(c.menus.toolbar)) {
                errors.push('contributes.menus.toolbar must be an array');
              } else {
                c.menus.toolbar.forEach(function(m, i) {
                  if (!m.command) errors.push('Toolbar item at index ' + i + ' missing "command"');
                  if (!m.title) errors.push('Toolbar item at index ' + i + ' missing "title"');
                });
              }
            }
          }
        }
        
        if (c.themes !== undefined) {
          if (!Array.isArray(c.themes)) {
            errors.push('contributes.themes must be an array');
          } else {
            c.themes.forEach(function(t, i) {
              if (!t.id) errors.push('Theme at index ' + i + ' missing "id"');
              if (!t.name) errors.push('Theme at index ' + i + ' missing "name"');
              if (!t.css) errors.push('Theme at index ' + i + ' missing "css"');
            });
          }
        }
        
        if (c.statusbar !== undefined) {
          if (!Array.isArray(c.statusbar)) {
            errors.push('contributes.statusbar must be an array');
          } else {
            c.statusbar.forEach(function(s, i) {
              if (!s.id) errors.push('Status bar item at index ' + i + ' missing "id"');
              if (!s.text) errors.push('Status bar item at index ' + i + ' missing "text"');
            });
          }
        }
        
        if (c.sidebar !== undefined) {
          if (!Array.isArray(c.sidebar)) {
            errors.push('contributes.sidebar must be an array');
          } else {
            c.sidebar.forEach(function(s, i) {
              if (!s.id) errors.push('Sidebar panel at index ' + i + ' missing "id"');
              if (!s.title) errors.push('Sidebar panel at index ' + i + ' missing "title"');
            });
          }
        }
        
        if (c.keybindings !== undefined) {
          if (!Array.isArray(c.keybindings)) {
            errors.push('contributes.keybindings must be an array');
          } else {
            c.keybindings.forEach(function(k, i) {
              if (!k.command) errors.push('Keybinding at index ' + i + ' missing "command"');
              if (!k.key) errors.push('Keybinding at index ' + i + ' missing "key"');
            });
          }
        }
      }
    }
    
    // Validate settings schema
    if (manifest.settings !== undefined) {
      if (!Array.isArray(manifest.settings)) {
        errors.push('Field "settings" must be an array');
      } else {
        manifest.settings.forEach(function(s, i) {
          if (!s.id) errors.push('Setting at index ' + i + ' missing "id"');
          if (!s.label) errors.push('Setting at index ' + i + ' missing "label"');
          if (!s.type) errors.push('Setting at index ' + i + ' missing "type"');
          if (!['string', 'number', 'boolean', 'select', 'color'].includes(s.type)) {
            errors.push('Setting at index ' + i + ' has invalid type (must be: string, number, boolean, select, color)');
          }
        });
      }
    }
    
    // Validate code
    if (manifest.code !== undefined) {
      if (typeof manifest.code !== 'string') {
        errors.push('Field "code" must be a string');
      } else if (manifest.code.length > 500000) {
        errors.push('Extension code is too large (max 500KB)');
      }
    }
    
    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  },
  
  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(function(n) { return parseInt(n) || 0; });
    const parts2 = v2.split('.').map(function(n) { return parseInt(n) || 0; });
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const a = parts1[i] || 0;
      const b = parts2[i] || 0;
      if (a > b) return 1;
      if (a < b) return -1;
    }
    return 0;
  },
  
  checkVersionCompatibility(required, current) {
    return this.compareVersions(current, required) >= 0;
  }
};

// --- Extension Sandbox ---
const ExtensionSandbox = {
  execute(code, api, extId) {
    try {
      const fn = new Function('JOCE', 'console', code);
      const sandboxedConsole = {
        log: function() { ExtensionLogger.info(extId, Array.from(arguments).join(' ')); },
        warn: function() { ExtensionLogger.warn(extId, Array.from(arguments).join(' ')); },
        error: function() { ExtensionLogger.error(extId, Array.from(arguments).join(' ')); },
        info: function() { ExtensionLogger.info(extId, Array.from(arguments).join(' ')); }
      };
      fn.call({}, api, sandboxedConsole);
      return { success: true };
    } catch(e) {
      ExtensionLogger.error(extId, 'Execution error: ' + e.message);
      return { success: false, error: e.message };
    }
  },
  
  safeCall(fn, extId, context, fallback) {
    try {
      if (typeof fn === 'function') {
        return fn(context);
      }
      return fallback;
    } catch(e) {
      ExtensionLogger.error(extId, 'Callback error: ' + e.message);
      console.error('[Extension:' + extId + '] Callback error:', e);
      return fallback;
    }
  },
  
  safeCallNoArgs(fn, extId) {
    try {
      if (typeof fn === 'function') {
        fn();
        return true;
      }
      return false;
    } catch(e) {
      ExtensionLogger.error(extId, 'Callback error: ' + e.message);
      console.error('[Extension:' + extId + '] Callback error:', e);
      return false;
    }
  }
};

// --- Extension Storage (per-extension isolated storage) ---
const ExtensionStorage = {
  get(extId, key, defaultValue) {
    const data = Storage.get('extstorage_' + extId, {});
    if (key === undefined) return data;
    return data[key] !== undefined ? data[key] : (defaultValue !== undefined ? defaultValue : null);
  },
  
  set(extId, key, value) {
    const data = Storage.get('extstorage_' + extId, {});
    data[key] = value;
    Storage.set('extstorage_' + extId, data);
  },
  
  remove(extId, key) {
    const data = Storage.get('extstorage_' + extId, {});
    delete data[key];
    Storage.set('extstorage_' + extId, data);
  },
  
  clear(extId) {
    Storage.remove('extstorage_' + extId);
  }
};

// --- Extension Settings Manager ---
const ExtensionSettings = {
  get(extId) {
    return Storage.get('extsettings_' + extId, {});
  },
  
  set(extId, settings) {
    Storage.set('extsettings_' + extId, settings);
  },
  
  getValue(extId, key, defaultValue) {
    const settings = this.get(extId);
    return settings[key] !== undefined ? settings[key] : defaultValue;
  },
  
  setValue(extId, key, value) {
    const settings = this.get(extId);
    settings[key] = value;
    this.set(extId, settings);
  },
  
  clear(extId) {
    Storage.remove('extsettings_' + extId);
  }
};

// --- Contribution Manager ---
const ContributionManager = {
  // All contributions are tracked per extension for cleanup
  contributions: {
    commands: new Map(),       // commandId -> { id, title, handler, extensionId, icon, shortcut }
    contextMenus: [],          // { command, title, group, extensionId, when }
    toolbar: [],               // { command, title, icon, extensionId, group }
    statusbar: [],             // { id, text, icon, tooltip, extensionId, onClick }
    sidebar: [],               // { id, title, icon, extensionId, render }
    themes: [],                // { id, name, css, extensionId }
    keybindings: [],           // { command, key, extensionId }
    eventSubscriptions: new Map() // extId -> array of { event, callback }
  },
  
  registerCommand(extId, cmd) {
    const fullId = cmd.id.includes('.') ? cmd.id : extId + '.' + cmd.id;
    this.contributions.commands.set(fullId, {
      id: fullId,
      shortId: cmd.id,
      title: cmd.title || cmd.id,
      handler: cmd.handler || (function() {}),
      extensionId: extId,
      icon: cmd.icon || null,
      shortcut: cmd.shortcut || null,
      category: cmd.category || 'Extension'
    });
    return fullId;
  },
  
  registerContextMenu(extId, item) {
    this.contributions.contextMenus.push({
      command: item.command,
      title: item.title,
      group: item.group || 'extensions',
      extensionId: extId,
      when: item.when || null,
      icon: item.icon || null
    });
  },
  
  registerToolbar(extId, item) {
    this.contributions.toolbar.push({
      command: item.command,
      title: item.title,
      icon: item.icon || null,
      extensionId: extId,
      group: item.group || 'extensions'
    });
  },
  
  registerStatusbar(extId, item) {
    this.contributions.statusbar.push({
      id: item.id,
      text: item.text || '',
      icon: item.icon || null,
      tooltip: item.tooltip || '',
      extensionId: extId,
      onClick: item.onClick || null,
      render: item.render || null
    });
  },
  
  registerSidebar(extId, item) {
    this.contributions.sidebar.push({
      id: item.id,
      title: item.title,
      icon: item.icon || null,
      extensionId: extId,
      render: item.render || (function() { return ''; })
    });
  },
  
  registerTheme(extId, theme) {
    this.contributions.themes.push({
      id: theme.id,
      name: theme.name,
      css: theme.css,
      extensionId: extId
    });
  },
  
  registerKeybinding(extId, binding) {
    this.contributions.keybindings.push({
      command: binding.command,
      key: binding.key,
      extensionId: extId
    });
  },
  
  registerEventSubscription(extId, event, callback) {
    if (!this.contributions.eventSubscriptions.has(extId)) {
      this.contributions.eventSubscriptions.set(extId, []);
    }
    this.contributions.eventSubscriptions.get(extId).push({ event: event, callback: callback });
  },
  
  removeExtensionContributions(extId) {
    // Remove commands
    const cmdsToRemove = [];
    this.contributions.commands.forEach(function(cmd, id) {
      if (cmd.extensionId === extId) cmdsToRemove.push(id);
    });
    cmdsToRemove.forEach(function(id) { ContributionManager.contributions.commands.delete(id); });
    
    // Remove arrays
    this.contributions.contextMenus = this.contributions.contextMenus.filter(function(m) { return m.extensionId !== extId; });
    this.contributions.toolbar = this.contributions.toolbar.filter(function(t) { return t.extensionId !== extId; });
    this.contributions.statusbar = this.contributions.statusbar.filter(function(s) { return s.extensionId !== extId; });
    this.contributions.sidebar = this.contributions.sidebar.filter(function(s) { return s.extensionId !== extId; });
    this.contributions.themes = this.contributions.themes.filter(function(t) { return t.extensionId !== extId; });
    this.contributions.keybindings = this.contributions.keybindings.filter(function(k) { return k.extensionId !== extId; });
    this.contributions.eventSubscriptions.delete(extId);
  },
  
  getAllCommands() {
    const result = [];
    this.contributions.commands.forEach(function(cmd) { result.push(cmd); });
    return result;
  },
  
  getCommand(id) {
    return this.contributions.commands.get(id) || null;
  },
  
  executeCommand(id, args) {
    const cmd = this.contributions.commands.get(id);
    if (!cmd) {
      console.warn('Command not found:', id);
      return false;
    }
    return ExtensionSandbox.safeCall(cmd.handler, cmd.extensionId, args, false);
  },
  
  getContextMenusForType(type) {
    return this.contributions.contextMenus.filter(function(m) {
      if (!m.when) return true;
      if (m.when === type) return true;
      if (Array.isArray(m.when) && m.when.includes(type)) return true;
      return false;
    });
  },
  
  triggerEvent(event, data) {
    this.contributions.eventSubscriptions.forEach(function(subs) {
      subs.forEach(function(sub) {
        if (sub.event === event) {
          ExtensionSandbox.safeCall(sub.callback, sub.extId, data, null);
        }
      });
    });
  }
};

// --- Main Extension Registry ---
const ExtensionRegistry = {
  extensions: new Map(),  // extId -> full extension object
  errors: new Map(),      // extId -> last error message
  
  install(manifest, code) {
    // Validate
    const validation = ExtensionValidator.validate(manifest);
    if (!validation.valid) {
      return { success: false, errors: validation.errors, warnings: validation.warnings };
    }
    
    // Check for duplicate ID
    if (this.extensions.has(manifest.id)) {
      return { success: false, errors: ['Extension with ID "' + manifest.id + '" is already installed'], warnings: [] };
    }
    
    // Check dependencies
    if (manifest.dependencies && manifest.dependencies.length > 0) {
      const missing = manifest.dependencies.filter(function(dep) {
        return !ExtensionRegistry.extensions.has(dep);
      });
      if (missing.length > 0) {
        return { success: false, errors: ['Missing dependencies: ' + missing.join(', ')], warnings: [] };
      }
    }
    
    // Create extension object
    const extId = manifest.id;
    ExtensionLogger.init(extId);
    ExtensionLogger.info(extId, 'Installing extension v' + manifest.version);
    
    const ext = {
      id: extId,
      name: manifest.name,
      version: manifest.version,
      description: manifest.description || '',
      author: manifest.author || 'Unknown',
      permissions: manifest.permissions || [],
      dependencies: manifest.dependencies || [],
      minAppVersion: manifest.minAppVersion || null,
      contributes: manifest.contributes || {},
      settingsSchema: manifest.settings || [],
      code: code || manifest.code || null,
      enabled: true,
      active: false,
      installedAt: Date.now(),
      error: null,
      instance: null,
      cleanup: []
    };
    
    this.extensions.set(extId, ext);
    
    // Register in State for persistence
    State.extensions.push({
      id: ext.id,
      name: ext.name,
      version: ext.version,
      description: ext.description,
      author: ext.author,
      permissions: ext.permissions,
      enabled: true,
      installedAt: ext.installedAt
    });
    Storage.saveSettings();
    
    ExtensionLogger.success(extId, 'Extension installed successfully');
    
    // Activate immediately
    const activated = this.activate(extId);
    if (!activated) {
      return { success: true, warnings: validation.warnings, activated: false };
    }
    
    return { success: true, warnings: validation.warnings, activated: true };
  },
  
  activate(extId) {
    const ext = this.extensions.get(extId);
    if (!ext) {
      console.warn('Cannot activate unknown extension:', extId);
      return false;
    }
    
    if (ext.active) {
      ExtensionLogger.warn(extId, 'Extension is already active');
      return true;
    }
    
    try {
      ExtensionLogger.info(extId, 'Activating extension...');
      
      // Create API context for this extension
      const api = ExtensionAPI.createContext(extId);
      
      // Register static contributions from manifest
      if (ext.contributes.commands) {
        ext.contributes.commands.forEach(function(cmd) {
          const fullId = ContributionManager.registerCommand(extId, cmd);
          ExtensionLogger.info(extId, 'Registered command: ' + fullId);
        });
      }
      
      if (ext.contributes.menus) {
        if (ext.contributes.menus.context) {
          ext.contributes.menus.context.forEach(function(m) {
            ContributionManager.registerContextMenu(extId, m);
          });
        }
        if (ext.contributes.menus.toolbar) {
          ext.contributes.menus.toolbar.forEach(function(m) {
            ContributionManager.registerToolbar(extId, m);
          });
        }
      }
      
      if (ext.contributes.statusbar) {
        ext.contributes.statusbar.forEach(function(s) {
          ContributionManager.registerStatusbar(extId, s);
        });
      }
      
      if (ext.contributes.sidebar) {
        ext.contributes.sidebar.forEach(function(s) {
          ContributionManager.registerSidebar(extId, s);
        });
      }
      
      if (ext.contributes.themes) {
        ext.contributes.themes.forEach(function(t) {
          ContributionManager.registerTheme(extId, t);
        });
      }
      
      if (ext.contributes.keybindings) {
        ext.contributes.keybindings.forEach(function(k) {
          ContributionManager.registerKeybinding(extId, k);
        });
      }
      
      // Execute extension code if present
      if (ext.code) {
        const result = ExtensionSandbox.execute(ext.code, api, extId);
        if (!result.success) {
          throw new Error(result.error);
        }
      }
      
      // Call activate if the extension registered one
      if (ext.instance && typeof ext.instance.activate === 'function') {
        ExtensionSandbox.safeCall(ext.instance.activate, extId, api, null);
      }
      
      ext.active = true;
      ext.error = null;
      this.errors.delete(extId);
      
      // Update state
      const stateExt = State.extensions.find(function(e) { return e.id === extId; });
      if (stateExt) stateExt.enabled = true;
      Storage.saveSettings();
      
      ExtensionLogger.success(extId, 'Extension activated successfully');
      
      // Refresh UI to show contributions
      UI.renderExtensionContributions();
      
      showToast('Extension "' + ext.name + '" activated', 'success');
      return true;
    } catch(e) {
      ext.active = false;
      ext.error = e.message;
      this.errors.set(extId, e.message);
      ExtensionLogger.error(extId, 'Activation failed: ' + e.message);
      showToast('Failed to activate "' + ext.name + '": ' + e.message, 'error');
      return false;
    }
  },
  
  deactivate(extId) {
    const ext = this.extensions.get(extId);
    if (!ext || !ext.active) return false;
    
    ExtensionLogger.info(extId, 'Deactivating extension...');
    
    // Call deactivate callback
    if (ext.instance && typeof ext.instance.deactivate === 'function') {
      ExtensionSandbox.safeCallNoArgs(ext.instance.deactivate, extId);
    }
    
    // Run cleanup functions
    ext.cleanup.forEach(function(fn) {
      ExtensionSandbox.safeCallNoArgs(fn, extId);
    });
    ext.cleanup = [];
    
    // Remove all contributions
    ContributionManager.removeExtensionContributions(extId);
    
    ext.active = false;
    
    // Update state
    const stateExt = State.extensions.find(function(e) { return e.id === extId; });
    if (stateExt) stateExt.enabled = false;
    Storage.saveSettings();
    
    ExtensionLogger.info(extId, 'Extension deactivated');
    
    // Refresh UI
    UI.renderExtensionContributions();
    
    return true;
  },
  
  enable(extId) {
    const ext = this.extensions.get(extId);
    if (!ext) return false;
    if (ext.active) return true;
    return this.activate(extId);
  },
  
  disable(extId) {
    return this.deactivate(extId);
  },
  
  uninstall(extId) {
    const ext = this.extensions.get(extId);
    if (!ext) return false;
    
    ExtensionLogger.info(extId, 'Uninstalling extension...');
    
    // Deactivate first
    if (ext.active) {
      this.deactivate(extId);
    }
    
    // Clear storage and settings
    ExtensionStorage.clear(extId);
    ExtensionSettings.clear(extId);
    
    // Remove from registry
    this.extensions.delete(extId);
    this.errors.delete(extId);
    
    // Remove from state
    State.extensions = State.extensions.filter(function(e) { return e.id !== extId; });
    Storage.saveSettings();
    
    ExtensionLogger.info(extId, 'Extension uninstalled');
    
    // Clear logs
    ExtensionLogger.clear(extId);
    
    // Refresh UI
    UI.renderExtensionContributions();
    
    showToast('Extension "' + ext.name + '" removed', 'info');
    return true;
  },
  
  get(extId) {
    return this.extensions.get(extId) || null;
  },
  
  getAll() {
    const result = [];
    this.extensions.forEach(function(ext) { result.push(ext); });
    return result;
  },
  
  isError(extId) {
    return this.errors.has(extId);
  },
  
  getError(extId) {
    return this.errors.get(extId) || null;
  }
};

// --- Extension API (public interface for extensions) ---
const ExtensionAPI = {
  createContext(extId) {
    const ext = ExtensionRegistry.get(extId);
    
    const api = {
      // --- Extension info ---
      id: extId,
      name: ext ? ext.name : extId,
      version: ext ? ext.version : '1.0.0',
      
      // --- Register extension instance ---
      register: function(instance) {
        const e = ExtensionRegistry.get(extId);
        if (e) e.instance = instance;
      },
      
      // --- File operations ---
      files: {
        getAll: function() {
          if (!ExtensionAPI.hasPermission(extId, 'file:read')) {
            ExtensionLogger.warn(extId, 'Permission denied: file:read');
            return {};
          }
          const result = {};
          Object.keys(State.files).forEach(function(k) {
            result[k] = { content: State.files[k].content, modified: State.files[k].modified };
          });
          return result;
        },
        get: function(path) {
          if (!ExtensionAPI.hasPermission(extId, 'file:read')) {
            ExtensionLogger.warn(extId, 'Permission denied: file:read');
            return null;
          }
          return State.files[path] ? { content: State.files[path].content, modified: State.files[path].modified } : null;
        },
        create: function(path, content) {
          if (!ExtensionAPI.hasPermission(extId, 'file:write')) {
            ExtensionLogger.warn(extId, 'Permission denied: file:write');
            return false;
          }
          FS.createFile(path, content || '');
          UI.renderFileTree();
          ExtensionLogger.info(extId, 'Created file: ' + path);
          return true;
        },
        delete: function(path) {
          if (!ExtensionAPI.hasPermission(extId, 'file:delete')) {
            ExtensionLogger.warn(extId, 'Permission denied: file:delete');
            return false;
          }
          FS.deleteItem(path);
          UI.renderFileTree();
          ExtensionLogger.info(extId, 'Deleted file: ' + path);
          return true;
        },
        open: function(path) {
          if (State.files[path]) {
            openFile(path);
            return true;
          }
          return false;
        },
        getActive: function() { return State.activeTab; },
        saveActive: function() {
          if (State.activeTab) { saveCurrentFile(); return true; }
          return false;
        }
      },
      
      // --- Editor operations ---
      editor: {
        getContent: function() {
          if (!ExtensionAPI.hasPermission(extId, 'editor:read')) {
            ExtensionLogger.warn(extId, 'Permission denied: editor:read');
            return '';
          }
          return document.getElementById('codeTextarea').value;
        },
        setContent: function(content) {
          if (!ExtensionAPI.hasPermission(extId, 'editor:write')) {
            ExtensionLogger.warn(extId, 'Permission denied: editor:write');
            return false;
          }
          const ta = document.getElementById('codeTextarea');
          ta.value = content;
          ta.dispatchEvent(new Event('input'));
          return true;
        },
        insertText: function(text) {
          if (!ExtensionAPI.hasPermission(extId, 'editor:write')) {
            ExtensionLogger.warn(extId, 'Permission denied: editor:write');
            return false;
          }
          const ta = document.getElementById('codeTextarea');
          const start = ta.selectionStart;
          ta.value = ta.value.slice(0, start) + text + ta.value.slice(ta.selectionEnd);
          ta.selectionStart = ta.selectionEnd = start + text.length;
          ta.dispatchEvent(new Event('input'));
          return true;
        },
        getSelection: function() {
          const ta = document.getElementById('codeTextarea');
          return {
            start: ta.selectionStart,
            end: ta.selectionEnd,
            text: ta.value.substring(ta.selectionStart, ta.selectionEnd)
          };
        },
        getCursor: function() {
          const ta = document.getElementById('codeTextarea');
          const pos = ta.selectionStart;
          const text = ta.value.substring(0, pos);
          const line = text.split('\n').length;
          const col = pos - text.lastIndexOf('\n');
          return { line: line, column: col };
        }
      },
      
      // --- UI operations ---
      ui: {
        showToast: function(msg, type) {
          if (!ExtensionAPI.hasPermission(extId, 'ui:toast')) {
            ExtensionLogger.warn(extId, 'Permission denied: ui:toast');
            return;
          }
          showToast(msg, type || 'info');
        },
        showModal: function(title, bodyHTML, onConfirm) {
          if (!ExtensionAPI.hasPermission(extId, 'ui:modal')) {
            ExtensionLogger.warn(extId, 'Permission denied: ui:modal');
            return;
          }
          showModal(title, bodyHTML, !!onConfirm, onConfirm);
        },
        addStatusbarItem: function(item) {
          if (!ExtensionAPI.hasPermission(extId, 'ui:statusbar')) {
            ExtensionLogger.warn(extId, 'Permission denied: ui:statusbar');
            return;
          }
          ContributionManager.registerStatusbar(extId, item);
          UI.renderExtensionContributions();
        },
        addToolbarItem: function(item) {
          if (!ExtensionAPI.hasPermission(extId, 'ui:toolbar')) {
            ExtensionLogger.warn(extId, 'Permission denied: ui:toolbar');
            return;
          }
          ContributionManager.registerToolbar(extId, item);
          UI.renderExtensionContributions();
        },
        addContextMenuItem: function(item) {
          if (!ExtensionAPI.hasPermission(extId, 'ui:contextmenu')) {
            ExtensionLogger.warn(extId, 'Permission denied: ui:contextmenu');
            return;
          }
          ContributionManager.registerContextMenu(extId, item);
        },
        addSidebarPanel: function(item) {
          if (!ExtensionAPI.hasPermission(extId, 'ui:sidebar')) {
            ExtensionLogger.warn(extId, 'Permission denied: ui:sidebar');
            return;
          }
          ContributionManager.registerSidebar(extId, item);
          UI.renderExtensionContributions();
        }
      },
      
      // --- Command registration ---
      commands: {
        register: function(id, title, handler, options) {
          if (!ExtensionAPI.hasPermission(extId, 'commands')) {
            ExtensionLogger.warn(extId, 'Permission denied: commands');
            return null;
          }
          options = options || {};
          const cmd = {
            id: id,
            title: title,
            handler: handler,
            icon: options.icon || null,
            shortcut: options.shortcut || null,
            category: options.category || 'Extension'
          };
          const fullId = ContributionManager.registerCommand(extId, cmd);
          ExtensionLogger.info(extId, 'Registered command: ' + fullId);
          return fullId;
        },
        execute: function(id, args) {
          return ContributionManager.executeCommand(id, args);
        },
        getAll: function() {
          return ContributionManager.getAllCommands().filter(function(c) {
            return c.extensionId === extId;
          });
        }
      },
      
      // --- Theme registration ---
      themes: {
        register: function(theme) {
          if (!ExtensionAPI.hasPermission(extId, 'themes')) {
            ExtensionLogger.warn(extId, 'Permission denied: themes');
            return;
          }
          ContributionManager.registerTheme(extId, theme);
        },
        apply: function(themeId) {
          const theme = ContributionManager.contributions.themes.find(function(t) { return t.id === themeId; });
          if (theme) {
            let styleEl = document.getElementById('ext-theme-' + themeId);
            if (!styleEl) {
              styleEl = document.createElement('style');
              styleEl.id = 'ext-theme-' + themeId;
              document.head.appendChild(styleEl);
            }
            styleEl.textContent = theme.css;
            ExtensionLogger.info(extId, 'Applied theme: ' + themeId);
          }
        }
      },
      
      // --- Keyboard shortcuts ---
      shortcuts: {
        register: function(key, command) {
          if (!ExtensionAPI.hasPermission(extId, 'shortcuts')) {
            ExtensionLogger.warn(extId, 'Permission denied: shortcuts');
            return;
          }
          ContributionManager.registerKeybinding(extId, { key: key, command: command });
          ExtensionLogger.info(extId, 'Registered shortcut: ' + key + ' -> ' + command);
        }
      },
      
      // --- Event subscriptions ---
      events: {
        on: function(event, callback) {
          if (!ExtensionAPI.hasPermission(extId, 'events')) {
            ExtensionLogger.warn(extId, 'Permission denied: events');
            return;
          }
          ContributionManager.registerEventSubscription(extId, event, callback);
          ExtensionLogger.info(extId, 'Subscribed to event: ' + event);
        },
        emit: function(event, data) {
          ContributionManager.triggerEvent(event, data);
        }
      },
      
      // --- Storage (per-extension isolated) ---
      storage: {
        get: function(key, defaultValue) {
          return ExtensionStorage.get(extId, key, defaultValue);
        },
        set: function(key, value) {
          ExtensionStorage.set(extId, key, value);
        },
        remove: function(key) {
          ExtensionStorage.remove(extId, key);
        },
        clear: function() {
          ExtensionStorage.clear(extId);
        }
      },
      
      // --- Settings (persistent) ---
      settings: {
        get: function() {
          return ExtensionSettings.get(extId);
        },
        getSchema: function() {
          const e = ExtensionRegistry.get(extId);
          return e ? e.settingsSchema : [];
        },
        getValue: function(key, defaultValue) {
          return ExtensionSettings.getValue(extId, key, defaultValue);
        },
        setValue: function(key, value) {
          ExtensionSettings.setValue(extId, key, value);
        }
      },
      
      // --- Logging ---
      log: function(msg) { ExtensionLogger.info(extId, msg); },
      warn: function(msg) { ExtensionLogger.warn(extId, msg); },
      error: function(msg) { ExtensionLogger.error(extId, msg); },
      
      // --- Cleanup registration ---
      onCleanup: function(fn) {
        const e = ExtensionRegistry.get(extId);
        if (e && typeof fn === 'function') {
          e.cleanup.push(fn);
        }
      },
      
      // --- App info ---
      app: {
        version: APP_VERSION,
        theme: function() { return State.theme; }
      }
    };
    
    return api;
  },
  
  hasPermission(extId, permission) {
    const ext = ExtensionRegistry.get(extId);
    if (!ext) return false;
    // If no permissions specified, grant all (backward compat)
    if (!ext.permissions || ext.permissions.length === 0) return true;
    return ext.permissions.includes(permission);
  },
  
  triggerEvent(event, data) {
    ContributionManager.triggerEvent(event, data);
  }
};

// Expose to window for extensions
window.JOCE = ExtensionAPI;


const Localization = {
  packs: { en: {}, ar: {} },
  registerPack(extId, pack) {
    if (!pack || typeof pack !== 'object') return false;
    ['en', 'ar'].forEach(function(lang) {
      if (pack[lang] && typeof pack[lang] === 'object') {
        Localization.packs[lang] = Object.assign({}, Localization.packs[lang], pack[lang]);
      }
    });
    ExtensionLogger.info(extId, 'Registered localization pack');
    return true;
  },
  t(key, vars) {
    const lang = State.language === 'ar' ? 'ar' : 'en';
    const dict = Object.assign({}, I18N[lang] || {}, Localization.packs[lang] || {});
    let value = dict[key] || (I18N.en[key] || key);
    if (vars && typeof vars === 'object') {
      Object.keys(vars).forEach(function(k) {
        value = value.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
      });
    }
    return value;
  }
};

// ===== FILE SYSTEM OPERATIONS =====
const FS = {
  getExt(path) {
    const parts = path.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  },
  getLang(path) {
    const ext = this.getExt(path);
    const map = {html:'html',htm:'html',css:'css',js:'javascript',jsx:'javascript',ts:'typescript',tsx:'typescript',json:'json',md:'markdown',txt:'text',svg:'svg',xml:'xml',py:'python',php:'php',rb:'ruby',java:'java',c:'c',cpp:'cpp',cs:'csharp',go:'go',rs:'rust',swift:'swift',kt:'kotlin'};
    return map[ext] || 'text';
  },
  getFileName(path) {
    return path.split('/').pop();
  },
  getDir(path) {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/');
  },
  getFileIcon(path) {
    const ext = this.getExt(path);
    if (['html','htm'].includes(ext)) return 'fileHtml';
    if (ext === 'css') return 'fileCss';
    if (['js','jsx','ts','tsx'].includes(ext)) return 'fileJs';
    if (ext === 'json') return 'fileJson';
    if (['png','jpg','jpeg','gif','svg','webp','ico','bmp'].includes(ext)) return 'fileImage';
    if (ext === 'md') return 'fileMd';
    return 'file';
  },
  getFileColor(path) {
    const ext = this.getExt(path);
    const colors = {html:'#e44d26',htm:'#e44d26',css:'#264de4',js:'#f7df1e',jsx:'#61dafb',ts:'#3178c6',tsx:'#3178c6',json:'#6e7681',md:'#519aba',svg:'#ffb13b',
      png:'#a5d6ff',jpg:'#a5d6ff',jpeg:'#a5d6ff',gif:'#a5d6ff',webp:'#a5d6ff',py:'#3572a5',php:'#777bb4',rb:'#cc342d',java:'#b07219',go:'#00add8'};
    return colors[ext] || 'var(--text-tertiary)';
  },
  createFile(path, content) {
    content = content || '';
    const parts = path.split('/');
    for (let i = 1; i < parts.length; i++) {
      const dir = parts.slice(0,i).join('/');
      if (dir) State.folders.add(dir);
    }
    State.files[path] = {
      content: content,
      original: content,
      modified: false,
      created: Date.now(),
      lastSaved: Date.now()
    };
    ExtensionAPI.triggerEvent('file:create', { path: path, content: content });
    Storage.saveProject();
  },
  createFolder(path) {
    const parts = path.split('/');
    for (let i = 1; i <= parts.length; i++) {
      const dir = parts.slice(0,i).join('/');
      if (dir) State.folders.add(dir);
    }
    State.expandedFolders.add(path);
    Storage.saveProject();
  },
  deleteItem(path) {
    if (State.files[path]) {
      delete State.files[path];
      delete State.undoStack[path];
      delete State.redoStack[path];
      closeTab(path);
      ExtensionAPI.triggerEvent('file:delete', { path: path });
    }
    State.folders.delete(path);
    const prefix = path + '/';
    Object.keys(State.files).forEach(function(fp) {
      if (fp.startsWith(prefix)) {
        delete State.files[fp];
        delete State.undoStack[fp];
        delete State.redoStack[fp];
        closeTab(fp);
      }
    });
    [...State.folders].forEach(function(fp) {
      if (fp.startsWith(prefix)) State.folders.delete(fp);
    });
    State.expandedFolders.delete(path);
    Storage.saveProject();
  },
  renameItem(oldPath, newPath) {
    if (State.files[oldPath]) {
      State.files[newPath] = State.files[oldPath];
      delete State.files[oldPath];
      if (State.undoStack[oldPath]) { State.undoStack[newPath] = State.undoStack[oldPath]; delete State.undoStack[oldPath]; }
      if (State.redoStack[oldPath]) { State.redoStack[newPath] = State.redoStack[oldPath]; delete State.redoStack[oldPath]; }
      const ti = State.openTabs.indexOf(oldPath);
      if (ti >= 0) State.openTabs[ti] = newPath;
      if (State.activeTab === oldPath) State.activeTab = newPath;
      const parts = newPath.split('/');
      for (let i = 1; i < parts.length; i++) {
        const dir = parts.slice(0,i).join('/');
        if (dir) State.folders.add(dir);
      }
      Storage.saveProject();
      return;
    }
    const oldPrefix = oldPath + '/';
    const wasExpanded = State.expandedFolders.has(oldPath);
    State.folders.delete(oldPath);
    State.folders.add(newPath);
    if (wasExpanded) {
      State.expandedFolders.delete(oldPath);
      State.expandedFolders.add(newPath);
    }
    Object.keys(State.files).forEach(function(fp) {
      if (fp.startsWith(oldPrefix)) {
        const np = newPath + fp.slice(oldPath.length);
        State.files[np] = State.files[fp];
        delete State.files[fp];
        const ti = State.openTabs.indexOf(fp);
        if (ti >= 0) State.openTabs[ti] = np;
        if (State.activeTab === fp) State.activeTab = np;
      }
    });
    [...State.folders].forEach(function(fp) {
      if (fp.startsWith(oldPrefix)) {
        State.folders.delete(fp);
        State.folders.add(newPath + fp.slice(oldPath.length));
      }
    });
    Storage.saveProject();
  },
  moveFile(sourcePath, targetFolder) {
    const name = this.getFileName(sourcePath);
    const newPath = targetFolder ? targetFolder + '/' + name : name;
    if (newPath === sourcePath) return;
    if (State.files[newPath]) {
      showToast('A file with that name already exists', 'warning');
      return;
    }
    this.renameItem(sourcePath, newPath);
  },
  getTree() {
    const tree = {};
    State.folders.forEach(function(fp) {
      const parts = fp.split('/');
      let node = tree;
      parts.forEach(function(p) {
        if (!node[p]) node[p] = { _isDir: true, _path: '', _children: {} };
        node = node[p]._children;
      });
    });
    Object.keys(State.files).forEach(function(fp) {
      const parts = fp.split('/');
      let node = tree;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node[parts[i]]) node[parts[i]] = { _isDir: true, _path: '', _children: {} };
        node = node[parts[i]]._children;
      }
      node[parts[parts.length-1]] = { _isDir: false, _path: fp };
    });
    return tree;
  },
  getAllFiles() { return Object.keys(State.files); },
  getFileSize(path) {
    if (!State.files[path]) return 0;
    return new Blob([State.files[path].content]).size;
  },
  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/(1024*1024)).toFixed(1) + ' MB';
  }
};

// ===== SYNTAX HIGHLIGHTING =====
const Syntax = {
  escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },
  highlightHTML(code) {
    let escaped = this.escapeHtml(code);
    escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="syn-cmt">$1</span>');
    escaped = escaped.replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)/g, '$1<span class="syn-tag">$2</span>');
    escaped = escaped.replace(/\s([a-zA-Z][a-zA-Z0-9-]*)=/g, ' <span class="syn-attr">$1</span>=');
    escaped = escaped.replace(/(["'][^"']*["'])/g, '<span class="syn-str">$1</span>');
    return escaped;
  },
  highlightCSS(code) {
    let escaped = this.escapeHtml(code);
    escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syn-cmt">$1</span>');
    escaped = escaped.replace(/([.#@]?[a-zA-Z_-][a-zA-Z0-9_-]*)\s*(?=\{)/g, '<span class="syn-tag">$1</span>');
    escaped = escaped.replace(/([a-zA-Z-]+)\s*:/g, '<span class="syn-prop">$1</span>:');
    escaped = escaped.replace(/(["'][^"']*["'])/g, '<span class="syn-str">$1</span>');
    escaped = escaped.replace(/\b(\d+\.?\d*)(px|em|rem|%|vh|vw|deg|s|ms|fr)?\b/g, '<span class="syn-num">$1$2</span>');
    escaped = escaped.replace(/(!important)/g, '<span class="syn-kw">$1</span>');
    return escaped;
  },
  highlightJS(code) {
    let result = '';
    let i = 0;
    const len = code.length;
    while (i < len) {
      if (code[i]==='/' && code[i+1]==='/') {
        let end = code.indexOf('\n', i);
        if (end === -1) end = len;
        result += '<span class="syn-cmt">' + this.escapeHtml(code.slice(i, end)) + '</span>';
        i = end;
        continue;
      }
      if (code[i]==='/' && code[i+1]==='*') {
        let end = code.indexOf('*/', i+2);
        if (end === -1) end = len; else end += 2;
        result += '<span class="syn-cmt">' + this.escapeHtml(code.slice(i, end)) + '</span>';
        i = end;
        continue;
      }
      if (code[i]==='"' || code[i]==="'" || code[i]==='`') {
        const quote = code[i];
        let end = i+1;
        while (end < len && code[end]!==quote) { if (code[end]==='\\') end++; end++; }
        if (end < len) end++;
        result += '<span class="syn-str">' + this.escapeHtml(code.slice(i, end)) + '</span>';
        i = end;
        continue;
      }
      if (/\d/.test(code[i]) && (i===0 || /[\s(,=+\-*/<>!&|^~%?:;[\]{}]/.test(code[i-1]))) {
        let end = i;
        while (end < len && /[\d.xXabcdefABCDEFn_]/.test(code[end])) end++;
        result += '<span class="syn-num">' + this.escapeHtml(code.slice(i, end)) + '</span>';
        i = end;
        continue;
      }
      if (/[a-zA-Z_$]/.test(code[i])) {
        let end = i;
        while (end < len && /[a-zA-Z0-9_$]/.test(code[end])) end++;
        const word = code.slice(i, end);
        const keywords = ['const','let','var','function','return','if','else','for','while','do','switch','case','break','continue','new','delete','typeof','instanceof','in','of','try','catch','finally','throw','class','extends','import','export','default','from','async','await','yield','this','super','true','false','null','undefined','void','static','get','set','constructor'];
        if (keywords.includes(word)) {
          result += '<span class="syn-kw">' + word + '</span>';
        } else if (end < len && code[end] === '(') {
          result += '<span class="syn-fn">' + word + '</span>';
        } else {
          result += this.escapeHtml(word);
        }
        i = end;
        continue;
      }
      if (/[=+\-*/<>!&|^~%?]/.test(code[i])) {
        result += '<span class="syn-op">' + this.escapeHtml(code[i]) + '</span>';
        i++;
        continue;
      }
      result += this.escapeHtml(code[i]);
      i++;
    }
    return result;
  },
  highlightJSON(code) {
    let escaped = this.escapeHtml(code);
    escaped = escaped.replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="syn-prop">$1</span>:');
    escaped = escaped.replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="syn-str">$1</span>');
    escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$1</span>');
    escaped = escaped.replace(/\b(true|false|null)\b/g, '<span class="syn-kw">$1</span>');
    return escaped;
  },
  highlight(code, lang) {
    switch(lang) {
      case 'html': case 'svg': case 'xml': return this.highlightHTML(code);
      case 'css': return this.highlightCSS(code);
      case 'javascript': case 'typescript': return this.highlightJS(code);
      case 'json': return this.highlightJSON(code);
      default: return this.escapeHtml(code);
    }
  }
};

// ===== CODE SUGGESTIONS =====
const Suggestions = {
  jsKeywords: ['const','let','var','function','return','if','else','for','while','do','switch','case','break','continue','new','delete','typeof','instanceof','try','catch','finally','throw','class','extends','import','export','default','from','async','await','this','super','true','false','null','undefined','console','document','window','Array','Object','String','Number','Boolean','Promise','Math','JSON','Date','RegExp','Error','Map','Set'],
  htmlTags: ['div','span','p','a','img','input','button','form','table','tr','td','th','thead','tbody','ul','ol','li','h1','h2','h3','h4','h5','h6','header','footer','main','nav','section','article','aside','canvas','video','audio','script','style','link','meta','head','body','html'],
  cssProps: ['color','background','margin','padding','border','width','height','display','flex','grid','position','top','left','right','bottom','font-size','font-family','font-weight','text-align','line-height','opacity','transform','transition','animation','box-shadow','border-radius'],
  
  getSuggestions(code, cursorPos, lang) {
    const beforeCursor = code.slice(0, cursorPos);
    const wordMatch = beforeCursor.match(/[a-zA-Z_$][\w$]*$/);
    if (!wordMatch) return [];
    
    const prefix = wordMatch[0].toLowerCase();
    const items = [];
    
    if (lang === 'javascript' || lang === 'typescript') {
      this.jsKeywords.forEach(function(kw) {
        if (kw.toLowerCase().startsWith(prefix)) {
          items.push({ text: kw, type: 'keyword', icon: 'K' });
        }
      });
    } else if (lang === 'html') {
      this.htmlTags.forEach(function(tag) {
        if (tag.startsWith(prefix)) {
          items.push({ text: tag, type: 'tag', icon: 'T' });
        }
      });
    } else if (lang === 'css') {
      this.cssProps.forEach(function(prop) {
        if (prop.startsWith(prefix)) {
          items.push({ text: prop, type: 'property', icon: 'P' });
        }
      });
    }
    
    return items.slice(0, 10);
  },
  
  show(items, x, y) {
    const popup = document.getElementById('suggestionsPopup');
    if (items.length === 0) {
      this.hide();
      return;
    }
    
    State.suggestions.items = items;
    State.suggestions.selected = 0;
    State.suggestions.visible = true;
    
    popup.innerHTML = items.map(function(item, i) {
      return '<div class="suggestion-item' + (i === 0 ? ' selected' : '') + '" data-index="' + i + '" onclick="Suggestions.accept(' + i + ')">' +
        '<span class="suggestion-icon ' + item.type + '">' + item.icon + '</span>' +
        '<span class="suggestion-text">' + item.text + '</span>' +
        '<span class="suggestion-type">' + item.type + '</span>' +
      '</div>';
    }).join('');
    
    popup.style.left = Math.min(x, window.innerWidth - 300) + 'px';
    popup.style.top = Math.min(y + 20, window.innerHeight - 260) + 'px';
    popup.classList.add('show');
  },
  
  hide() {
    document.getElementById('suggestionsPopup').classList.remove('show');
    State.suggestions.visible = false;
  },
  
  navigate(dir) {
    if (!State.suggestions.visible) return;
    const items = State.suggestions.items;
    let sel = State.suggestions.selected + dir;
    if (sel < 0) sel = items.length - 1;
    if (sel >= items.length) sel = 0;
    State.suggestions.selected = sel;
    
    const popup = document.getElementById('suggestionsPopup');
    popup.querySelectorAll('.suggestion-item').forEach(function(el, i) {
      el.classList.toggle('selected', i === sel);
    });
  },
  
  accept(index) {
    if (!State.suggestions.visible) return;
    const item = State.suggestions.items[index !== undefined ? index : State.suggestions.selected];
    if (!item) return;
    
    const ta = document.getElementById('codeTextarea');
    const beforeCursor = ta.value.slice(0, ta.selectionStart);
    const wordMatch = beforeCursor.match(/[a-zA-Z_$][\w$]*$/);
    if (wordMatch) {
      const start = ta.selectionStart - wordMatch[0].length;
      ta.value = ta.value.slice(0, start) + item.text + ta.value.slice(ta.selectionStart);
      ta.selectionStart = ta.selectionEnd = start + item.text.length;
      ta.dispatchEvent(new Event('input'));
    }
    
    this.hide();
  }
};

// ===== UI RENDERING =====
const UI = {
  renderFileTree() {
    const tree = FS.getTree();
    const container = document.getElementById('fileTree');
    container.innerHTML = '';
    if (Object.keys(tree).length === 0) {
      container.innerHTML = 
        '<div class="empty-state" style="padding:30px 20px">' +
          '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
            '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>' +
          '</svg>' +
          '<div class="empty-state-desc" style="font-size:12px">' + t('noFilesYet') + '</div>' +
          '<button class="btn btn-primary" style="margin-top:8px;height:30px;font-size:11px" onclick="createNewFile()">' + t('createFile') + '</button>' +
        '</div>';
      this.updateStats();
      return;
    }
    this.renderTreeLevel(tree, container, '');
    this.updateStats();
  },
  
  renderTreeLevel(tree, container, parentPath) {
    const entries = Object.keys(tree).sort(function(a, b) {
      const aDir = tree[a]._isDir;
      const bDir = tree[b]._isDir;
      if (aDir && !bDir) return -1;
      if (!aDir && bDir) return 1;
      return a.localeCompare(b);
    });
    
    const self = this;
    entries.forEach(function(name) {
      const node = tree[name];
      const fullPath = parentPath ? parentPath + '/' + name : name;
      
      if (node._isDir) {
        const expanded = State.expandedFolders.has(fullPath);
        const item = document.createElement('div');
        item.className = 'tree-item' + (State.selectedItem === fullPath ? ' selected' : '');
        item.style.paddingLeft = ((fullPath.split('/').length - 1) * 14 + 10) + 'px';
        item.dataset.path = fullPath;
        item.dataset.type = 'folder';
        item.draggable = true;
        item.innerHTML = 
          '<span class="tree-chevron' + (expanded ? ' expanded' : '') + '">' + Icons.chevron + '</span>' +
          '<span class="tree-icon" style="color:#e8a838">' + (expanded ? Icons.folderOpen : Icons.folder) + '</span>' +
          '<span class="tree-label">' + name + '</span>';
        item.addEventListener('click', function(e) { e.stopPropagation(); self.toggleFolder(fullPath); });
        item.addEventListener('contextmenu', function(e) { e.preventDefault(); e.stopPropagation(); showContextMenu(e, fullPath, 'folder'); });
        item.addEventListener('dragstart', function(e) { State.dragItem = fullPath; e.dataTransfer.effectAllowed = 'move'; });
        item.addEventListener('dragover', function(e) { e.preventDefault(); item.classList.add('drag-over'); });
        item.addEventListener('dragleave', function() { item.classList.remove('drag-over'); });
        item.addEventListener('drop', function(e) { e.preventDefault(); item.classList.remove('drag-over'); handleDrop(fullPath); });
        container.appendChild(item);
        
        if (expanded && node._children) {
          self.renderTreeLevel(node._children, container, fullPath);
        }
      } else {
        const fp = node._path || fullPath;
        const fileData = State.files[fp];
        const item = document.createElement('div');
        item.className = 'tree-item' + (State.selectedItem === fp ? ' selected' : '');
        item.style.paddingLeft = ((fp.split('/').length - 1) * 14 + 10) + 'px';
        item.dataset.path = fp;
        item.dataset.type = 'file';
        item.draggable = true;
        const iconName = FS.getFileIcon(fp);
        const iconColor = FS.getFileColor(fp);
        item.innerHTML = 
          '<span class="tree-chevron" style="visibility:hidden">' + Icons.chevron + '</span>' +
          '<span class="tree-icon" style="color:' + iconColor + '">' + Icons[iconName] + '</span>' +
          '<span class="tree-label">' + name + '</span>' +
          (fileData && fileData.modified ? '<span class="tree-modified"></span>' : '');
        item.addEventListener('click', function(e) { e.stopPropagation(); openFile(fp); });
        item.addEventListener('contextmenu', function(e) { e.preventDefault(); e.stopPropagation(); showContextMenu(e, fp, 'file'); });
        item.addEventListener('dragstart', function(e) { State.dragItem = fp; e.dataTransfer.effectAllowed = 'move'; });
        container.appendChild(item);
      }
    });
  },
  
  toggleFolder(path) {
    if (State.expandedFolders.has(path)) {
      State.expandedFolders.delete(path);
    } else {
      State.expandedFolders.add(path);
    }
    State.selectedItem = path;
    this.showFileDetails(path, 'folder');
    this.renderFileTree();
    Storage.saveProject();
  },
  
  renderTabs() {
    const bar = document.getElementById('tabsBar');
    bar.innerHTML = '';
    State.openTabs.forEach(function(fp) {
      const fileData = State.files[fp];
      if (!fileData) return;
      const tab = document.createElement('div');
      tab.className = 'tab' + (State.activeTab === fp ? ' active' : '');
      const iconName = FS.getFileIcon(fp);
      const iconColor = FS.getFileColor(fp);
      tab.innerHTML = 
        '<span class="tab-icon" style="color:' + iconColor + '">' + Icons[iconName] + '</span>' +
        '<span class="tab-label">' + FS.getFileName(fp) + '</span>' +
        (fileData.modified ? '<span class="tab-modified"></span>' : '') +
        '<button class="tab-close" onclick="event.stopPropagation();closeTab(\'' + fp.replace(/'/g, "\\'") + '\')">' + Icons.close + '</button>';
      tab.addEventListener('click', function() { switchTab(fp); });
      tab.addEventListener('contextmenu', function(e) { e.preventDefault(); showTabContextMenu(e, fp); });
      bar.appendChild(tab);
    });
  },
  
  updateEditor() {
    const textarea = document.getElementById('codeTextarea');
    const highlight = document.getElementById('codeHighlight');
    const lineNums = document.getElementById('lineNumbers');
    const editorWrapper = document.getElementById('editorWrapper');
    const emptyState = document.getElementById('emptyState');

    if (!State.activeTab || !State.files[State.activeTab]) {
      editorWrapper.style.display = 'none';
      emptyState.style.display = 'flex';
      document.getElementById('statusLang').textContent = '--';
      document.getElementById('statusCursor').textContent = '--';
      return;
    }
    editorWrapper.style.display = 'flex';
    emptyState.style.display = 'none';

    const fileData = State.files[State.activeTab];
    const lang = FS.getLang(State.activeTab);

    textarea.value = fileData.content;
    highlight.innerHTML = Syntax.highlight(fileData.content, lang) + '\n';

    const lines = fileData.content.split('\n');
    lineNums.innerHTML = lines.map(function(_, i) { return '<div class="line-number">' + (i+1) + '</div>'; }).join('');

    document.getElementById('statusLang').textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
    this.updateCursorPosition();
    
    ExtensionAPI.triggerEvent('file:open', { path: State.activeTab, content: fileData.content });
  },
  
  updateCursorPosition() {
    const textarea = document.getElementById('codeTextarea');
    const pos = textarea.selectionStart;
    const text = textarea.value.substring(0, pos);
    const line = text.split('\n').length;
    const col = pos - text.lastIndexOf('\n');
    document.getElementById('statusCursor').textContent = 'Ln ' + line + ', Col ' + col;
  },
  
  showFileDetails(path, type) {
    const panel = document.getElementById('fileDetails');
    if (type === 'file' && State.files[path]) {
      panel.style.display = 'block';
      document.getElementById('detailType').textContent = FS.getExt(path).toUpperCase() || 'File';
      document.getElementById('detailSize').textContent = FS.formatSize(FS.getFileSize(path));
      document.getElementById('detailModified').textContent = new Date(State.files[path].lastSaved).toLocaleString();
    } else if (type === 'folder') {
      panel.style.display = 'block';
      const prefix = path + '/';
      const fileCount = Object.keys(State.files).filter(function(f) { return f.startsWith(prefix); }).length;
      document.getElementById('detailType').textContent = 'Folder';
      document.getElementById('detailSize').textContent = fileCount + ' file(s)';
      document.getElementById('detailModified').textContent = '--';
    } else {
      panel.style.display = 'none';
    }
  },
  
  updateStats() {
    document.getElementById('statFiles').textContent = Object.keys(State.files).length + ' files';
    document.getElementById('statFolders').textContent = State.folders.size + ' folders';
  },
  
  // ===== EXTENSION CONTRIBUTION RENDERING =====
  renderExtensionContributions() {
    this.renderToolbarContributions();
    this.renderStatusbarContributions();
    this.renderSidebarContributions();
  },
  
  renderToolbarContributions() {
    const container = document.getElementById('extToolbarGroup');
    if (!container) return;
    container.innerHTML = '';
    
    const items = ContributionManager.contributions.toolbar;
    if (items.length === 0) return;
    
    // Add separator before extension items
    if (items.length > 0) {
      const sep = document.createElement('div');
      sep.className = 'toolbar-sep';
      container.appendChild(sep);
    }
    
    items.forEach(function(item) {
      const btn = document.createElement('button');
      btn.className = 'toolbar-btn';
      btn.title = item.title;
      btn.innerHTML = (item.icon ? item.icon : icon('puzzle', 15, 15)) + '<span class="btn-text">' + item.title + '</span>';
      btn.addEventListener('click', function() {
        ContributionManager.executeCommand(item.command);
      });
      container.appendChild(btn);
    });
  },
  
  renderStatusbarContributions() {
    const container = document.getElementById('extStatusbarSection');
    if (!container) return;
    container.innerHTML = '';
    
    const items = ContributionManager.contributions.statusbar;
    items.forEach(function(item) {
      const el = document.createElement('span');
      el.className = 'ext-statusbar-item';
      el.title = item.tooltip || '';
      
      if (item.render && typeof item.render === 'function') {
        const rendered = ExtensionSandbox.safeCall(item.render, item.extensionId, null, '');
        el.innerHTML = (item.icon || '') + '<span>' + (rendered || item.text) + '</span>';
      } else {
        el.innerHTML = (item.icon || '') + '<span>' + item.text + '</span>';
      }
      
      if (item.onClick) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', function() {
          ExtensionSandbox.safeCall(item.onClick, item.extensionId, null, null);
        });
      }
      
      container.appendChild(el);
    });
  },
  
  renderSidebarContributions() {
    const container = document.getElementById('extSidebarPanel');
    if (!container) return;
    
    const items = ContributionManager.contributions.sidebar;
    if (items.length === 0) {
      container.classList.remove('show');
      container.innerHTML = '';
      return;
    }
    
    // Show the first sidebar panel by default (or the active one)
    const activePanel = items.find(function(s) { return s.id === State.currentExtensionView; }) || items[0];
    
    container.innerHTML = '';
    container.classList.add('show');
    
    // Render header with tabs
    const header = document.createElement('div');
    header.className = 'sidebar-header';
    header.innerHTML = '<span class="sidebar-title">' + (activePanel ? activePanel.title : 'Extensions') + '</span>';
    container.appendChild(header);
    
    // Render content
    const content = document.createElement('div');
    content.style.flex = '1';
    content.style.overflow = 'auto';
    content.style.padding = '10px';
    
    if (activePanel && activePanel.render) {
      const html = ExtensionSandbox.safeCall(activePanel.render, activePanel.extensionId, null, '<div style="color:var(--text-tertiary);padding:20px;text-align:center">Extension panel</div>');
      content.innerHTML = html || '<div style="color:var(--text-tertiary);padding:20px;text-align:center">No content</div>';
    }
    
    container.appendChild(content);
  },
  
  getExtensionContextMenuItems(type) {
    return ContributionManager.getContextMenusForType(type);
  }
};

// ===== FILE OPERATIONS =====
function openFile(path) {
  if (!State.files[path]) return;
  if (!State.openTabs.includes(path)) {
    State.openTabs.push(path);
  }
  State.activeTab = path;
  State.selectedItem = path;
  UI.renderTabs();
  UI.updateEditor();
  UI.renderFileTree();
  UI.showFileDetails(path, 'file');
  Storage.saveProject();
}

function switchTab(path) {
  if (State.activeTab === path) return;
  saveEditorState();
  State.activeTab = path;
  State.selectedItem = path;
  UI.renderTabs();
  UI.updateEditor();
  UI.renderFileTree();
  UI.showFileDetails(path, 'file');
  Storage.saveProject();
}

function closeTab(path) {
  const idx = State.openTabs.indexOf(path);
  if (idx < 0) return;
  State.openTabs.splice(idx, 1);
  if (State.activeTab === path) {
    State.activeTab = State.openTabs.length > 0 ? State.openTabs[Math.min(idx, State.openTabs.length-1)] : null;
  }
  UI.renderTabs();
  UI.updateEditor();
  UI.renderFileTree();
  Storage.saveProject();
}

function saveEditorState() {
  if (!State.activeTab || !State.files[State.activeTab]) return;
  const textarea = document.getElementById('codeTextarea');
  const content = textarea.value;
  const fileData = State.files[State.activeTab];
  if (fileData.content !== content) {
    if (!State.undoStack[State.activeTab]) State.undoStack[State.activeTab] = [];
    State.undoStack[State.activeTab].push(fileData.content);
    if (State.undoStack[State.activeTab].length > 100) State.undoStack[State.activeTab].shift();
    State.redoStack[State.activeTab] = [];
    fileData.content = content;
    fileData.modified = content !== fileData.original;
    UI.renderTabs();
    UI.renderFileTree();
    schedulePreview();
    ExtensionAPI.triggerEvent('editor:change', { path: State.activeTab, content: content });
  }
}

function saveCurrentFile() {
  if (!State.activeTab || !State.files[State.activeTab]) return;
  saveEditorState();
  const fileData = State.files[State.activeTab];
  fileData.original = fileData.content;
  fileData.modified = false;
  fileData.lastSaved = Date.now();
  UI.renderTabs();
  UI.renderFileTree();
  Storage.saveProject();
  showToast('File saved', 'success');
  schedulePreview();
  ExtensionAPI.triggerEvent('file:save', { path: State.activeTab, content: fileData.content });
}

function createNewFile(parentPath) {
  showInputModal('New File', 'Enter file name:', 'untitled.html', function(name) {
    if (!name) return;
    const path = parentPath ? parentPath + '/' + name : name;
    if (State.files[path]) {
      showToast('File already exists', 'warning');
      return;
    }
    const ext = FS.getExt(name);
    let content = '';
    if (ext === 'html') {
      content = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  \n  <script src="script.js"><\/script>\n</body>\n</html>';
    } else if (ext === 'css') {
      content = '/* Styles */\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: system-ui, sans-serif;\n}\n';
    } else if (ext === 'js') {
      content = '// JavaScript\n\nconsole.log("Hello, JOCE IDE!");\n';
    } else if (ext === 'json') {
      content = '{\n  \n}\n';
    }
    FS.createFile(path, content);
    if (parentPath) State.expandedFolders.add(parentPath);
    openFile(path);
    UI.renderFileTree();
    showToast('File created', 'success');
  });
}

function createNewFolder(parentPath) {
  showInputModal('New Folder', 'Enter folder name:', 'new-folder', function(name) {
    if (!name) return;
    const path = parentPath ? parentPath + '/' + name : name;
    if (State.folders.has(path)) {
      showToast('Folder already exists', 'warning');
      return;
    }
    FS.createFolder(path);
    if (parentPath) State.expandedFolders.add(parentPath);
    UI.renderFileTree();
    showToast('Folder created', 'success');
  });
}

function deleteItem(path) {
  const isFile = !!State.files[path];
  const typeName = isFile ? 'file' : 'folder';
  showConfirmModal('Delete ' + typeName, 'Are you sure you want to delete "' + FS.getFileName(path) + '"?' + (!isFile ? ' This will delete all contents.' : ''), function() {
    FS.deleteItem(path);
    UI.renderFileTree();
    UI.renderTabs();
    UI.updateEditor();
    showToast('Deleted successfully', 'success');
  });
}

function renameItem(path) {
  const name = FS.getFileName(path);
  showInputModal('Rename', 'Enter new name:', name, function(newName) {
    if (!newName || newName === name) return;
    const dir = FS.getDir(path);
    const newPath = dir ? dir + '/' + newName : newName;
    if (State.files[newPath] || State.folders.has(newPath)) {
      showToast('An item with that name already exists', 'warning');
      return;
    }
    FS.renameItem(path, newPath);
    UI.renderFileTree();
    UI.renderTabs();
    UI.updateEditor();
    showToast('Renamed successfully', 'success');
  });
}

function downloadFile(path) {
  if (!State.files[path]) return;
  const blob = new Blob([State.files[path].content], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = FS.getFileName(path);
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('File downloaded', 'success');
}

function duplicateFile(path) {
  if (!State.files[path]) return;
  const ext = FS.getExt(path);
  const base = path.replace(/\.[^.]+$/, '');
  let newPath = base + '-copy' + (ext ? '.' + ext : '');
  let i = 1;
  while (State.files[newPath]) {
    newPath = base + '-copy' + (++i) + (ext ? '.' + ext : '');
  }
  FS.createFile(newPath, State.files[path].content);
  UI.renderFileTree();
  showToast('File duplicated', 'success');
}

function copyPath(path) {
  navigator.clipboard.writeText(path).then(function() {
    showToast('Path copied', 'success');
  });
}

function handleDrop(targetFolder) {
  if (!State.dragItem || State.dragItem === targetFolder) return;
  const source = State.dragItem;
  State.dragItem = null;
  if (targetFolder.startsWith(source + '/')) return;
  if (State.files[source]) {
    FS.moveFile(source, targetFolder);
  } else if (State.folders.has(source)) {
    const name = FS.getFileName(source);
    const newPath = targetFolder ? targetFolder + '/' + name : name;
    FS.renameItem(source, newPath);
  }
  UI.renderFileTree();
  UI.renderTabs();
  showToast('Item moved', 'success');
}

// ===== IMPORT/EXPORT =====

function importProject() {
  const folderInfo = State.selectedItem && State.folders.has(State.selectedItem) ? State.selectedItem : '';
  showModal(t('importProject'),
    '<div style="display:flex;flex-direction:column;gap:14px">' +
      '<button class="btn btn-secondary" style="width:100%;height:44px;justify-content:center" onclick="document.getElementById(\'fileImportInput\').click();closeModal()">' +
        icon('file',18,18) + ' ' + t('importFiles') +
      '</button>' +
      '<button class="btn btn-secondary" style="width:100%;height:44px;justify-content:center" onclick="document.getElementById(\'folderImportInput\').click();closeModal()">' +
        icon('folder',18,18) + ' ' + t('importProjectFolder') +
      '</button>' +
      '<button class="btn btn-secondary" style="width:100%;height:44px;justify-content:center' + (folderInfo ? '' : ';opacity:.55') + '" onclick="' + (folderInfo ? "importFilesToFolder('" + folderInfo.replace(/'/g, "\\'") + "');closeModal()" : 'closeModal()') + '">' +
        icon('upload',18,18) + ' ' + t('importIntoFolder') +
      '</button>' +
      '<p style="font-size:11px;color:var(--text-tertiary);text-align:center;margin-top:8px">' +
        (State.language === 'ar'
          ? 'يمكنك أيضًا سحب وإفلات الملفات والمجلدات مباشرة داخل التطبيق'
          : 'You can also drag and drop files/folders directly onto the editor') +
      '</p>' +
    '</div>',
  false);
}

function importFilesToFolder(folderPath) {
  State.importTargetFolder = folderPath || '';
  document.getElementById('filesToFolderInput').click();
}

document.getElementById('fileImportInput').addEventListener('change', async function(e) {
  const targetFolder = State.importTargetFolder || '';
  for (const file of e.target.files) {
    const content = await file.text().catch(function() { return ''; });
    const path = targetFolder ? targetFolder + '/' + file.name : file.name;
    FS.createFile(path, content);
  }
  if (targetFolder) State.expandedFolders.add(targetFolder);
  UI.renderFileTree();
  UI.renderTabs();
  Storage.saveProject();
  showToast((e.target.files.length || 0) + ' file(s) imported', 'success');
  State.importTargetFolder = null;
  this.value = '';
});

document.getElementById('folderImportInput').addEventListener('change', async function(e) {
  let count = 0;
  const rootFolders = new Set();
  for (const file of e.target.files) {
    const path = file.webkitRelativePath || file.name;
    const content = await file.text().catch(function() { return ''; });
    FS.createFile(path, content);
    count++;
    if (path.includes('/')) rootFolders.add(path.split('/')[0]);
  }
  rootFolders.forEach(function(rootFolder) { State.expandedFolders.add(rootFolder); });
  UI.renderFileTree();
  UI.renderTabs();
  Storage.saveProject();
  showToast(count + ' file(s) imported', 'success');
  this.value = '';
});

document.getElementById('filesToFolderInput').addEventListener('change', async function(e) {
  const targetFolder = State.importTargetFolder || '';
  for (const file of e.target.files) {
    const path = targetFolder ? targetFolder + '/' + file.name : file.name;
    const content = await file.text().catch(function() { return ''; });
    FS.createFile(path, content);
  }
  if (targetFolder) State.expandedFolders.add(targetFolder);
  UI.renderFileTree();
  UI.renderTabs();
  Storage.saveProject();
  showToast(e.target.files.length + ' file(s) imported to folder', 'success');
  State.importTargetFolder = null;
  this.value = '';
});

function exportProject() {
  const activeTabHtml = State.activeTab ? 
    '<button class="btn btn-secondary" style="width:100%;height:42px;justify-content:center" onclick="downloadFile(\'' + State.activeTab.replace(/'/g, "\\'") + '\');closeModal()">' +
      icon('download',18,18) + ' Download Current File' +
    '</button>' : '';
    
  showModal('Export Project', 
    '<div style="display:flex;flex-direction:column;gap:12px">' +
      '<button class="btn btn-secondary" style="width:100%;height:42px;justify-content:center" onclick="exportAsZip();closeModal()">' +
        icon('zip',18,18) + ' Download as ZIP' +
      '</button>' +
      '<button class="btn btn-secondary" style="width:100%;height:42px;justify-content:center" onclick="exportAsSingleHTML();closeModal()">' +
        icon('package',18,18) + ' Bundle as Single HTML' +
      '</button>' +
      activeTabHtml +
    '</div>',
  false);
}

async function exportAsZip() {
  const files = Object.entries(State.files);
  if (files.length === 0) { showToast('No files to export', 'warning'); return; }

  try {
    const parts = [];
    const encoder = new TextEncoder();
    const centralDir = [];
    let offset = 0;

    for (const [path, data] of files) {
      const nameBytes = encoder.encode(path);
      const contentBytes = encoder.encode(data.content);
      const crc = crc32(contentBytes);

      const header = new Uint8Array(30 + nameBytes.length);
      const hv = new DataView(header.buffer);
      hv.setUint32(0, 0x04034b50, true);
      hv.setUint16(4, 20, true);
      hv.setUint16(6, 0, true);
      hv.setUint16(8, 0, true);
      hv.setUint16(10, 0, true);
      hv.setUint16(12, 0, true);
      hv.setUint32(14, crc, true);
      hv.setUint32(18, contentBytes.length, true);
      hv.setUint32(22, contentBytes.length, true);
      hv.setUint16(26, nameBytes.length, true);
      hv.setUint16(28, 0, true);
      header.set(nameBytes, 30);

      parts.push(header, contentBytes);

      const cdEntry = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(cdEntry.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, contentBytes.length, true);
      cv.setUint32(24, contentBytes.length, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      cdEntry.set(nameBytes, 46);
      centralDir.push(cdEntry);

      offset += header.length + contentBytes.length;
    }

    const cdOffset = offset;
    let cdSize = 0;
    centralDir.forEach(function(e) { parts.push(e); cdSize += e.length; });

    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, cdOffset, true);
    ev.setUint16(20, 0, true);
    parts.push(eocd);

    const blob = new Blob(parts, {type:'application/zip'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (document.getElementById('projectName').textContent || 'project') + '.zip';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Project exported as ZIP', 'success');
  } catch(err) {
    showToast('Export failed: ' + err.message, 'error');
  }
}

function crc32(bytes) {
  let crc = ~0;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (let i = 0; i < bytes.length; i++) {
    crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (~crc) >>> 0;
}

function exportAsSingleHTML() {
  let htmlPath = Object.keys(State.files).find(function(f) { return f.endsWith('index.html'); }) || Object.keys(State.files).find(function(f) { return FS.getExt(f) === 'html'; });
  if (!htmlPath) {
    showToast('No HTML file found in project', 'warning');
    return;
  }
  let htmlContent = State.files[htmlPath].content;

  Object.keys(State.files).forEach(function(fp) {
    if (FS.getExt(fp) === 'css') {
      const name = FS.getFileName(fp);
      const patterns = [name, './' + name, '/' + name, fp];
      patterns.forEach(function(pattern) {
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('<link[^>]*href=["\']' + escaped + '["\'][^>]*/?>', 'gi');
        htmlContent = htmlContent.replace(regex, '<style>\n' + State.files[fp].content + '\n</style>');
      });
    }
  });

  Object.keys(State.files).forEach(function(fp) {
    if (FS.getExt(fp) === 'js') {
      const name = FS.getFileName(fp);
      const patterns = [name, './' + name, '/' + name, fp];
      patterns.forEach(function(pattern) {
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('<script[^>]*src=["\']' + escaped + '["\'][^>]*>\\s*<\\/script>', 'gi');
        htmlContent = htmlContent.replace(regex, '<script>\n' + State.files[fp].content + '\n<\/script>');
      });
    }
  });

  const blob = new Blob([htmlContent], {type:'text/html;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'bundle.html';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('Bundled HTML exported', 'success');
}

// ===== PREVIEW SYSTEM =====
function schedulePreview() {
  if (!State.previewVisible || !State.liveRefresh) return;
  clearTimeout(State.refreshTimer);
  State.refreshTimer = setTimeout(refreshPreview, 500);
}

function refreshPreview() {
  if (!State.previewVisible) return;
  const iframe = document.getElementById('previewFrame');

  let htmlPath = Object.keys(State.files).find(function(f) { return f.endsWith('index.html'); }) || Object.keys(State.files).find(function(f) { return FS.getExt(f) === 'html'; });
  if (!htmlPath) {
    iframe.srcdoc = '<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;color:#888;background:#0d1117;margin:0"><div style="text-align:center"><p style="font-size:16px">No HTML file found</p><p style="font-size:13px;opacity:0.7;margin-top:8px">Create an index.html to see preview</p></div></body></html>';
    return;
  }

  document.getElementById('previewUrl').textContent = 'project://' + htmlPath;
  let htmlContent = State.files[htmlPath].content;

  Object.keys(State.files).forEach(function(fp) {
    const ext = FS.getExt(fp);
    const name = FS.getFileName(fp);
    const dir = FS.getDir(fp);
    const patterns = [name, './' + name, '/' + name, fp, './' + fp];
    
    if (dir) {
      patterns.push(dir + '/' + name);
      patterns.push('./' + dir + '/' + name);
    }
    
    if (ext === 'css') {
      patterns.forEach(function(pattern) {
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('<link[^>]*href=["\']' + escaped + '["\'][^>]*/?>', 'gi');
        htmlContent = htmlContent.replace(regex, '<style>/* ' + fp + ' */\n' + State.files[fp].content + '\n</style>');
      });
    }
    if (ext === 'js') {
      patterns.forEach(function(pattern) {
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('<script[^>]*src=["\']' + escaped + '["\'][^>]*>\\s*<\\/script>', 'gi');
        htmlContent = htmlContent.replace(regex, '<script>/* ' + fp + ' */\n' + State.files[fp].content + '\n<\/script>');
      });
    }
  });

  iframe.srcdoc = htmlContent;
  document.getElementById('statusDot').className = 'status-indicator';
  document.getElementById('statusText').textContent = 'Preview updated';
  setTimeout(function() { document.getElementById('statusText').textContent = 'Ready'; }, 2000);
  
  ExtensionAPI.triggerEvent('preview:refresh', { htmlPath: htmlPath, content: htmlContent });
}

function togglePreview() {
  State.previewVisible = !State.previewVisible;
  const panel = document.getElementById('previewPanel');
  const btn = document.getElementById('togglePreviewBtn');
  if (State.previewVisible) {
    panel.classList.remove('hidden');
    btn.classList.add('active');
    refreshPreview();
  } else {
    panel.classList.add('hidden');
    btn.classList.remove('active');
  }
}

function openPreviewExternal() {
  let htmlPath = Object.keys(State.files).find(function(f) { return f.endsWith('index.html'); }) || Object.keys(State.files).find(function(f) { return FS.getExt(f) === 'html'; });
  if (!htmlPath) { showToast('No HTML file found', 'warning'); return; }
  let htmlContent = State.files[htmlPath].content;
  
  Object.keys(State.files).forEach(function(fp) {
    const ext = FS.getExt(fp);
    const name = FS.getFileName(fp);
    if (ext === 'css') {
      const regex = new RegExp('<link[^>]*href=["\'](?:\\.?\\/)?' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\'][^>]*/?>', 'gi');
      htmlContent = htmlContent.replace(regex, '<style>' + State.files[fp].content + '</style>');
    }
    if (ext === 'js') {
      const regex = new RegExp('<script[^>]*src=["\'](?:\\.?\\/)?' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\'][^>]*>\\s*<\\/script>', 'gi');
      htmlContent = htmlContent.replace(regex, '<script>' + State.files[fp].content + '<\/script>');
    }
  });
  const blob = new Blob([htmlContent], {type:'text/html'});
  window.open(URL.createObjectURL(blob), '_blank');
}

// ===== CONTEXT MENUS =====
function showContextMenu(e, path, type) {
  State.selectedItem = path;
  UI.renderFileTree();
  const menu = document.getElementById('contextMenu');
  let items = '';
  
  if (type === 'file') {
    items = 
      '<div class="ctx-item" onclick="openFile(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('file') + ' <span class="ctx-item-label">Open</span>' +
      '</div>' +
      '<div class="ctx-sep"></div>' +
      '<div class="ctx-item" onclick="renameItem(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('edit') + ' <span class="ctx-item-label">Rename</span> <span class="ctx-item-shortcut">F2</span>' +
      '</div>' +
      '<div class="ctx-item" onclick="duplicateFile(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('copy') + ' <span class="ctx-item-label">Duplicate</span>' +
      '</div>' +
      '<div class="ctx-item" onclick="copyPath(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('copy') + ' <span class="ctx-item-label">Copy Path</span>' +
      '</div>' +
      '<div class="ctx-item" onclick="downloadFile(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('download') + ' <span class="ctx-item-label">Download</span>' +
      '</div>' +
      '<div class="ctx-item" onclick="promptMoveFile(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('move') + ' <span class="ctx-item-label">Move to...</span>' +
      '</div>' +
      '<div class="ctx-sep"></div>' +
      '<div class="ctx-item danger" onclick="deleteItem(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('trash') + ' <span class="ctx-item-label">Delete</span> <span class="ctx-item-shortcut">Del</span>' +
      '</div>';
  } else {
    items = 
      '<div class="ctx-item" onclick="createNewFile(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('file') + ' <span class="ctx-item-label">New File</span>' +
      '</div>' +
      '<div class="ctx-item" onclick="createNewFolder(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('folder') + ' <span class="ctx-item-label">New Folder</span>' +
      '</div>' +
      '<div class="ctx-sep"></div>' +
      '<div class="ctx-item" onclick="importFilesToFolder(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('upload') + ' <span class="ctx-item-label">Import Files Here</span>' +
      '</div>' +
      '<div class="ctx-sep"></div>' +
      '<div class="ctx-item" onclick="renameItem(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('edit') + ' <span class="ctx-item-label">Rename</span> <span class="ctx-item-shortcut">F2</span>' +
      '</div>' +
      '<div class="ctx-item" onclick="copyPath(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('copy') + ' <span class="ctx-item-label">Copy Path</span>' +
      '</div>' +
      '<div class="ctx-sep"></div>' +
      '<div class="ctx-item danger" onclick="deleteItem(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
        icon('trash') + ' <span class="ctx-item-label">Delete</span>' +
      '</div>';
  }
  
  // Add extension context menu items
  const extItems = UI.getExtensionContextMenuItems(type);
  if (extItems.length > 0) {
    items += '<div class="ctx-sep"></div>';
    items += '<div class="ctx-category-label">Extensions</div>';
    extItems.forEach(function(item) {
      items += '<div class="ctx-item" onclick="ContributionManager.executeCommand(\'' + item.command + '\');hideContextMenu()">' +
        (item.icon || icon('puzzle')) + ' <span class="ctx-item-label">' + item.title + '</span>' +
      '</div>';
    });
  }
  
  menu.innerHTML = items;
  menu.classList.add('show');

  const x = Math.min(e.clientX, window.innerWidth - 220);
  const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 10);
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
}

function showTabContextMenu(e, path) {
  const menu = document.getElementById('contextMenu');
  menu.innerHTML = 
    '<div class="ctx-item" onclick="closeTab(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
      icon('close') + ' <span class="ctx-item-label">Close</span>' +
    '</div>' +
    '<div class="ctx-item" onclick="closeOtherTabs(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
      icon('close') + ' <span class="ctx-item-label">Close Others</span>' +
    '</div>' +
    '<div class="ctx-item" onclick="closeAllTabs();hideContextMenu()">' +
      icon('close') + ' <span class="ctx-item-label">Close All</span>' +
    '</div>' +
    '<div class="ctx-sep"></div>' +
    '<div class="ctx-item" onclick="copyPath(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
      icon('copy') + ' <span class="ctx-item-label">Copy Path</span>' +
    '</div>' +
    '<div class="ctx-item" onclick="downloadFile(\'' + path.replace(/'/g, "\\'") + '\');hideContextMenu()">' +
      icon('download') + ' <span class="ctx-item-label">Download</span>' +
    '</div>';
  menu.classList.add('show');
  const x = Math.min(e.clientX, window.innerWidth - 220);
  const y = Math.min(e.clientY, window.innerHeight - 200);
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
}

function hideContextMenu() {
  document.getElementById('contextMenu').classList.remove('show');
}

function closeOtherTabs(keepPath) {
  State.openTabs = [keepPath];
  State.activeTab = keepPath;
  UI.renderTabs();
  UI.updateEditor();
  Storage.saveProject();
}

function closeAllTabs() {
  State.openTabs = [];
  State.activeTab = null;
  UI.renderTabs();
  UI.updateEditor();
  Storage.saveProject();
}

function promptMoveFile(path) {
  const folders = ['(root)'].concat([...State.folders]);
  const options = folders.map(function(f) { return '<option value="' + (f === '(root)' ? '' : f) + '">' + f + '</option>'; }).join('');
  showModal('Move File', 
    '<div class="form-group">' +
      '<label class="form-label">Destination Folder</label>' +
      '<select class="form-select" id="moveFolderSelect">' + options + '</select>' +
    '</div>',
  true, function() {
    const target = document.getElementById('moveFolderSelect').value;
    FS.moveFile(path, target);
    UI.renderFileTree();
    UI.renderTabs();
    showToast('File moved', 'success');
  });
}

// ===== SEARCH =====
function toggleSearchPanel() {
  const panel = document.getElementById('searchPanel');
  panel.classList.toggle('show');
  if (panel.classList.contains('show')) {
    document.getElementById('searchInput').focus();
  }
}

function openGlobalSearch() {
  toggleSearchPanel();
}


function searchInProject(query) {
  const results = document.getElementById('searchResults');
  const countEl = document.getElementById('searchCount');

  if (!query || query.length < 2) {
    results.innerHTML = '';
    countEl.textContent = '';
    return;
  }

  const caseSensitive = document.getElementById('searchCaseSensitive').checked;
  const useRegex = document.getElementById('searchRegex').checked;
  const currentFileOnly = document.getElementById('searchCurrentFileOnly') && document.getElementById('searchCurrentFileOnly').checked;

  const matches = [];
  let searchPattern;

  try {
    if (useRegex) {
      searchPattern = new RegExp(query, caseSensitive ? 'g' : 'gi');
    } else {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      searchPattern = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
    }
  } catch(e) {
    results.innerHTML = '<div class="cp-empty">Invalid regex pattern</div>';
    return;
  }

  const filesToSearch = currentFileOnly && State.activeTab && State.files[State.activeTab]
    ? [[State.activeTab, State.files[State.activeTab]]]
    : Object.entries(State.files);

  filesToSearch.forEach(function(entry) {
    const path = entry[0];
    const data = entry[1];
    const lines = data.content.split('\n');
    lines.forEach(function(line, i) {
      if (searchPattern.global) searchPattern.lastIndex = 0;
      const match = line.match(searchPattern);
      if (match) {
        const col = line.search(searchPattern) + 1;
        matches.push({ path: path, line: i+1, text: line.trim(), col: col });
      }
    });
  });

  countEl.textContent = matches.length + ' ' + t('resultFound');

  if (matches.length === 0) {
    results.innerHTML = '<div class="cp-empty">' + t('noResultsFound') + '</div>';
    return;
  }

  results.innerHTML = matches.slice(0, 100).map(function(m) {
    const safeLine = Syntax.escapeHtml(m.text);
    const highlighted = safeLine.replace(searchPattern, '<span class="search-match">$&</span>');
    return '<div class="search-result-item" onclick="goToSearchResult(\'' + m.path.replace(/'/g, "\\'") + '\', ' + m.line + ', ' + m.col + ')">' +
      '<span class="search-result-file">' + m.path + ' : ' + m.line + '</span>' +
      '<span class="search-result-line">' + highlighted + '</span>' +
    '</div>';
  }).join('');
}

function goToSearchResult(path, line, col) {
  openFile(path);
  setTimeout(function() {
    const ta = document.getElementById('codeTextarea');
    const lines = ta.value.split('\n');
    let pos = 0;
    for (let i = 0; i < line - 1; i++) {
      pos += lines[i].length + 1;
    }
    pos += col - 1;
    ta.focus();
    ta.setSelectionRange(pos, pos);
    UI.updateCursorPosition();
  }, 100);
}

// ===== COMMAND PALETTE =====
function showQuickSwitcher() {
  const cp = document.getElementById('commandPalette');
  cp.classList.add('show');
  const input = document.getElementById('cpInput');
  input.value = '';
  input.focus();
  updateCommandPalette('');
}

function hideQuickSwitcher() {
  document.getElementById('commandPalette').classList.remove('show');
}

function updateCommandPalette(query) {
  const results = document.getElementById('cpResults');
  const isCommand = query.startsWith('>');
  
  if (isCommand) {
    const cmdQuery = query.slice(1).toLowerCase().trim();
    const commands = [
      { id: 'newFile', label: 'New File', shortcut: 'Ctrl+N', category: 'File' },
      { id: 'newFolder', label: 'New Folder', shortcut: '', category: 'File' },
      { id: 'save', label: 'Save File', shortcut: 'Ctrl+S', category: 'File' },
      { id: 'format', label: 'Format Code', shortcut: '', category: 'Edit' },
      { id: 'preview', label: 'Toggle Preview', shortcut: 'Ctrl+Shift+P', category: 'View' },
      { id: 'sidebar', label: 'Toggle Sidebar', shortcut: 'Ctrl+B', category: 'View' },
      { id: 'fullscreen', label: 'Toggle Fullscreen', shortcut: 'F11', category: 'View' },
      { id: 'settings', label: 'Open Settings', shortcut: '', category: 'Preferences' },
      { id: 'extensions', label: 'Manage Extensions', shortcut: '', category: 'Preferences' },
      { id: 'export', label: 'Export Project', shortcut: '', category: 'File' },
      { id: 'import', label: 'Import Project', shortcut: '', category: 'File' },
      { id: 'wrap', label: 'Toggle Word Wrap', shortcut: '', category: 'Edit' },
      { id: 'theme', label: 'Change Theme', shortcut: '', category: 'Preferences' },
    ];
    
    // Add extension commands
    const extCommands = ContributionManager.getAllCommands().map(function(cmd) {
      return { id: 'ext:' + cmd.id, label: cmd.title, shortcut: cmd.shortcut || '', category: cmd.category || 'Extension', extCommand: cmd.id };
    });
    
    const allCommands = commands.concat(extCommands);
    const filtered = allCommands.filter(function(c) { return c.label.toLowerCase().includes(cmdQuery); });
    
    if (filtered.length === 0) {
      results.innerHTML = '<div class="cp-empty">No commands found</div>';
      return;
    }
    
    // Group by category
    const categories = {};
    filtered.forEach(function(cmd) {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd);
    });
    
    let html = '';
    let isFirst = true;
    Object.keys(categories).forEach(function(cat) {
      html += '<div class="cp-category">' + cat + '</div>';
      categories[cat].forEach(function(cmd) {
        const onclickFn = cmd.extCommand ? 
          'ContributionManager.executeCommand(\'' + cmd.extCommand + '\');hideQuickSwitcher()' :
          'executeCommandPaletteItem(\'' + cmd.id + '\')';
        html += '<div class="cp-item' + (isFirst ? ' selected' : '') + '" data-cmd="' + cmd.id + '" onclick="' + onclickFn + '">' +
          icon('terminal') +
          '<span>' + cmd.label + '</span>' +
          (cmd.shortcut ? '<span class="cp-item-path">' + cmd.shortcut + '</span>' : '') +
        '</div>';
        isFirst = false;
      });
    });
    results.innerHTML = html;
  } else {
    let files = FS.getAllFiles();
    if (query) {
      const q = query.toLowerCase();
      files = files.filter(function(f) { return f.toLowerCase().includes(q); });
    }
    
    if (files.length === 0) {
      results.innerHTML = '<div class="cp-empty">No files found</div>';
      return;
    }
    
    results.innerHTML = '<div class="cp-category">Files</div>' + files.slice(0, 20).map(function(fp, i) {
      return '<div class="cp-item' + (i === 0 ? ' selected' : '') + '" data-path="' + fp + '" onclick="openFile(\'' + fp.replace(/'/g, "\\'") + '\');hideQuickSwitcher()">' +
        '<span style="color:' + FS.getFileColor(fp) + '">' + Icons[FS.getFileIcon(fp)] + '</span>' +
        '<span>' + FS.getFileName(fp) + '</span>' +
        '<span class="cp-item-path">' + FS.getDir(fp) + '</span>' +
      '</div>';
    }).join('');
  }
}

function executeCommandPaletteItem(cmdId) {
  hideQuickSwitcher();
  switch(cmdId) {
    case 'newFile': createNewFile(); break;
    case 'newFolder': createNewFolder(); break;
    case 'save': saveCurrentFile(); break;
    case 'format': formatCode(); break;
    case 'preview': togglePreview(); break;
    case 'sidebar': toggleSidebar(); break;
    case 'fullscreen': toggleFullscreen(); break;
    case 'settings': openSettings(); break;
    case 'extensions': openExtensions(); break;
    case 'export': exportProject(); break;
    case 'import': importProject(); break;
    case 'wrap': toggleWrap(); break;
    case 'theme': openSettings(); break;
  }
}

document.getElementById('cpInput').addEventListener('input', function() {
  updateCommandPalette(this.value);
});

document.getElementById('cpInput').addEventListener('keydown', function(e) {
  const items = document.querySelectorAll('#cpResults .cp-item');
  let selected = document.querySelector('#cpResults .cp-item.selected');
  const selIndex = selected ? [...items].indexOf(selected) : -1;
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (selIndex < items.length - 1) {
      if (selected) selected.classList.remove('selected');
      items[selIndex + 1].classList.add('selected');
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (selIndex > 0) {
      if (selected) selected.classList.remove('selected');
      items[selIndex - 1].classList.add('selected');
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    selected = document.querySelector('#cpResults .cp-item.selected');
    if (selected) {
      selected.click();
    }
  } else if (e.key === 'Escape') {
    hideQuickSwitcher();
  }
});

// ===== MODALS =====
function showModal(title, bodyHTML, hasFooter, onConfirm) {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modalContent');
  modal.innerHTML = 
    '<div class="modal-header">' +
      '<div class="modal-title">' + title + '</div>' +
      '<button class="modal-close" onclick="closeModal()">' + Icons.close + '</button>' +
    '</div>' +
    '<div class="modal-body">' + bodyHTML + '</div>' +
    (hasFooter ? '<div class="modal-footer">' +
      '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" id="modalConfirmBtn">Confirm</button>' +
    '</div>' : '');
  overlay.classList.add('show');
  if (hasFooter && onConfirm) {
    document.getElementById('modalConfirmBtn').addEventListener('click', function() { onConfirm(); closeModal(); });
  }
}

function showInputModal(title, label, defaultVal, onConfirm) {
  showModal(title, 
    '<div class="form-group">' +
      '<label class="form-label">' + label + '</label>' +
      '<input type="text" class="form-input" id="modalInput" value="' + defaultVal.replace(/"/g, '&quot;') + '">' +
    '</div>',
  true, function() {
    const val = document.getElementById('modalInput').value.trim();
    onConfirm(val);
  });
  setTimeout(function() {
    const input = document.getElementById('modalInput');
    input.focus();
    const dotIdx = defaultVal.lastIndexOf('.');
    input.setSelectionRange(0, dotIdx > 0 ? dotIdx : defaultVal.length);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); const btn = document.getElementById('modalConfirmBtn'); if (btn) btn.click(); }
    });
  }, 50);
}

function showConfirmModal(title, message, onConfirm) {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modalContent');
  modal.innerHTML = 
    '<div class="modal-header">' +
      '<div class="modal-title">' + title + '</div>' +
      '<button class="modal-close" onclick="closeModal()">' + Icons.close + '</button>' +
    '</div>' +
    '<div class="modal-body"><p style="color:var(--text-secondary);font-size:14px;line-height:1.7">' + message + '</p></div>' +
    '<div class="modal-footer">' +
      '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>' +
      '<button class="btn btn-danger" id="modalConfirmBtn">Delete</button>' +
    '</div>';
  overlay.classList.add('show');
  document.getElementById('modalConfirmBtn').addEventListener('click', function() { onConfirm(); closeModal(); });
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ===== SETTINGS =====

function openSettings() {
  const accentColors = ['#58a6ff','#3fb950','#d29922','#f85149','#d2a8ff','#79c0ff','#ff7b72','#a5d6ff','#f778ba','#56d4dd','#ffa657','#7ee787'];

  showModal(t('settings'),
    '<div class="settings-section">' +
      '<div class="settings-section-title">' + t('language') + '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('chooseLanguage') + '</span>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px' + (State.language === 'en' ? ';background:var(--accent);color:#fff;border-color:transparent' : '') + '" onclick="setLanguage(\'en\');openSettings()">' + t('english') + '</button>' +
          '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px' + (State.language === 'ar' ? ';background:var(--accent);color:#fff;border-color:transparent' : '') + '" onclick="setLanguage(\'ar\');openSettings()">' + t('arabic') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="settings-section">' +
      '<div class="settings-section-title">' + t('appearance') + '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('theme') + '</span>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px" onclick="setTheme(\'dark\');openSettings()">' + t('dark') + '</button>' +
          '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px" onclick="setTheme(\'light\');openSettings()">' + t('light') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="settings-row"><span class="settings-row-label">' + t('accentColor') + '</span></div>' +
      '<div class="color-options" style="margin-top:-8px">' +
        accentColors.map(function(c) { return '<div class="color-option' + (State.accentColor === c ? ' active' : '') + '" style="background:' + c + '" onclick="setAccentColor(\'' + c + '\')"></div>'; }).join('') +
      '</div>' +
    '</div>' +

    '<div class="settings-section">' +
      '<div class="settings-section-title">' + t('background') + '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('backgroundImage') + '</span>' +
        '<button class="btn btn-secondary" style="height:28px;font-size:11px" onclick="document.getElementById(\'bgImageInput\').click()">' + t('chooseImage') + '</button>' +
      '</div>' +
      (State.bgImage ?
        '<div class="settings-row">' +
          '<span class="settings-row-label">' + t('current') + '</span>' +
          '<button class="btn btn-secondary" style="height:28px;font-size:11px" onclick="clearBackgroundImage()">' + t('clear') + '</button>' +
        '</div>' : '') +
      '<div class="settings-row"><span class="settings-row-label">' + t('opacity') + '</span><span class="settings-row-value">' + Math.round(State.bgOpacity * 100) + '%</span></div>' +
      '<input type="range" class="form-range" min="0" max="100" value="' + State.bgOpacity * 100 + '" oninput="setBgOpacity(this.value/100)">' +
      '<div class="settings-row"><span class="settings-row-label">' + t('blur') + '</span><span class="settings-row-value">' + State.bgBlur + 'px</span></div>' +
      '<input type="range" class="form-range" min="0" max="30" value="' + State.bgBlur + '" oninput="setBgBlur(this.value)">' +
      '<div class="settings-row"><span class="settings-row-label">' + t('brightness') + '</span><span class="settings-row-value">' + State.bgBrightness + '%</span></div>' +
      '<input type="range" class="form-range" min="20" max="150" value="' + State.bgBrightness + '" oninput="setBgBrightness(this.value)">' +
      '<div class="settings-row"><span class="settings-row-label">' + t('contrast') + '</span><span class="settings-row-value">' + State.bgContrast + '%</span></div>' +
      '<input type="range" class="form-range" min="50" max="150" value="' + State.bgContrast + '" oninput="setBgContrast(this.value)">' +
      '<div class="settings-row"><span class="settings-row-label">' + t('saturation') + '</span><span class="settings-row-value">' + State.bgSaturation + '%</span></div>' +
      '<input type="range" class="form-range" min="0" max="200" value="' + State.bgSaturation + '" oninput="setBgSaturation(this.value)">' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('backgroundSize') + '</span>' +
        '<select class="form-select" style="width:auto;min-width:140px" onchange="setBgSize(this.value)">' +
          '<option value="cover"' + (State.bgSize === 'cover' ? ' selected' : '') + '>' + t('cover') + '</option>' +
          '<option value="contain"' + (State.bgSize === 'contain' ? ' selected' : '') + '>' + t('contain') + '</option>' +
        '</select>' +
      '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('backgroundPosition') + '</span>' +
        '<select class="form-select" style="width:auto;min-width:140px" onchange="setBgPosition(this.value)">' +
          '<option value="center center"' + (State.bgPosition === 'center center' ? ' selected' : '') + '>' + t('center') + '</option>' +
          '<option value="top left"' + (State.bgPosition === 'top left' ? ' selected' : '') + '>' + t('topLeft') + '</option>' +
          '<option value="top right"' + (State.bgPosition === 'top right' ? ' selected' : '') + '>' + t('topRight') + '</option>' +
          '<option value="bottom left"' + (State.bgPosition === 'bottom left' ? ' selected' : '') + '>' + t('bottomLeft') + '</option>' +
          '<option value="bottom right"' + (State.bgPosition === 'bottom right' ? ' selected' : '') + '>' + t('bottomRight') + '</option>' +
        '</select>' +
      '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('backgroundRepeat') + '</span>' +
        '<select class="form-select" style="width:auto;min-width:140px" onchange="setBgRepeat(this.value)">' +
          '<option value="no-repeat"' + (State.bgRepeat === 'no-repeat' ? ' selected' : '') + '>' + t('noRepeat') + '</option>' +
          '<option value="repeat"' + (State.bgRepeat === 'repeat' ? ' selected' : '') + '>' + t('tile') + '</option>' +
        '</select>' +
      '</div>' +
      '<div class="settings-row"><span class="settings-row-label">' + t('atmosphereEffect') + '</span><div class="toggle-btn' + (State.atmosphereEnabled ? ' active' : '') + '" onclick="toggleAtmosphere()"></div></div>' +
    '</div>' +

    '<div class="settings-section">' +
      '<div class="settings-section-title">' + t('editor') + '</div>' +
      '<div class="settings-row"><span class="settings-row-label">' + t('autoSave') + '</span><div class="toggle-btn' + (State.autoSave ? ' active' : '') + '" onclick="toggleAutoSaveFromSettings()"></div></div>' +
      '<div class="settings-row"><span class="settings-row-label">' + t('wordWrap') + '</span><div class="toggle-btn' + (State.wordWrap ? ' active' : '') + '" onclick="toggleWrapFromSettings()"></div></div>' +
      '<div class="settings-row"><span class="settings-row-label">' + t('livePreview') + '</span><div class="toggle-btn' + (State.liveRefresh ? ' active' : '') + '" onclick="toggleLiveRefresh()"></div></div>' +
      '<div class="settings-row"><span class="settings-row-label">' + t('glassBlur') + '</span><span class="settings-row-value">' + State.glassBlur + 'px</span></div>' +
      '<input type="range" class="form-range" min="0" max="30" value="' + State.glassBlur + '" oninput="setGlassBlur(this.value)">' +
    '</div>' +

    '<div class="settings-section">' +
      '<div class="settings-section-title">' + t('project') + '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">' + t('projectName') + '</label>' +
        '<input type="text" class="form-input" id="projectNameInput" value="' + document.getElementById('projectName').textContent + '" onchange="setProjectName(this.value)">' +
      '</div>' +
    '</div>' +

    '<div class="settings-section">' +
      '<div class="settings-section-title">' + t('appInfo') + '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('version') + '</span>' +
        '<span class="settings-row-value">v' + APP_VERSION + '</span>' +
      '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('updateLog') + '</span>' +
        '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px" onclick="openUpdateLog()">' + t('viewHistory') + '</button>' +
      '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('lastUpdate') + '</span>' +
        '<span class="settings-row-value">' + formatUpdateTimestamp((State.updateLog && State.updateLog.length ? State.updateLog[0].time : new Date().toISOString())) + '</span>' +
      '</div>' +
      '<div class="settings-row">' +
        '<span class="settings-row-label">' + t('historyEntries') + '</span>' +
        '<span class="settings-row-value">' + (State.updateLog ? State.updateLog.length : 0) + '</span>' +
      '</div>' +
    '</div>',
  false);
}

function setTheme(theme) {
  State.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  Storage.saveSettings();
  ExtensionAPI.triggerEvent('theme:change', { theme: theme });
}

function setAccentColor(color) {
  State.accentColor = color;
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-muted', color + '22');
  Storage.saveSettings();
  openSettings();
}

function setBgOpacity(val) {
  State.bgOpacity = parseFloat(val);
  document.documentElement.style.setProperty('--bg-opacity', val);
  Storage.saveSettings();
}

function setBgBlur(val) {
  State.bgBlur = parseInt(val);
  document.documentElement.style.setProperty('--bg-blur', val + 'px');
  Storage.saveSettings();
}

function setBgBrightness(val) {
  State.bgBrightness = parseInt(val);
  document.documentElement.style.setProperty('--bg-brightness', val + '%');
  Storage.saveSettings();
}

function setBgContrast(val) {
  State.bgContrast = parseInt(val);
  document.documentElement.style.setProperty('--bg-contrast', val + '%');
  Storage.saveSettings();
}

function setBgSaturation(val) {
  State.bgSaturation = parseInt(val);
  document.documentElement.style.setProperty('--bg-saturation', val + '%');
  Storage.saveSettings();
}

function setBgSize(val) {
  State.bgSize = val;
  document.documentElement.style.setProperty('--bg-size', val);
  Storage.saveSettings();
  applyBackground();
}

function setBgPosition(val) {
  State.bgPosition = val;
  document.documentElement.style.setProperty('--bg-position', val);
  Storage.saveSettings();
  applyBackground();
}

function setBgRepeat(val) {
  State.bgRepeat = val;
  document.documentElement.style.setProperty('--bg-repeat', val);
  Storage.saveSettings();
  applyBackground();
}

function clearBackgroundImage() {
  State.bgImage = null;
  State.bgType = 'default';
  document.getElementById('bgImage').style.backgroundImage = '';
  document.getElementById('bgOverlay').classList.remove('active');
  applyBackground();
  Storage.saveSettings();
  openSettings();
}

document.getElementById('bgImageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function() {
    State.bgImage = reader.result;
    State.bgType = 'custom';
    applyBackground();
    Storage.saveSettings();
    showToast('Background image applied', 'success');
    closeModal();
  };
  reader.readAsDataURL(file);
  this.value = '';
});

function applyBackground() {
  const bgImage = document.getElementById('bgImage');
  const bgOverlay = document.getElementById('bgOverlay');
  
  if (State.bgImage) {
    bgImage.style.backgroundImage = 'url(' + State.bgImage + ')';
    bgOverlay.classList.add('active');
    document.documentElement.style.setProperty('--bg-opacity', State.bgOpacity);
    document.documentElement.style.setProperty('--bg-blur', State.bgBlur + 'px');
    document.documentElement.style.setProperty('--bg-brightness', State.bgBrightness + '%');
    document.documentElement.style.setProperty('--bg-contrast', State.bgContrast + '%');
    document.documentElement.style.setProperty('--bg-saturation', State.bgSaturation + '%');
  } else {
    bgImage.style.backgroundImage = '';
    bgOverlay.classList.remove('active');
  }
}

function setGlassBlur(val) {
  State.glassBlur = parseInt(val);
  document.documentElement.style.setProperty('--glass-blur', val + 'px');
  Storage.saveSettings();
}

function toggleAtmosphere() {
  State.atmosphereEnabled = !State.atmosphereEnabled;
  document.getElementById('bgAtmosphere').style.display = State.atmosphereEnabled ? 'block' : 'none';
  Storage.saveSettings();
  openSettings();
}

function toggleAutoSaveFromSettings() {
  State.autoSave = !State.autoSave;
  document.getElementById('autoSaveLabel').textContent = 'Auto-save: ' + (State.autoSave ? 'On' : 'Off');
  Storage.saveSettings();
  openSettings();
}

function toggleWrapFromSettings() {
  toggleWrap();
  openSettings();
}

function toggleLiveRefresh() {
  State.liveRefresh = !State.liveRefresh;
  Storage.saveSettings();
  openSettings();
}

function setProjectName(name) {
  document.getElementById('projectName').textContent = name || 'Untitled Project';
  Storage.saveProject();
}

// ============================================================
// ===== EXTENSION MANAGER UI =====
// ============================================================
function openExtensions() {
  renderExtensionsList();
}

function renderExtensionsList() {
  const exts = ExtensionRegistry.getAll();
  
  let listHTML = '';
  if (exts.length === 0) {
    listHTML = '<div class="cp-empty" style="padding:40px">' + (State.language === 'ar' ? 'لا توجد إضافات مثبتة. استخدم خيار التثبيت من ملف لإضافة إضافة جديدة.' : 'No extensions installed. Click "Install from File" below to add one.') + '</div>';
  } else {
    listHTML = '<div class="extensions-list">';
    exts.forEach(function(ext) {
      const hasError = ExtensionRegistry.isError(ext.id);
      const status = hasError ? 'error' : (ext.active ? 'active' : 'inactive');
      const statusLabel = hasError ? 'Error' : (ext.active ? 'Active' : 'Inactive');
      const installDate = new Date(ext.installedAt).toLocaleDateString() + ' ' + new Date(ext.installedAt).toLocaleTimeString();
      
      let permHTML = '';
      if (ext.permissions && ext.permissions.length > 0) {
        permHTML = ext.permissions.map(function(p) {
          return '<span class="extension-permission">' + p + '</span>';
        }).join('');
      } else {
        permHTML = '<span class="extension-permission">all</span>';
      }
      
      const firstLetter = ext.name.charAt(0).toUpperCase();
      
      listHTML += '<div class="extension-card' + (hasError ? ' error' : '') + (!ext.active ? ' disabled' : '') + '">' +
        '<div class="extension-icon">' + firstLetter + '</div>' +
        '<div class="extension-info">' +
          '<div class="extension-header">' +
            '<span class="extension-name">' + ext.name + '</span>' +
            '<span class="extension-version">v' + ext.version + '</span>' +
            '<span class="extension-author">by ' + ext.author + '</span>' +
          '</div>' +
          '<div class="extension-desc">' + (ext.description || 'No description provided') + '</div>' +
          '<div class="extension-meta">' +
            '<span class="extension-status ' + status + '">' + statusLabel + '</span>' +
            '<div class="extension-permissions">' + permHTML + '</div>' +
            '<span class="extension-install-date">Installed: ' + installDate + '</span>' +
          '</div>' +
          (hasError ? '<div style="margin-top:6px;font-size:11px;color:var(--danger)">Error: ' + ext.error + '</div>' : '') +
          '<div class="extension-actions">' +
            '<button class="extension-action-btn ' + (ext.active ? 'secondary' : 'primary') + '" onclick="toggleExtension(\'' + ext.id + '\')">' +
              (ext.active ? icon('power', 12, 12) + ' Disable' : icon('power', 12, 12) + ' Enable') +
            '</button>' +
            '<button class="extension-action-btn secondary" onclick="showExtensionSettings(\'' + ext.id + '\')">' +
              icon('settings', 12, 12) + ' Settings' +
            '</button>' +
            '<button class="extension-action-btn secondary" onclick="showExtensionLogs(\'' + ext.id + '\')">' +
              icon('list', 12, 12) + ' Logs' +
            '</button>' +
            '<button class="extension-action-btn danger" onclick="confirmRemoveExtension(\'' + ext.id + '\')">' +
              icon('trash', 12, 12) + ' Remove' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    listHTML += '</div>';
  }
  
  showModal('Extensions', 
    '<div class="settings-section">' +
      '<div class="settings-section-title">Installed Extensions (' + exts.length + ')</div>' +
      listHTML +
    '</div>' +
    '<div class="settings-section">' +
      '<div class="settings-section-title">Install Extension</div>' +
      '<button class="btn btn-primary" style="width:100%;justify-content:center" onclick="document.getElementById(\'extensionInput\').click()">' +
        icon('upload', 16, 16) + ' Import Extension' +
      '</button>' +
      '<p style="font-size:11px;color:var(--text-tertiary);margin-top:10px;text-align:center">' +
        'Supported formats: .json, .joce-ext, .js (extension package with manifest and code)' +
      '</p>' +
    '</div>',
  false);
}

function toggleExtension(extId) {
  const ext = ExtensionRegistry.get(extId);
  if (!ext) return;
  
  if (ext.active) {
    ExtensionRegistry.disable(extId);
    showToast('Extension disabled', 'info');
  } else {
    ExtensionRegistry.enable(extId);
    showToast('Extension enabled', 'success');
  }
  renderExtensionsList();
}

function confirmRemoveExtension(extId) {
  const ext = ExtensionRegistry.get(extId);
  if (!ext) return;
  
  showConfirmModal('Remove Extension', 'Are you sure you want to remove "' + ext.name + '"? This will deactivate it and delete all its data.', function() {
    ExtensionRegistry.uninstall(extId);
    renderExtensionsList();
  });
}

function showExtensionSettings(extId) {
  const ext = ExtensionRegistry.get(extId);
  if (!ext) return;
  
  const schema = ext.settingsSchema || [];
  const currentSettings = ExtensionSettings.get(extId);
  
  let settingsHTML = '';
  if (schema.length === 0) {
    settingsHTML = '<div class="cp-empty" style="padding:30px">This extension has no configurable settings.</div>';
  } else {
    settingsHTML = '<div class="extension-settings-list">';
    schema.forEach(function(setting) {
      const value = currentSettings[setting.id] !== undefined ? currentSettings[setting.id] : setting.default;
      
      let controlHTML = '';
      if (setting.type === 'boolean') {
        controlHTML = '<div class="toggle-btn' + (value ? ' active' : '') + '" onclick="toggleExtensionSetting(\'' + extId + '\', \'' + setting.id + '\', this)"></div>';
      } else if (setting.type === 'string') {
        controlHTML = '<input type="text" class="form-input" style="width:200px" value="' + (value || '') + '" onchange="setExtensionSetting(\'' + extId + '\', \'' + setting.id + '\', this.value)">';
      } else if (setting.type === 'number') {
        controlHTML = '<input type="number" class="form-input" style="width:100px" value="' + (value || 0) + '" onchange="setExtensionSetting(\'' + extId + '\', \'' + setting.id + '\', this.value)">';
      } else if (setting.type === 'select') {
        const options = (setting.options || []).map(function(opt) {
          return '<option value="' + opt.value + '"' + (value === opt.value ? ' selected' : '') + '>' + opt.label + '</option>';
        }).join('');
        controlHTML = '<select class="form-select" style="width:200px" onchange="setExtensionSetting(\'' + extId + '\', \'' + setting.id + '\', this.value)">' + options + '</select>';
      } else if (setting.type === 'color') {
        controlHTML = '<input type="color" style="width:40px;height:30px;border:none;background:none;cursor:pointer" value="' + (value || '#58a6ff') + '" onchange="setExtensionSetting(\'' + extId + '\', \'' + setting.id + '\', this.value)">';
      }
      
      settingsHTML += '<div class="extension-setting-row">' +
        '<div>' +
          '<div class="extension-setting-label">' + setting.label + '</div>' +
          (setting.description ? '<div class="extension-setting-desc">' + setting.description + '</div>' : '') +
        '</div>' +
        '<div class="extension-setting-control">' + controlHTML + '</div>' +
      '</div>';
    });
    settingsHTML += '</div>';
  }
  
  showModal(ext.name + ' - Settings', settingsHTML, false);
}

function toggleExtensionSetting(extId, settingId, toggleEl) {
  const current = ExtensionSettings.getValue(extId, settingId, false);
  ExtensionSettings.setValue(extId, settingId, !current);
  toggleEl.classList.toggle('active');
  
  // Notify extension of setting change
  ExtensionAPI.triggerEvent('setting:change', { extensionId: extId, settingId: settingId, value: !current });
}

function setExtensionSetting(extId, settingId, value) {
  ExtensionSettings.setValue(extId, settingId, value);
  ExtensionAPI.triggerEvent('setting:change', { extensionId: extId, settingId: settingId, value: value });
}

function showExtensionLogs(extId) {
  const ext = ExtensionRegistry.get(extId);
  if (!ext) return;
  
  const logs = ExtensionLogger.getLogs(extId);
  
  let logsHTML = '';
  if (logs.length === 0) {
    logsHTML = '<div class="cp-empty" style="padding:30px">No logs recorded for this extension.</div>';
  } else {
    logsHTML = '<div class="extension-logs">';
    logs.slice().reverse().forEach(function(entry) {
      const time = new Date(entry.time).toLocaleTimeString();
      logsHTML += '<div class="extension-log-entry">' +
        '<span class="extension-log-time">' + time + '</span>' +
        '<span class="extension-log-level ' + entry.level + '">' + entry.level + '</span>' +
        '<span class="extension-log-msg">' + entry.message + '</span>' +
      '</div>';
    });
    logsHTML += '</div>';
  }
  
  showModal(ext.name + ' - Logs', 
    logsHTML +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
      '<button class="btn btn-secondary" onclick="clearExtensionLogs(\'' + extId + '\')">Clear Logs</button>' +
      '<button class="btn btn-secondary" onclick="showExtensionLogs(\'' + extId + '\')">Refresh</button>' +
    '</div>',
  false);
}

function clearExtensionLogs(extId) {
  ExtensionLogger.clear(extId);
  showExtensionLogs(extId);
}

// ===== EXTENSION IMPORT HANDLER =====
document.getElementById('extensionInput').addEventListener('change', async function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const content = await file.text();
    let manifest = null;
    let code = null;
    
    // Try to parse as JSON first (supports .json and .joce-ext)
    try {
      const parsed = JSON.parse(content);
      
      // Check if it's a direct manifest or a package format
      if (parsed.manifest) {
        // Package format: { manifest: {...}, code: "..." }
        manifest = parsed.manifest;
        code = parsed.code || null;
      } else if (parsed.id && parsed.name) {
        // Direct manifest format
        manifest = parsed;
        code = parsed.code || null;
      } else {
        throw new Error('Invalid extension format: missing required fields (id, name)');
      }
    } catch(jsonErr) {
      // If JSON parse fails, try to parse as JS module
      // JS format: the file contains a comment block with JSON metadata followed by code
      const manifestMatch = content.match(/\/\*\s*@joce-extension\s*([\s\S]*?)\*\//);
      if (manifestMatch) {
        try {
          manifest = JSON.parse(manifestMatch[1]);
          code = content;
        } catch(e2) {
          throw new Error('Failed to parse extension manifest from JS comment: ' + e2.message);
        }
      } else {
        throw new Error('Could not parse extension file. Expected JSON manifest, .joce-ext package, or JS file with @joce-extension comment.\n\nJSON parse error: ' + jsonErr.message);
      }
    }
    
    // Install the extension
    const result = ExtensionRegistry.install(manifest, code);
    
    if (!result.success) {
      // Show validation errors in a modal
      let errorHTML = '<div class="extension-errors">' +
        '<div class="extension-error-title">Validation Errors (' + result.errors.length + ')</div>' +
        '<ul class="extension-error-list">';
      result.errors.forEach(function(err) {
        errorHTML += '<li>' + err + '</li>';
      });
      errorHTML += '</ul></div>';
      
      if (result.warnings && result.warnings.length > 0) {
        errorHTML += '<div class="extension-warnings">' +
          '<div class="extension-warning-title">Warnings (' + result.warnings.length + ')</div>' +
          '<ul class="extension-warning-list">';
        result.warnings.forEach(function(warn) {
          errorHTML += '<li>' + warn + '</li>';
        });
        errorHTML += '</ul></div>';
      }
      
      showModal('Extension Installation Failed', errorHTML, false);
      showToast('Extension validation failed', 'error');
    } else {
      showToast('Extension "' + manifest.name + '" installed successfully', 'success');
      
      if (result.warnings && result.warnings.length > 0) {
        let warnHTML = '<div class="extension-warnings">' +
          '<div class="extension-warning-title">Warnings</div>' +
          '<ul class="extension-warning-list">';
        result.warnings.forEach(function(warn) {
          warnHTML += '<li>' + warn + '</li>';
        });
        warnHTML += '</ul></div>' +
        '<p style="margin-top:12px;color:var(--text-secondary)">The extension was installed successfully but has some warnings.</p>';
        
        showModal('Extension Installed with Warnings', warnHTML, false);
      }
      
      renderExtensionsList();
    }
  } catch(err) {
    showToast('Failed to load extension: ' + err.message, 'error');
    console.error('Extension load error:', err);
    
    showModal('Extension Load Error', 
      '<div class="extension-errors">' +
        '<div class="extension-error-title">Error</div>' +
        '<ul class="extension-error-list"><li>' + err.message + '</li></ul>' +
      '</div>',
    false);
  }
  
  this.value = '';
});

// ===== EDITOR HANDLING =====
const textarea = document.getElementById('codeTextarea');
const highlight = document.getElementById('codeHighlight');
const lineNumbers = document.getElementById('lineNumbers');

textarea.addEventListener('input', function() {
  updateHighlight();
  if (State.autoSave) {
    saveEditorState();
  } else {
    if (State.activeTab && State.files[State.activeTab]) {
      const fileData = State.files[State.activeTab];
      if (fileData.content !== this.value) {
        fileData.content = this.value;
        fileData.modified = this.value !== fileData.original;
        UI.renderTabs();
        UI.renderFileTree();
      }
    }
  }
  schedulePreview();
  
  if (State.activeTab) {
    const lang = FS.getLang(State.activeTab);
    const rect = this.getBoundingClientRect();
    const suggestions = Suggestions.getSuggestions(this.value, this.selectionStart, lang);
    if (suggestions.length > 0) {
      const pos = getCaretCoordinates(this, this.selectionStart);
      Suggestions.show(suggestions, rect.left + pos.left, rect.top + pos.top);
    } else {
      Suggestions.hide();
    }
  }
});

textarea.addEventListener('keydown', function(e) {
  if (State.suggestions.visible) {
    if (e.key === 'ArrowDown') { e.preventDefault(); Suggestions.navigate(1); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); Suggestions.navigate(-1); return; }
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); Suggestions.accept(); return; }
    if (e.key === 'Escape') { Suggestions.hide(); return; }
  }
  
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    if (e.shiftKey) {
      const lineStart = this.value.lastIndexOf('\n', start - 1) + 1;
      if (this.value.substring(lineStart, lineStart + 2) === '  ') {
        this.value = this.value.substring(0, lineStart) + this.value.substring(lineStart + 2);
        this.selectionStart = this.selectionEnd = start - 2;
      }
    } else {
      this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
    }
    this.dispatchEvent(new Event('input'));
  }
  
  const pairs = { '(':')', '{':'}', '[':']', '"':'"', "'":"'", '`':'`', '<':'>' };
  if (pairs[e.key] && !e.ctrlKey && !e.metaKey) {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    if (start !== end) {
      e.preventDefault();
      const selected = this.value.substring(start, end);
      this.value = this.value.substring(0, start) + e.key + selected + pairs[e.key] + this.value.substring(end);
      this.selectionStart = start + 1;
      this.selectionEnd = end + 1;
      this.dispatchEvent(new Event('input'));
    }
  }
  
  if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
    const start = this.selectionStart;
    const lineStart = this.value.lastIndexOf('\n', start - 1) + 1;
    const line = this.value.substring(lineStart, start);
    const indent = line.match(/^\s*/)[0];
    const lastChar = line.trim().slice(-1);
    
    if (['{', '(', '[', '>'].includes(lastChar)) {
      e.preventDefault();
      const extraIndent = indent + '  ';
      this.value = this.value.substring(0, start) + '\n' + extraIndent + this.value.substring(start);
      this.selectionStart = this.selectionEnd = start + 1 + extraIndent.length;
      this.dispatchEvent(new Event('input'));
    } else if (indent.length > 0) {
      e.preventDefault();
      this.value = this.value.substring(0, start) + '\n' + indent + this.value.substring(start);
      this.selectionStart = this.selectionEnd = start + 1 + indent.length;
      this.dispatchEvent(new Event('input'));
    }
  }
});

textarea.addEventListener('scroll', function() {
  const st = this.scrollTop;
  const sl = this.scrollLeft;
  highlight.style.transform = 'translate(' + (-sl) + 'px, ' + (-st) + 'px)';
  lineNumbers.style.transform = 'translateY(' + (-st) + 'px)';
});

textarea.addEventListener('click', function() { 
  UI.updateCursorPosition(); 
  Suggestions.hide();
});
textarea.addEventListener('keyup', function(e) { 
  if (!['ArrowUp', 'ArrowDown', 'Enter', 'Tab'].includes(e.key)) {
    UI.updateCursorPosition();
  }
});
textarea.addEventListener('blur', function() { Suggestions.hide(); });

function getCaretCoordinates(element, position) {
  const text = element.value.substring(0, position);
  const lines = text.split('\n');
  const lineNumber = lines.length;
  const column = lines[lines.length - 1].length;
  return { top: (lineNumber - 1) * 22, left: column * 7.8 };
}

function updateHighlight() {
  if (!State.activeTab) return;
  const lang = FS.getLang(State.activeTab);
  const code = textarea.value;
  highlight.innerHTML = Syntax.highlight(code, lang) + '\n';
  const lines = code.split('\n');
  lineNumbers.innerHTML = lines.map(function(_, i) { return '<div class="line-number">' + (i+1) + '</div>'; }).join('');
  syncEditorScroll();
}

function syncEditorScroll() {
  const top = textarea.scrollTop || 0;
  const left = textarea.scrollLeft || 0;
  highlight.style.transform = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0)';
  lineNumbers.style.transform = 'translate3d(0,' + (-top) + 'px,0)';
}

function formatCode() {
  if (!State.activeTab) return;
  const lang = FS.getLang(State.activeTab);
  let code = textarea.value;
  try {
    if (lang === 'json') {
      code = JSON.stringify(JSON.parse(code), null, 2);
    } else if (lang === 'html' || lang === 'svg' || lang === 'xml') {
      code = formatHTML(code);
    } else if (lang === 'css') {
      code = formatCSS(code);
    }
    textarea.value = code;
    textarea.dispatchEvent(new Event('input'));
    showToast('Code formatted', 'success');
  } catch(err) {
    showToast('Format error: ' + err.message, 'error');
  }
}

function formatHTML(html) {
  let formatted = '';
  let indent = 0;
  const lines = html.replace(/>\s*</g, '>\n<').split('\n');
  const voidElements = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr','!doctype'];
  lines.forEach(function(line) {
    line = line.trim();
    if (!line) return;
    if (line.match(/^<\//)) indent = Math.max(0, indent - 1);
    formatted += '  '.repeat(indent) + line + '\n';
    if (line.match(/^<[^/!?]/) && !line.match(/\/>$/) && !voidElements.some(function(t) { return line.toLowerCase().startsWith('<' + t); })) {
      if (!line.match(/<\/[^>]+>$/)) indent++;
    }
  });
  return formatted.trim();
}

function formatCSS(css) {
  return css
    .replace(/\{/g, ' {\n  ')
    .replace(/\}/g, '\n}\n\n')
    .replace(/;/g, ';\n  ')
    .replace(/\n\s*\n/g, '\n')
    .replace(/  \n\}/g, '\n}')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function toggleWrap() {
  State.wordWrap = !State.wordWrap;
  textarea.classList.toggle('wrap', State.wordWrap);
  highlight.classList.toggle('wrap', State.wordWrap);
  document.getElementById('toggleWrapBtn').classList.toggle('active', State.wordWrap);
  Storage.saveSettings();
}

function toggleAutoSave() {
  State.autoSave = !State.autoSave;
  document.getElementById('autoSaveLabel').textContent = 'Auto-save: ' + (State.autoSave ? 'On' : 'Off');
  Storage.saveSettings();
  showToast('Auto-save ' + (State.autoSave ? 'enabled' : 'disabled'), 'info');
}

// ===== FULLSCREEN =====
function toggleFullscreen() {
  State.fullscreen = !State.fullscreen;
  document.getElementById('app').classList.toggle('fullscreen-mode', State.fullscreen);
  if (State.fullscreen) {
    showToast('Press Esc to exit fullscreen', 'info');
  }
}

// ===== SIDEBAR =====
function toggleSidebar() {
  State.sidebarVisible = !State.sidebarVisible;
  document.getElementById('sidebar').classList.toggle('collapsed', !State.sidebarVisible);
}

function refreshFileTree() {
  UI.renderFileTree();
  showToast('File tree refreshed', 'info');
}

function collapseAllFolders() {
  State.expandedFolders.clear();
  UI.renderFileTree();
  Storage.saveProject();
}

// ===== RESIZE HANDLE =====
const resizeHandle = document.getElementById('resizeHandle');
let isResizing = false;

resizeHandle.addEventListener('mousedown', function(e) {
  isResizing = true;
  resizeHandle.classList.add('active');
  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
});

function onResize(e) {
  if (!isResizing) return;
  const sidebar = document.getElementById('sidebar');
  const newWidth = Math.max(200, Math.min(500, e.clientX));
  sidebar.style.width = newWidth + 'px';
}

function stopResize() {
  isResizing = false;
  resizeHandle.classList.remove('active');
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
}

// ===== PREVIEW RESIZE =====
let previewResizing = false;
const previewPanel = document.getElementById('previewPanel');

previewPanel.addEventListener('mousedown', function(e) {
  if (e.offsetX < 6) {
    previewResizing = true;
    document.addEventListener('mousemove', onPreviewResize);
    document.addEventListener('mouseup', function() {
      previewResizing = false;
      document.removeEventListener('mousemove', onPreviewResize);
    });
  }
});

function onPreviewResize(e) {
  if (!previewResizing) return;
  const container = document.getElementById('editorContainer');
  const rect = container.getBoundingClientRect();
  const width = rect.right - e.clientX;
  previewPanel.style.width = Math.max(200, Math.min(rect.width - 250, width)) + 'px';
}

// ===== DRAG & DROP =====
const dropZone = document.getElementById('dropZone');
let dragCounter = 0;

document.addEventListener('dragenter', function(e) {
  e.preventDefault();
  if (e.dataTransfer.types.includes('Files')) {
    dragCounter++;
    dropZone.classList.add('show');
  }
});

document.addEventListener('dragleave', function(e) {
  e.preventDefault();
  dragCounter--;
  if (dragCounter <= 0) {
    dragCounter = 0;
    dropZone.classList.remove('show');
  }
});

document.addEventListener('dragover', function(e) { e.preventDefault(); });

document.addEventListener('drop', async function(e) {
  e.preventDefault();
  dragCounter = 0;
  dropZone.classList.remove('show');
  if (!e.dataTransfer.items) return;

  const items = [...e.dataTransfer.items];
  let fileCount = 0;
  
  for (const item of items) {
    if (item.kind !== 'file') continue;
    const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
    if (entry) {
      await processEntry(entry, '');
      fileCount++;
    } else {
      const file = item.getAsFile();
      if (file) {
        const content = await file.text().catch(function() { return ''; });
        FS.createFile(file.name, content);
        fileCount++;
      }
    }
  }
  
  UI.renderFileTree();
  if (fileCount > 0) showToast(fileCount + ' item(s) imported', 'success');
});

async function processEntry(entry, path) {
  if (entry.isFile) {
    return new Promise(function(resolve) {
      entry.file(async function(file) {
        const content = await file.text().catch(function() { return ''; });
        const fullPath = path ? path + '/' + file.name : file.name;
        FS.createFile(fullPath, content);
        resolve();
      });
    });
  } else if (entry.isDirectory) {
    const dirPath = path ? path + '/' + entry.name : entry.name;
    FS.createFolder(dirPath);
    State.expandedFolders.add(dirPath);
    const reader = entry.createReader();
    return new Promise(function(resolve) {
      const readAll = function(entries) {
        reader.readEntries(async function(newEntries) {
          if (newEntries.length > 0) {
            entries.push(...newEntries);
            readAll(entries);
          } else {
            for (const e of entries) {
              await processEntry(e, dirPath);
            }
            resolve();
          }
        });
      };
      readAll([]);
    });
  }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
  const ctrl = e.ctrlKey || e.metaKey;

  // Check extension keybindings first
  if (!ctrl && !e.altKey) {
    const key = e.key.toLowerCase();
    const binding = ContributionManager.contributions.keybindings.find(function(k) {
      return k.key.toLowerCase() === key;
    });
    if (binding) {
      e.preventDefault();
      ContributionManager.executeCommand(binding.command);
      return;
    }
  }

  if (ctrl && e.key === 's') {
    e.preventDefault();
    saveCurrentFile();
  }
  if (ctrl && e.key === 'n') {
    e.preventDefault();
    createNewFile(State.selectedItem && State.folders.has(State.selectedItem) ? State.selectedItem : undefined);
  }
  if (ctrl && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
    e.preventDefault();
    togglePreview();
  }
  if (ctrl && e.key === 'p') {
    e.preventDefault();
    showQuickSwitcher();
  }
  if (ctrl && e.key === 'b') {
    e.preventDefault();
    toggleSidebar();
  }
  if (ctrl && e.key === 'k') {
    e.preventDefault();
    showQuickSwitcher();
  }
  if (ctrl && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
    e.preventDefault();
    toggleSearchPanel();
  }
  if (e.key === 'F2' && State.selectedItem) {
    e.preventDefault();
    renameItem(State.selectedItem);
  }
  if (e.key === 'Delete' && State.selectedItem && document.activeElement !== textarea) {
    e.preventDefault();
    deleteItem(State.selectedItem);
  }
  if (e.key === 'F11') {
    e.preventDefault();
    toggleFullscreen();
  }
  if (e.key === 'Escape') {
    hideContextMenu();
    hideQuickSwitcher();
    closeModal();
    Suggestions.hide();
    if (State.fullscreen) toggleFullscreen();
  }
});

document.addEventListener('click', function(e) {
  if (!e.target.closest('.context-menu')) hideContextMenu();
  if (!e.target.closest('.command-palette') && !e.target.closest('.toolbar-btn')) hideQuickSwitcher();
  if (!e.target.closest('.suggestions-popup') && !e.target.closest('.code-textarea')) Suggestions.hide();
});

// ===== TOAST SYSTEM =====
function showToast(message, type) {
  type = type || 'success';
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  const iconMap = {
    success: Icons.check,
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    error: Icons.close,
    info: Icons.info
  };
  toast.innerHTML = '<span class="toast-icon ' + type + '">' + (iconMap[type] || iconMap.info) + '</span><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.classList.add('out');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}

// ===== INITIALIZATION =====
function initDefaultProject() {
  Storage.loadSettings();
  Storage.loadProject();
  
  // Apply settings
  if (State.theme) document.documentElement.setAttribute('data-theme', State.theme);
  if (State.accentColor) {
    document.documentElement.style.setProperty('--accent', State.accentColor);
    document.documentElement.style.setProperty('--accent-muted', State.accentColor + '22');
  }
  document.documentElement.style.setProperty('--glass-blur', State.glassBlur + 'px');
  document.getElementById('bgAtmosphere').style.display = State.atmosphereEnabled ? 'block' : 'none';
  document.getElementById('autoSaveLabel').textContent = 'Auto-save: ' + (State.autoSave ? 'On' : 'Off');
  
  if (State.wordWrap) {
    textarea.classList.add('wrap');
    highlight.classList.add('wrap');
    document.getElementById('toggleWrapBtn').classList.add('active');
  }
  
  applyBackground();
  
  // If no files, create default project
  if (Object.keys(State.files).length === 0) {
    FS.createFile('index.html', '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="container">\n    <header class="header">\n      <h1>Welcome to JOCE IDE</h1>\n      <p>JO Code Editor - Professional browser-based development</p>\n    </header>\n    <main class="content">\n      <div class="card">\n        <h2>Getting Started</h2>\n        <p>Edit this file and watch the preview update in real time.</p>\n        <button id="demoBtn" class="btn">Click Me</button>\n        <p id="output" class="output"></p>\n      </div>\n      <div class="card">\n        <h2>Features</h2>\n        <ul>\n          <li>Multi-file project support</li>\n          <li>Live preview</li>\n          <li>Syntax highlighting</li>\n          <li>Code suggestions</li>\n          <li>Real extension system</li>\n          <li>Offline support</li>\n          <li>Custom backgrounds</li>\n        </ul>\n      </div>\n    </main>\n    <footer class="footer">\n      <p>Built with JOCE IDE</p>\n    </footer>\n  </div>\n  <script src="script.js"><\/script>\n</body>\n</html>');

    FS.createFile('style.css', '/* JOCE IDE Default Styles */\n\n:root {\n  --primary: #58a6ff;\n  --bg: #0d1117;\n  --surface: #161b22;\n  --border: #30363d;\n  --text: #e6edf3;\n  --text-muted: #8b949e;\n}\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', system-ui, sans-serif;\n  background: var(--bg);\n  color: var(--text);\n  min-height: 100vh;\n  line-height: 1.6;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 40px 20px;\n}\n\n.header {\n  text-align: center;\n  margin-bottom: 40px;\n}\n\n.header h1 {\n  font-size: 2.5em;\n  background: linear-gradient(135deg, var(--primary), #d2a8ff);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  margin-bottom: 8px;\n}\n\n.header p {\n  color: var(--text-muted);\n  font-size: 1.1em;\n}\n\n.content {\n  display: grid;\n  gap: 20px;\n}\n\n.card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 12px;\n  padding: 24px;\n}\n\n.card h2 {\n  font-size: 1.3em;\n  margin-bottom: 12px;\n}\n\n.card p {\n  color: var(--text-muted);\n  margin-bottom: 16px;\n}\n\n.card ul {\n  list-style: none;\n}\n\n.card ul li {\n  padding: 8px 0;\n  color: var(--text-muted);\n  border-bottom: 1px solid var(--border);\n}\n\n.card ul li:last-child {\n  border-bottom: none;\n}\n\n.card ul li::before {\n  content: "\\2192";\n  color: var(--primary);\n  margin-right: 10px;\n}\n\n.btn {\n  background: var(--primary);\n  color: #fff;\n  border: none;\n  padding: 12px 28px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n\n.btn:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(88, 166, 255, 0.3);\n}\n\n.output {\n  margin-top: 16px;\n  padding: 16px;\n  background: var(--bg);\n  border-radius: 8px;\n  font-family: \'SF Mono\', monospace;\n  min-height: 24px;\n  border: 1px solid var(--border);\n}\n\n.footer {\n  text-align: center;\n  margin-top: 40px;\n  padding-top: 20px;\n  border-top: 1px solid var(--border);\n  color: var(--text-muted);\n  font-size: 13px;\n}');

    FS.createFile('script.js', '// JOCE IDE - JavaScript\n// Edit this file to add interactivity\n\ndocument.addEventListener(\'DOMContentLoaded\', () => {\n  const btn = document.getElementById(\'demoBtn\');\n  const output = document.getElementById(\'output\');\n  let clickCount = 0;\n\n  btn.addEventListener(\'click\', () => {\n    clickCount++;\n    const messages = [\n      \'Hello from JOCE IDE!\',\n      \'You clicked \' + clickCount + \' times!\',\n      \'The preview updates in real time.\',\n      \'Try editing the CSS too!\',\n      \'Build something amazing!\',\n      \'Check out the extension system!\',\n      \'Your code is saved locally.\'\n    ];\n    const msg = messages[Math.min(clickCount - 1, messages.length - 1)];\n    output.textContent = msg;\n    output.style.color = \'#58a6ff\';\n  });\n\n  console.log(\'JOCE IDE project loaded!\');\n});');

    FS.createFolder('assets');
    FS.createFolder('components');

    FS.createFile('README.md', '# My Project\n\nThis project was created with **JOCE IDE** (JO Code Editor).\n\n## Features\n\n- Real-time preview\n- Syntax highlighting\n- Code suggestions\n- Extension support\n- Offline-capable\n- Custom backgrounds\n\n## Getting Started\n\nEdit any file and the preview will update automatically.\n\n## Files\n\n- `index.html` - Main HTML file\n- `style.css` - Stylesheet\n- `script.js` - JavaScript\n- `components/` - Reusable components\n- `assets/` - Static assets\n');

    State.expandedFolders.add('components');
    document.getElementById('projectName').textContent = 'My Project';
  }
  
  // Reinstall saved extensions
  if (State.extensions && State.extensions.length > 0) {
    State.extensions.forEach(function(savedExt) {
      // We can't re-execute code from saved state (code isn't persisted)
      // But we keep the metadata so they appear in the manager
      if (savedExt.enabled) {
        ExtensionLogger.info(savedExt.id, 'Extension metadata loaded (code not persisted across sessions)');
      }
    });
  }
}

// ===== FIRST-RUN CONSENT & LEGAL GATE =====
function getConsentRecord() {
  return Storage.get('consentRecord', null);
}

function getConsentPermissions() {
  const isAr = State.language === 'ar';
  return [
    isAr ? 'الملفات والمجلدات المحلية للمشروع' : 'Local project files and folders',
    isAr ? 'حالة مساحة العمل وعلامات التبويب والجلسات' : 'Workspace state, tabs, and sessions',
    isAr ? 'إعدادات التطبيق واللغة والثيم والخلفيات' : 'App settings, language, themes, and backgrounds',
    isAr ? 'تثبيت الإضافات المحلية وتشغيلها' : 'Local extension installation and execution',
    isAr ? 'سجل التحديثات المحلي وسجل التشخيص المحلي' : 'Local update history and diagnostic logs',
    isAr ? 'الحافظة والإشعارات إذا سمح المستخدم' : 'Clipboard and notifications when permitted',
    isAr ? 'لا يوجد تتبع عبر الأجهزة ولا مزامنة سحابية' : 'No cross-device tracking or cloud sync'
  ];
}

function buildConsentListHtml() {
  return getConsentPermissions().map(function (item) {
    return '<li>' + Syntax.escapeHtml(item) + '</li>';
  }).join('');
}

function openTermsOfUse() {
  const isAr = State.language === 'ar';
  const body = isAr ?
    '<div class="legal-doc"><p>شروط الاستخدام الخاصة بـ JOCE IDE تعتمد على العمل المحلي فقط. باستخدام التطبيق أنت توافق على أن البيانات تُحفظ على جهازك، وأن ميزات المطور تظل محلية وآمنة، وأنك مسؤول عن المحتوى الذي تضيفه لمشروعاتك وإضافاتك.</p><ul><li>يجب قبول سياسة الخصوصية قبل بدء الاستخدام.</li><li>لا يتم جمع بيانات شخصية أو تتبع بين الأجهزة.</li><li>ميزات المطور متاحة فقط على الجهاز الذي يختارها محليًا.</li><li>يجب منح الأذونات بوضوح قبل استخدام أي ميزة محلية حساسة.</li></ul></div>' :
    '<div class="legal-doc"><p>JOCE IDE is an offline-first local application. By using it, you agree that your projects, settings, and logs are stored on your device, and that developer features remain local and transparent.</p><ul><li>Privacy Policy acceptance is required before startup.</li><li>No personal data is collected across devices.</li><li>The Developer Center is local-only and device-bound by consent.</li><li>Permissions must be granted explicitly for sensitive local features.</li></ul></div>';
  showModal(isAr ? 'شروط الاستخدام' : 'Terms of Use', body, false);
}

function openPrivacyPolicy() {
  const isAr = State.language === 'ar';
  const body = isAr ?
    '<div class="legal-doc"><p>سياسة الخصوصية: JOCE IDE لا يرسل بياناتك إلى أي خادم افتراضيًا. تتم المعالجة والحفظ محليًا داخل المتصفح أو داخل ملفات المشروع فقط.</p><ul><li>تُحفظ الإعدادات محليًا.</li><li>تُحفظ المشروعات محليًا.</li><li>تُحفظ الموافقات وسجل التحديثات محليًا.</li><li>لا يوجد بيع لبيانات المستخدم.</li><li>لا يوجد تتبع سلوكي أو مراقبة بين الأجهزة.</li></ul></div>' :
    '<div class="legal-doc"><p>Privacy Policy: JOCE IDE is local-first and does not send your data anywhere by default. Projects, settings, and logs stay on your device.</p><ul><li>Settings are stored locally.</li><li>Projects are stored locally.</li><li>Consent and update logs are stored locally.</li><li>No data is sold.</li><li>No cross-device behavioral tracking.</li></ul></div>';
  showModal(isAr ? 'سياسة الخصوصية' : 'Privacy Policy', body, false);
}

function openPermissionsOverview() {
  const title = State.language === 'ar' ? 'الأذونات والصلاحيات' : 'Permissions and Capabilities';
  showModal(title,
    '<div class="legal-doc">' +
      '<p>' + (State.language === 'ar' ? 'هذه هي الأذونات التي قد يطلبها التطبيق بشكل محلي وشفاف:' : 'These are the permissions the app may request locally and transparently:') + '</p>' +
      '<ul>' + buildConsentListHtml() + '</ul>' +
    '</div>', false);
}

function storeConsentRecord() {
  Storage.set('consentRecord', {
    accepted: true,
    version: APP_VERSION,
    termsVersion: APP_VERSION,
    acceptedAt: new Date().toISOString(),
    permissions: getConsentPermissions()
  });
}

function startJOCEApplication() {
  initDefaultProject();
  UI.renderFileTree();
  UI.renderExtensionContributions();
  updateLocalizedUI();

  if (State.activeTab && State.files[State.activeTab]) {
    openFile(State.activeTab);
  } else if (State.files['index.html']) {
    openFile('index.html');
  }
}

function showFirstRunConsentGate() {
  const isAr = State.language === 'ar';
  const html =
    '<div class="legal-doc">' +
      '<p style="margin-bottom:12px">' + (isAr ? 'قبل بدء الاستخدام، يجب الموافقة على شروط الاستخدام وسياسة الخصوصية. كل ما يخص المشروع والإعدادات والإضافات وغرفة المطور يبقى محليًا على جهازك.' : 'Before starting, you must accept the Terms of Use and Privacy Policy. Projects, settings, extensions, and the Developer Center remain local to your device.') + '</p>' +
      '<div style="margin:14px 0 16px;padding:12px;border:1px solid var(--border-primary);border-radius:12px;background:var(--bg-primary)">' +
        '<div style="font-weight:700;margin-bottom:8px">' + (isAr ? 'الأذونات التي قد يستخدمها التطبيق' : 'Permissions the app may use') + '</div>' +
        '<ul style="margin:0;padding-left:18px;line-height:1.8">' + buildConsentListHtml() + '</ul>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<button class="btn btn-secondary" type="button" onclick="openTermsOfUse()">' + (isAr ? 'شروط الاستخدام' : 'Terms of Use') + '</button>' +
        '<button class="btn btn-secondary" type="button" onclick="openPrivacyPolicy()">' + (isAr ? 'سياسة الخصوصية' : 'Privacy Policy') + '</button>' +
        '<button class="btn btn-secondary" type="button" onclick="openPermissionsOverview()">' + (isAr ? 'عرض الصلاحيات' : 'View permissions') + '</button>' +
      '</div>' +
      '<label style="display:flex;align-items:center;gap:10px;margin:12px 0 16px;font-size:13px;color:var(--text-secondary)">' +
        '<input type="checkbox" id="consentCheckbox" style="width:16px;height:16px" onchange="const b=document.getElementById(\'consentAcceptBtn\'); if (b) b.disabled=!this.checked;">' +
        '<span>' + (isAr ? 'أوافق على الشروط وسياسة الخصوصية وأفهم أن التطبيق يعمل محليًا.' : 'I agree to the Terms and Privacy Policy and understand the app runs locally.') + '</span>' +
      '</label>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">' +
        '<button class="btn btn-secondary" type="button" onclick="closeModal()">' + (isAr ? 'إغلاق' : 'Close') + '</button>' +
        '<button class="btn btn-primary" type="button" id="consentAcceptBtn" disabled onclick="window.__JOCE_ACCEPT_CONSENT__()">' + (isAr ? 'الموافقة والبدء' : 'Accept & Start') + '</button>' +
      '</div>' +
    '</div>';
  showModal(isAr ? 'شروط الاستخدام وسياسة الخصوصية' : 'Terms & Privacy', html, false);
  setTimeout(function () {
    const cb = document.getElementById('consentCheckbox');
    const btn = document.getElementById('consentAcceptBtn');
    if (cb && btn) btn.disabled = !cb.checked;
  }, 0);
}

window.__JOCE_ACCEPT_CONSENT__ = function () {
  const cb = document.getElementById('consentCheckbox');
  if (!cb || !cb.checked) {
    showToast(State.language === 'ar' ? 'يجب الموافقة على الشروط أولًا' : 'You must accept the terms first', 'warning');
    return;
  }
  storeConsentRecord();
  closeModal();
  startJOCEApplication();
};

window.__JOCE_OPEN_TERMS__ = openTermsOfUse;
window.__JOCE_OPEN_PRIVACY__ = openPrivacyPolicy;
window.__JOCE_OPEN_PERMISSIONS__ = openPermissionsOverview;
window.__JOCE_OPEN_DEV_CENTER__ = openDeveloperCenter;

// Start the application
function bootIfConsented() {
  Storage.loadSettings();
  const consent = Storage.get('consentRecord', null);
  if (consent && consent.accepted && consent.version === APP_VERSION) {
    startJOCEApplication();
    return true;
  }
  showFirstRunConsentGate();
  return false;
}

bootIfConsented();

// Auto-save project periodically
setInterval(function() {
  Storage.saveProject();
}, 30000);

console.log('%c JOCE IDE %c JO Code Editor v2.4 loaded successfully!', 
  'background: #58a6ff; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
  'color: #8b949e;'
);


window.JOCE_APP_VERSION = typeof APP_VERSION !== 'undefined' ? APP_VERSION : '2.4.0';
window.JOCE_CHANGELOG = typeof APP_CHANGELOG !== 'undefined' ? APP_CHANGELOG : [];
