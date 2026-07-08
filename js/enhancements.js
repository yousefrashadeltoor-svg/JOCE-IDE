
(function () {
  if (window.__JOCE_ENHANCEMENTS_LOADED__) return;
  window.__JOCE_ENHANCEMENTS_LOADED__ = true;

  const STORE_KEY = 'joce_enhancements_v1';

  function safeParse(text, fallback) {
    try { return JSON.parse(text); } catch (e) { return fallback; }
  }

  function loadPrefs() {
    return Object.assign({
      uiScale: 1,
      bgScope: 'full',
      themePreset: 'matrix',
      developerToken: null,
      selection: [],
      lastClaimedAt: null,
      consentAccepted: false,
      consentVersion: null,
      consentAcceptedAt: null
    }, safeParse(localStorage.getItem(STORE_KEY) || '{}', {}));
  }

  function savePrefs(prefs) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  const prefs = loadPrefs();
  function persist() { savePrefs(prefs); }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function t2(en, ar) {
    return window.State && State.language === 'ar' ? (ar || en) : en;
  }

function getConsentState() {
  return {
    accepted: !!prefs.consentAccepted,
    version: prefs.consentVersion || null,
    acceptedAt: prefs.consentAcceptedAt || null
  };
}

function acceptConsentFromSettings() {
  prefs.consentAccepted = true;
  prefs.consentVersion = (window.APP_VERSION || window.JOCE_APP_VERSION || '2.4.0');
  prefs.consentAcceptedAt = new Date().toISOString();
  persist();
  if (typeof showToast === 'function') {
    showToast(t2('Consent updated', 'تم تحديث الموافقة'), 'success');
  }
}

function openLegalDoc(type) {
  const isAr = window.State && State.language === 'ar';
  const docs = {
    terms: isAr ?
      '<div class="dev-center-card"><h3>' + t2('Terms of Use', 'شروط الاستخدام') + '</h3><p>JOCE IDE is local-first. Projects, settings, extensions and logs are stored locally. The Developer Center is device-local and uses explicit consent. You must not use the app to monitor other people or collect personal data from them.</p><ul><li>Local storage only unless you explicitly enable an online feature.</li><li>Explicit permission is required for clipboard, notifications, file access, and extensions.</li><li>Developer Center shows only local statistics and diagnostics.</li><li>No hidden cross-device tracking.</li></ul></div>' :
      '<div class="dev-center-card"><h3>' + t2('Terms of Use', 'شروط الاستخدام') + '</h3><p>JOCE IDE is local-first. Projects, settings, extensions and logs are stored locally. The Developer Center is device-local and uses explicit consent. You must not use the app to monitor other people or collect personal data from them.</p><ul><li>Local storage only unless you explicitly enable an online feature.</li><li>Explicit permission is required for clipboard, notifications, file access, and extensions.</li><li>Developer Center shows only local statistics and diagnostics.</li><li>No hidden cross-device tracking.</li></ul></div>',
    privacy: isAr ?
      '<div class="dev-center-card"><h3>' + t2('Privacy Policy', 'سياسة الخصوصية') + '</h3><p>We do not sell data. We do not ship personal logs to a server. All developer info is stored on your device.</p><ul><li>Projects remain on your device.</li><li>Consent records are stored locally.</li><li>Update history stays local.</li><li>Developer Center uses app stats only.</li></ul></div>' :
      '<div class="dev-center-card"><h3>' + t2('Privacy Policy', 'سياسة الخصوصية') + '</h3><p>We do not sell data. We do not ship personal logs to a server. All developer info is stored on your device.</p><ul><li>Projects remain on your device.</li><li>Consent records are stored locally.</li><li>Update history stays local.</li><li>Developer Center uses app stats only.</li></ul></div>',
    permissions: isAr ?
      '<div class="dev-center-card"><h3>' + t2('Permissions', 'الصلاحيات') + '</h3><ul><li>الوصول إلى ملفات المشروع والمجلدات التي تختارها.</li><li>القراءة/الكتابة المحلية للمشروعات.</li><li>حفظ الإعدادات والثيمات والخلفيات محليًا.</li><li>تشغيل الإضافات المثبتة محليًا.</li><li>عرض إحصاءات وتشخيصات محلية فقط.</li><li>الحافظة والإشعارات عند الحاجة وبإذن.</li></ul></div>' :
      '<div class="dev-center-card"><h3>' + t2('Permissions', 'الصلاحيات') + '</h3><ul><li>Access to the project files and folders you choose.</li><li>Local read/write for projects.</li><li>Saving settings, themes, and backgrounds locally.</li><li>Running locally installed extensions.</li><li>Displaying local diagnostics and app statistics only.</li><li>Clipboard and notifications only when requested.</li></ul></div>'
  };
  showModal(isAr ? 'المستند القانوني' : 'Legal Document', docs[type] || docs.terms, false);
}

  function ensureBodyAttrs() {
    document.body.setAttribute('data-bg-scope', prefs.bgScope || 'full');
    document.body.setAttribute('data-theme-preset', prefs.themePreset || 'matrix');
    document.documentElement.style.setProperty('--ui-scale', String(prefs.uiScale || 1));
  }

  function applyUiScale(value) {
    const v = Math.max(0.8, Math.min(1.3, Number(value) || 1));
    prefs.uiScale = v;
    document.documentElement.style.setProperty('--ui-scale', String(v));
    persist();
  }

  function applyBackgroundScope(scope) {
    prefs.bgScope = scope || 'full';
    document.body.setAttribute('data-bg-scope', prefs.bgScope);
    persist();
  }

  const ThemePresets = {
    matrix: {
      label: 'Matrix Rain',
      description: 'Deep black + green rain effect',
      effect: 'matrix',
      vars: {
        '--accent': '#6fff6f',
        '--accent-hover': '#8aff8a',
        '--accent-muted': 'rgba(111,255,111,0.12)',
        '--bg-primary': '#020802',
        '--bg-secondary': '#071307',
        '--bg-tertiary': '#0b1e0b',
        '--bg-elevated': '#0f2410',
        '--bg-hover': '#123014',
        '--bg-active': '#16391a',
        '--border-primary': '#214c23',
        '--border-secondary': '#153717',
        '--text-primary': '#dfffe0',
        '--text-secondary': '#8bcf8c',
        '--text-tertiary': '#4f8a51',
        '--success': '#6fff6f',
        '--warning': '#c7ff6a',
        '--danger': '#ff6b6b'
      }
    },
    aurora: {
      label: 'Aurora',
      effect: 'none',
      vars: {
        '--accent': '#7df9ff',
        '--accent-hover': '#b5fbff',
        '--accent-muted': 'rgba(125,249,255,0.14)',
        '--bg-primary': '#07111d',
        '--bg-secondary': '#0d1726',
        '--bg-tertiary': '#13233a',
        '--bg-elevated': '#172840',
        '--bg-hover': '#203352',
        '--bg-active': '#29415f',
        '--border-primary': '#29435f',
        '--border-secondary': '#18314a',
        '--text-primary': '#e7f7ff',
        '--text-secondary': '#9ac6d9',
        '--text-tertiary': '#6f91a5',
        '--success': '#7df9ff',
        '--warning': '#ffc857',
        '--danger': '#ff7675'
      }
    },
    sunset: {
      label: 'Sunset Glow',
      effect: 'none',
      vars: {
        '--accent': '#ff9f43',
        '--accent-hover': '#ffbf6a',
        '--accent-muted': 'rgba(255,159,67,0.14)',
        '--bg-primary': '#1c1115',
        '--bg-secondary': '#28161c',
        '--bg-tertiary': '#381d26',
        '--bg-elevated': '#442331',
        '--bg-hover': '#532a38',
        '--bg-active': '#633245',
        '--border-primary': '#633245',
        '--border-secondary': '#402131',
        '--text-primary': '#fff4ef',
        '--text-secondary': '#e2b6a3',
        '--text-tertiary': '#a17768',
        '--success': '#8bd17c',
        '--warning': '#ffd166',
        '--danger': '#ff6b6b'
      }
    },
    ocean: {
      label: 'Ocean Depth',
      effect: 'none',
      vars: {
        '--accent': '#1dd3b0',
        '--accent-hover': '#6ef3d6',
        '--accent-muted': 'rgba(29,211,176,0.14)',
        '--bg-primary': '#05141a',
        '--bg-secondary': '#0a1c25',
        '--bg-tertiary': '#0d2833',
        '--bg-elevated': '#123241',
        '--bg-hover': '#164254',
        '--bg-active': '#1d5367',
        '--border-primary': '#1d5367',
        '--border-secondary': '#103340',
        '--text-primary': '#e8ffff',
        '--text-secondary': '#9acbd2',
        '--text-tertiary': '#6d8d97'
      }
    },
    violet: {
      label: 'Violet Dream',
      effect: 'none',
      vars: {
        '--accent': '#d2a8ff',
        '--accent-hover': '#e6c7ff',
        '--accent-muted': 'rgba(210,168,255,0.14)',
        '--bg-primary': '#12081f',
        '--bg-secondary': '#1b0d2d',
        '--bg-tertiary': '#24123a',
        '--bg-elevated': '#2d1546',
        '--bg-hover': '#38195b',
        '--bg-active': '#44206d',
        '--border-primary': '#44206d',
        '--border-secondary': '#2f184d',
        '--text-primary': '#faf4ff',
        '--text-secondary': '#ccb5e0',
        '--text-tertiary': '#8d76a2'
      }
    },
    forest: {
      label: 'Forest Mist',
      effect: 'none',
      vars: {
        '--accent': '#3fb950',
        '--accent-hover': '#7dd88b',
        '--accent-muted': 'rgba(63,185,80,0.14)',
        '--bg-primary': '#07120a',
        '--bg-secondary': '#0d1b11',
        '--bg-tertiary': '#12241a',
        '--bg-elevated': '#173022',
        '--bg-hover': '#1e3c2a',
        '--bg-active': '#244936',
        '--border-primary': '#244936',
        '--border-secondary': '#133021',
        '--text-primary': '#eefcf0',
        '--text-secondary': '#b0d5b6',
        '--text-tertiary': '#7d9f84'
      }
    },
    neon: {
      label: 'Neon Circuit',
      effect: 'none',
      vars: {
        '--accent': '#ff4dff',
        '--accent-hover': '#ff8cff',
        '--accent-muted': 'rgba(255,77,255,0.14)',
        '--bg-primary': '#090611',
        '--bg-secondary': '#130d23',
        '--bg-tertiary': '#1b1334',
        '--bg-elevated': '#241946',
        '--bg-hover': '#30205c',
        '--bg-active': '#3c2970',
        '--border-primary': '#3c2970',
        '--border-secondary': '#22193e',
        '--text-primary': '#fff7ff',
        '--text-secondary': '#cdbbe0',
        '--text-tertiary': '#917aa8'
      }
    },
    solar: {
      label: 'Solar Burst',
      effect: 'none',
      vars: {
        '--accent': '#f7b731',
        '--accent-hover': '#ffd166',
        '--accent-muted': 'rgba(247,183,49,0.16)',
        '--bg-primary': '#1a1406',
        '--bg-secondary': '#271d08',
        '--bg-tertiary': '#33260a',
        '--bg-elevated': '#3d2e0d',
        '--bg-hover': '#4a3910',
        '--bg-active': '#5a4614',
        '--border-primary': '#5a4614',
        '--border-secondary': '#342907',
        '--text-primary': '#fff9ea',
        '--text-secondary': '#e0c789',
        '--text-tertiary': '#9b8457'
      }
    },
    graphite: {
      label: 'Graphite',
      effect: 'none',
      vars: {
        '--accent': '#8fb3ff',
        '--accent-hover': '#b8cbff',
        '--accent-muted': 'rgba(143,179,255,0.14)',
        '--bg-primary': '#101214',
        '--bg-secondary': '#171a1d',
        '--bg-tertiary': '#20242a',
        '--bg-elevated': '#262b31',
        '--bg-hover': '#2e343b',
        '--bg-active': '#383f47',
        '--border-primary': '#383f47',
        '--border-secondary': '#242a31',
        '--text-primary': '#f3f5f7',
        '--text-secondary': '#b5bcc4',
        '--text-tertiary': '#79828c'
      }
    },
    midnight: {
      label: 'Midnight Blue',
      effect: 'none',
      vars: {
        '--accent': '#58a6ff',
        '--accent-hover': '#79c0ff',
        '--accent-muted': 'rgba(88,166,255,0.14)',
        '--bg-primary': '#050b14',
        '--bg-secondary': '#0a1220',
        '--bg-tertiary': '#0d1a2b',
        '--bg-elevated': '#132036',
        '--bg-hover': '#1b2a46',
        '--bg-active': '#23355a',
        '--border-primary': '#23355a',
        '--border-secondary': '#122034',
        '--text-primary': '#e6edf3',
        '--text-secondary': '#a1b3cc',
        '--text-tertiary': '#6b8097'
      }
    },
    paper: {
      label: 'Paper Light',
      effect: 'none',
      vars: {
        '--accent': '#0969da',
        '--accent-hover': '#0550ae',
        '--accent-muted': 'rgba(9,105,218,0.14)',
        '--bg-primary': '#fbfbfc',
        '--bg-secondary': '#f3f5f8',
        '--bg-tertiary': '#eceff4',
        '--bg-elevated': '#ffffff',
        '--bg-hover': '#e5e9ef',
        '--bg-active': '#d8dee6',
        '--border-primary': '#d0d7de',
        '--border-secondary': '#e5e9ef',
        '--text-primary': '#171b21',
        '--text-secondary': '#526071',
        '--text-tertiary': '#7b8794'
      }
    }
  };

  const themeCanvas = document.createElement('canvas');
  themeCanvas.id = 'themeEffectCanvas';
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(themeCanvas);
  });

  let matrixRAF = 0;
  let matrixCtx = null;
  let matrixCols = [];
  let matrixFontSize = 18;
  const matrixChars = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/<>[]{}()=;:.';

  function resizeThemeCanvas() {
    themeCanvas.width = window.innerWidth * devicePixelRatio;
    themeCanvas.height = window.innerHeight * devicePixelRatio;
    themeCanvas.style.width = window.innerWidth + 'px';
    themeCanvas.style.height = window.innerHeight + 'px';
  }

  function stopMatrix() {
    if (matrixRAF) cancelAnimationFrame(matrixRAF);
    matrixRAF = 0;
    matrixCtx = null;
  }

  function startMatrix() {
    resizeThemeCanvas();
    matrixCtx = themeCanvas.getContext('2d');
    matrixCtx.scale(devicePixelRatio, devicePixelRatio);
    matrixCols = Array(Math.ceil(window.innerWidth / matrixFontSize)).fill(0);
    themeCanvas.style.opacity = '.28';

    function frame() {
      if (!document.body || document.body.getAttribute('data-theme-preset') !== 'matrix') {
        stopMatrix();
        return;
      }
      matrixCtx.fillStyle = 'rgba(2, 8, 2, 0.08)';
      matrixCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      matrixCtx.fillStyle = '#6fff6f';
      matrixCtx.font = matrixFontSize + 'px monospace';
      for (let i = 0; i < matrixCols.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * matrixFontSize;
        const y = matrixCols[i] * matrixFontSize;
        matrixCtx.fillText(char, x, y);
        if (y > window.innerHeight && Math.random() > 0.975) matrixCols[i] = 0;
        matrixCols[i]++;
      }
      matrixRAF = requestAnimationFrame(frame);
    }
    frame();
  }

  function applyThemePreset(id) {
    const preset = ThemePresets[id];
    if (!preset) return;
    prefs.themePreset = id;
    document.body.setAttribute('data-theme-preset', id);

    Object.keys(preset.vars).forEach(function (key) {
      document.documentElement.style.setProperty(key, preset.vars[key]);
    });

    // Keep the base app theme aligned to preset style.
    if (id === 'paper') {
      if (typeof setTheme === 'function') setTheme('light');
    } else {
      if (typeof setTheme === 'function' && State && State.theme !== 'dark') setTheme('dark');
    }

    if (preset.effect === 'matrix') {
      startMatrix();
    } else {
      stopMatrix();
      themeCanvas.style.opacity = '0';
    }

    persist();
    try { Storage.saveSettings(); } catch (e) {}
    if (typeof showToast === 'function') {
      showToast(t2('Theme applied', 'تم تطبيق الثيم'), 'success');
    }
  }

  function themeButtonsHtml() {
    const order = ['matrix', 'aurora', 'sunset', 'ocean', 'violet', 'forest', 'neon', 'solar', 'graphite', 'midnight', 'paper'];
    return '<div class="settings-section">' +
      '<div class="settings-section-title">' + t2('Themes', 'الثيمات') + '</div>' +
      '<div class="color-options">' +
        order.map(function (id) {
          const p = ThemePresets[id];
          const active = prefs.themePreset === id ? ' active' : '';
          return '<button type="button" class="joce-settings-tab' + active + '" style="border-radius:12px" onclick="window.__JOCE_THEME_PRESET__(\'' + id + '\')">' + escapeHtml(p.label) + '</button>';
        }).join('') +
      '</div>' +
      '<div class="dev-note" style="margin-top:8px">' + t2('Choose a preset to instantly restyle the app.', 'اختر ثيم لتغيير شكل التطبيق فورًا.') + '</div>' +
    '</div>';
  }

  function refreshSelectionFooter() {
    const footer = document.querySelector('.sidebar-stats');
    if (!footer) return;
    let chip = document.getElementById('selectionChip');
    if (!chip) {
      chip = document.createElement('span');
      chip.id = 'selectionChip';
      chip.className = 'selection-chip';
      footer.appendChild(chip);
    }
    const count = State.selectedPaths ? State.selectedPaths.size : 0;
    chip.style.display = count ? 'inline-flex' : 'none';
    chip.textContent = count ? (count + ' selected') : '';
    updateBulkBar();
  }

  function selectedArray() {
    return Array.from(State.selectedPaths || []);
  }

  function ensureSelectionStore() {
    if (!State.selectedPaths) State.selectedPaths = new Set();
  }

  function syncTreeSelection() {
    ensureSelectionStore();
    document.querySelectorAll('#fileTree .tree-item').forEach(function (item) {
      item.classList.toggle('multi-selected', State.selectedPaths.has(item.dataset.path));
    });
    refreshSelectionFooter();
  }

  function clearSelection() {
    ensureSelectionStore();
    State.selectedPaths.clear();
    syncTreeSelection();
  }

  function toggleSelection(path, additive) {
    ensureSelectionStore();
    if (!additive) State.selectedPaths.clear();
    if (State.selectedPaths.has(path)) {
      State.selectedPaths.delete(path);
    } else {
      State.selectedPaths.add(path);
    }
    syncTreeSelection();
  }

  function updateBulkBar() {
    let bar = document.getElementById('bulkActionsBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'bulkActionsBar';
      bar.className = 'bulk-actions-bar';
      bar.innerHTML =
        '<div class="bulk-actions-count" id="bulkActionsCount"></div>' +
        '<div class="bulk-actions-buttons">' +
          '<button class="btn btn-secondary" type="button" id="bulkMoveBtn">' + t2('Move', 'نقل') + '</button>' +
          '<button class="btn btn-secondary" type="button" id="bulkDuplicateBtn">' + t2('Duplicate', 'نسخ') + '</button>' +
          '<button class="btn btn-secondary" type="button" id="bulkExportBtn">' + t2('Export', 'تصدير') + '</button>' +
          '<button class="btn btn-danger" type="button" id="bulkDeleteBtn">' + t2('Delete', 'حذف') + '</button>' +
        '</div>';
      document.body.appendChild(bar);
      bar.querySelector('#bulkDeleteBtn').addEventListener('click', bulkDeleteSelected);
      bar.querySelector('#bulkDuplicateBtn').addEventListener('click', bulkDuplicateSelected);
      bar.querySelector('#bulkMoveBtn').addEventListener('click', bulkMoveSelected);
      bar.querySelector('#bulkExportBtn').addEventListener('click', bulkExportSelected);
    }
    const count = State.selectedPaths ? State.selectedPaths.size : 0;
    bar.classList.toggle('show', count > 0);
    const counter = bar.querySelector('#bulkActionsCount');
    if (counter) counter.textContent = count ? (count + ' selected') : '';
  }

  function bulkDeleteSelected() {
    const items = selectedArray();
    if (!items.length) return;
    showConfirmModal(t2('Delete selected items', 'حذف العناصر المحددة'), t2('Are you sure you want to delete the selected files/folders?', 'هل تريد حذف الملفات/المجلدات المحددة؟'), function () {
      items.sort(function (a, b) { return b.length - a.length; }).forEach(function (path) {
        if (typeof deleteItem === 'function') deleteItem(path);
      });
      clearSelection();
      if (typeof UI !== 'undefined') {
        UI.renderFileTree();
        UI.renderTabs();
        UI.updateEditor();
      }
      if (typeof showToast === 'function') showToast(t2('Selected items deleted', 'تم حذف العناصر المحددة'), 'success');
    });
  }

  function bulkDuplicateSelected() {
    selectedArray().forEach(function (path) {
      if (State.files && State.files[path] && typeof duplicateFile === 'function') duplicateFile(path);
      else if (State.folders && State.folders.has(path)) {
        const newPath = path + '-copy';
        if (!State.folders.has(newPath)) {
          if (FS && FS.renameItem) FS.renameItem(path, newPath);
        }
      }
    });
    if (typeof UI !== 'undefined') {
      UI.renderFileTree();
      UI.renderTabs();
    }
    if (typeof showToast === 'function') showToast(t2('Duplicated', 'تم النسخ'), 'success');
  }

  function bulkMoveSelected() {
    const items = selectedArray();
    if (!items.length) return;
    const folders = ['(root)'].concat(Array.from(State.folders || []).sort());
    const options = folders.map(function (f) {
      return '<option value="' + escapeHtml(f === '(root)' ? '' : f) + '">' + escapeHtml(f) + '</option>';
    }).join('');
    showModal(t2('Move selected items', 'نقل العناصر المحددة'),
      '<div class="form-group"><label class="form-label">' + t2('Destination Folder', 'مجلد الوجهة') + '</label><select class="form-select" id="bulkMoveSelect">' + options + '</select></div>',
      true, function () {
        const target = document.getElementById('bulkMoveSelect').value;
        items.forEach(function (path) {
          if (State.files[path] && FS.moveFile) FS.moveFile(path, target);
          else if (State.folders.has(path) && FS.renameItem) {
            const newPath = target ? target + '/' + FS.getFileName(path) : FS.getFileName(path);
            if (!target || !newPath.startsWith(path + '/')) FS.renameItem(path, newPath);
          }
        });
        clearSelection();
        if (typeof UI !== 'undefined') {
          UI.renderFileTree();
          UI.renderTabs();
        }
        if (typeof showToast === 'function') showToast(t2('Moved', 'تم النقل'), 'success');
      });
  }

  function bulkExportSelected() {
    const items = selectedArray();
    if (!items.length) return;
    const payload = {};
    items.forEach(function (path) {
      if (State.files[path]) payload[path] = State.files[path].content;
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'joce-selection-export.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    if (typeof showToast === 'function') showToast(t2('Selection exported', 'تم تصدير التحديد'), 'success');
  }

  function installExplorerSelectionHooks() {
    const tree = document.getElementById('fileTree');
    if (!tree || tree.__joceSelectionHooked) return;
    tree.__joceSelectionHooked = true;

    tree.addEventListener('click', function (e) {
      const item = e.target.closest('.tree-item');
      if (!item) return;
      const path = item.dataset.path;
      const type = item.dataset.type || 'file';
      const additive = e.ctrlKey || e.metaKey || e.shiftKey;

      if (additive) {
        e.preventDefault();
        e.stopImmediatePropagation();
        toggleSelection(path, true);
        return;
      }

      clearSelection();
      // Let original handler run normally for open/toggle.
      if (type === 'file') {
        // do nothing, original click opens file
      }
    }, true);
  }

  function patchContextMenu() {
    const original = window.showContextMenu;
    if (!original || original.__jocePatched) return;
    const wrapped = function (e, path, type) {
      ensureSelectionStore();
      if (State.selectedPaths && State.selectedPaths.size > 1) {
        const items = selectedArray();
        const menu = document.getElementById('contextMenu');
        menu.innerHTML =
          '<div class="ctx-category-label">' + t2('Selection', 'التحديد') + '</div>' +
          '<div class="ctx-item" onclick="window.__JOCE_BULK_MOVE__();hideContextMenu()">' + icon('move') + ' <span class="ctx-item-label">' + t2('Move selected', 'نقل المحدد') + '</span></div>' +
          '<div class="ctx-item" onclick="window.__JOCE_BULK_DUPLICATE__();hideContextMenu()">' + icon('copy') + ' <span class="ctx-item-label">' + t2('Duplicate selected', 'نسخ المحدد') + '</span></div>' +
          '<div class="ctx-item" onclick="window.__JOCE_BULK_EXPORT__();hideContextMenu()">' + icon('download') + ' <span class="ctx-item-label">' + t2('Export selected', 'تصدير المحدد') + '</span></div>' +
          '<div class="ctx-item danger" onclick="window.__JOCE_BULK_DELETE__();hideContextMenu()">' + icon('trash') + ' <span class="ctx-item-label">' + t2('Delete selected', 'حذف المحدد') + '</span></div>';
        menu.classList.add('show');
        const x = Math.min(e.clientX, window.innerWidth - 220);
        const y = Math.min(e.clientY, window.innerHeight - 180);
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        return;
      }
      return original.apply(this, arguments);
    };
    wrapped.__jocePatched = true;
    window.showContextMenu = wrapped;
  }

  function openDeveloperCenter() {
    if (!prefs.developerToken) {
      showModal(t2('Developer Center', 'غرفة المطور'),
        '<div class="dev-center-card">' +
          '<div class="dev-note">' + t2('This space is local-only and does not collect personal data from other devices.', 'هذه المساحة محلية فقط ولا تجمع بيانات شخصية من أجهزة أخرى.') + '</div>' +
          '<div class="dev-note" style="margin-top:8px">' + t2('Consent status is stored locally and can be reviewed in Settings → Privacy & permissions.', 'حالة الموافقة تُحفظ محليًا ويمكن مراجعتها من الإعدادات ← الخصوصية والصلاحيات.') + '</div>' +
          '<button class="btn btn-primary" type="button" onclick="window.__JOCE_CLAIM_DEV__()">' + t2('Claim this device as developer device', 'تعيين هذا الجهاز كجهاز المطور') + '</button>' +
        '</div>', false);
      return;
    }
    const fileCount = Object.keys(State.files || {}).length;
    const folderCount = (State.folders && State.folders.size) || 0;
    const extCount = (State.extensions && State.extensions.length) || 0;
    const openTabs = (State.openTabs && State.openTabs.length) || 0;
    const storageBytes = new Blob([JSON.stringify(localStorage)]).size;
    const updateCount = (State.updateLog && State.updateLog.length) || 0;
    const html =
      '<div class="dev-center-card">' +
        '<div class="dev-grid">' +
          '<div class="dev-stat"><span class="k">' + t2('Project files', 'ملفات المشروع') + '</span><span class="v">' + fileCount + '</span></div>' +
          '<div class="dev-stat"><span class="k">' + t2('Folders', 'المجلدات') + '</span><span class="v">' + folderCount + '</span></div>' +
          '<div class="dev-stat"><span class="k">' + t2('Open tabs', 'التبويبات المفتوحة') + '</span><span class="v">' + openTabs + '</span></div>' +
          '<div class="dev-stat"><span class="k">' + t2('Extensions', 'الإضافات') + '</span><span class="v">' + extCount + '</span></div>' +
          '<div class="dev-stat"><span class="k">' + t2('Update entries', 'سجلات التحديث') + '</span><span class="v">' + updateCount + '</span></div>' +
          '<div class="dev-stat"><span class="k">' + t2('Local storage', 'التخزين المحلي') + '</span><span class="v">' + Math.round(storageBytes / 1024) + ' KB</span></div>' +
        '</div>' +
        '<div class="dev-note">' + t2('Developer center is intentionally local-only. It shows app health, update history, extension status, project statistics, and storage usage — not private activity tracking.', 'غرفة المطور محلية فقط. تعرض حالة التطبيق وسجل التحديثات والإضافات وإحصاءات المشروع واستخدام التخزين — وليس تتبع النشاط الشخصي.') + '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn btn-secondary" type="button" onclick="openUpdateLog()">' + t2('Open update log', 'فتح سجل التحديثات') + '</button>' +
          '<button class="btn btn-secondary" type="button" onclick="openExtensions()">' + t2('Open extensions', 'فتح الإضافات') + '</button>' +
          '<button class="btn btn-secondary" type="button" onclick="openSettings()">' + t2('Back to settings', 'العودة للإعدادات') + '</button>' +
        '</div>' +
      '</div>';
    showModal(t2('Developer Center', 'غرفة المطور'), html, false);
  }

  function claimDeveloperDevice() {
    prefs.developerToken = 'dev-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
    prefs.lastClaimedAt = new Date().toISOString();
    persist();
    if (typeof showToast === 'function') showToast(t2('Developer device claimed', 'تم تعيين جهاز المطور'), 'success');
    openDeveloperCenter();
  }

  function openUpdateLog() {
    const entries = Array.isArray(State.updateLog) ? State.updateLog.slice() : [];
    if (!entries.length) {
      showModal(t2('Update Log', 'سجل التحديثات'),
        '<div class="cp-empty">' + t2('No updates yet.', 'لا توجد تحديثات بعد.') + '</div>', false);
      return;
    }
    const list = entries.map(function (entry) {
      const items = (State.language === 'ar' ? (entry.items && entry.items.ar) : (entry.items && entry.items.en)) || (entry.items && entry.items.en) || [];
      return '<div class="update-entry">' +
        '<div class="update-entry-header">' +
          '<span class="update-entry-version">v' + escapeHtml(entry.version || '') + '</span>' +
          '<span class="update-entry-time">' + escapeHtml(new Date(entry.time || Date.now()).toLocaleString(State.language === 'ar' ? 'ar-EG' : undefined)) + '</span>' +
        '</div>' +
        '<ul>' + items.map(function (it) { return '<li>' + escapeHtml(it) + '</li>'; }).join('') + '</ul>' +
      '</div>';
    }).join('');
    showModal(t2('Update Log', 'سجل التحديثات'),
      '<div class="update-log-list">' + list + '</div>' +
      '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn btn-secondary" type="button" onclick="window.__JOCE_MARK_READ__()">' + t2('Mark as read', 'تعيين كمقروء') + '</button>' +
        '<button class="btn btn-secondary" type="button" onclick="openSettings()">' + t2('Back to settings', 'العودة للإعدادات') + '</button>' +
      '</div>', false);
  }

  function markUpdateLogRead() {
    State.lastSeenVersion = window.JOCE_APP_VERSION || State.lastSeenVersion || '2.3.0';
    try { Storage.saveSettings(); } catch (e) {}
    if (typeof showToast === 'function') showToast(t2('Marked as read', 'تم التعيين كمقروء'), 'success');
  }

  function enhanceSettingsModal() {
    const modal = Array.from(document.querySelectorAll('.modal')).find(function (m) {
      const title = m.querySelector('.modal-title');
      return title && /settings/i.test(title.textContent);
    });
    if (!modal || modal.dataset.joceEnhanced === '1') return;
    modal.dataset.joceEnhanced = '1';
    const body = modal.querySelector('.modal-body');
    if (!body) return;

    const sections = Array.from(body.querySelectorAll('.settings-section'));
    sections.forEach(function (sec, idx) {
      const key = ['language', 'appearance', 'background', 'editor', 'project', 'app'][idx] || 'more';
      sec.dataset.group = key;
    });

    const tabs = document.createElement('div');
    tabs.className = 'joce-settings-tabs';
    const tabDefs = [
      { k: 'all', en: 'All', ar: 'الكل' },
      { k: 'language', en: 'Language', ar: 'اللغة' },
      { k: 'appearance', en: 'Appearance', ar: 'المظهر' },
      { k: 'background', en: 'Background', ar: 'الخلفية' },
      { k: 'editor', en: 'Editor', ar: 'المحرر' },
      { k: 'project', en: 'Project', ar: 'المشروع' },
      { k: 'app', en: 'App', ar: 'التطبيق' },
      { k: 'dev', en: 'Developer', ar: 'المطور' }
    ];
    tabs.innerHTML = tabDefs.map(function (d, i) {
      return '<button type="button" class="joce-settings-tab' + (i === 0 ? ' active' : '') + '" data-tab="' + d.k + '">' + t2(d.en, d.ar) + '</button>';
    }).join('');
    body.insertBefore(tabs, body.firstChild);

    function showTab(tab) {
      tabs.querySelectorAll('.joce-settings-tab').forEach(function (b) {
        b.classList.toggle('active', b.dataset.tab === tab);
      });
      sections.forEach(function (sec) {
        sec.dataset.hidden = (tab !== 'all' && sec.dataset.group !== tab) ? '1' : '0';
      });
    }
    tabs.addEventListener('click', function (e) {
      const btn = e.target.closest('.joce-settings-tab');
      if (!btn) return;
      showTab(btn.dataset.tab);
    });
    showTab('all');

    // Inject additional controls into appearance section
    const appearance = sections[1] || sections[0];
    if (appearance && !appearance.querySelector('[data-enhancement="ui-scale"]')) {
      appearance.insertAdjacentHTML('beforeend',
        '<div class="settings-row" data-enhancement="ui-scale">' +
          '<span class="settings-row-label">' + t2('UI Scale', 'حجم الواجهة') + '</span>' +
          '<span class="settings-row-value">' + Math.round((prefs.uiScale || 1) * 100) + '%</span>' +
        '</div>' +
        '<input type="range" class="form-range" min="80" max="130" value="' + Math.round((prefs.uiScale || 1) * 100) + '" oninput="window.__JOCE_UI_SCALE__(this.value/100)">' 
      );
    }

    // Inject themes into appearance
    if (appearance && !appearance.querySelector('[data-enhancement="themes"]')) {
      appearance.insertAdjacentHTML('beforeend', '<div data-enhancement="themes">' + themeButtonsHtml() + '</div>');
    }

    const background = sections[2] || sections[1];
    if (background && !background.querySelector('[data-enhancement="bg-scope"]')) {
      background.insertAdjacentHTML('beforeend',
        '<div class="settings-row" data-enhancement="bg-scope">' +
          '<span class="settings-row-label">' + t2('Background scope', 'نطاق الخلفية') + '</span>' +
          '<select class="form-select" style="width:auto;min-width:170px" onchange="window.__JOCE_BG_SCOPE__(this.value)">' +
            '<option value="full"' + (prefs.bgScope === 'full' ? ' selected' : '') + '>' + t2('Full application', 'كل التطبيق') + '</option>' +
            '<option value="workspace"' + (prefs.bgScope === 'workspace' ? ' selected' : '') + '>' + t2('Workspace panels', 'لوحات العمل') + '</option>' +
            '<option value="editor"' + (prefs.bgScope === 'editor' ? ' selected' : '') + '>' + t2('Editor area', 'منطقة المحرر') + '</option>' +
            '<option value="sidebar"' + (prefs.bgScope === 'sidebar' ? ' selected' : '') + '>' + t2('Sidebar emphasis', 'التركيز على الشريط الجانبي') + '</option>' +
          '</select>' +
        '</div>'
      );
    }

    const appInfo = sections[5] || sections[sections.length - 1];
    if (appInfo && !appInfo.querySelector('[data-enhancement="developer-center"]')) {
      appInfo.insertAdjacentHTML('beforeend',
        '<div class="settings-row" data-enhancement="developer-center">' +
          '<span class="settings-row-label">' + t2('Developer Center', 'غرفة المطور') + '</span>' +
          '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px" onclick="window.__JOCE_OPEN_DEV__()">' + t2('Open', 'فتح') + '</button>' +
        '</div>'
      );
    }

    // App info update actions
    if (appInfo && !appInfo.querySelector('[data-enhancement="update-log"]')) {
      appInfo.insertAdjacentHTML('beforeend',
        '<div class="settings-row" data-enhancement="update-log">' +
          '<span class="settings-row-label">' + t2('Update Log', 'سجل التحديثات') + '</span>' +
          '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px" onclick="window.__JOCE_OPEN_UPDATES__()">' + t2('View History', 'عرض السجل') + '</button>' +
        '</div>' +
        '<div class="settings-row" data-enhancement="consent-status">' +
          '<span class="settings-row-label">' + t2('Consent status', 'حالة الموافقة') + '</span>' +
          '<span class="settings-row-value">' + (getConsentState().accepted ? t2('Accepted', 'مقبول') : t2('Pending', 'معلق')) + '</span>' +
        '</div>' +
        '<div class="settings-row" data-enhancement="legal-links">' +
          '<span class="settings-row-label">' + t2('Privacy & permissions', 'الخصوصية والصلاحيات') + '</span>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">' +
            '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px" onclick="window.__JOCE_OPEN_TERMS__()">' + t2('Terms of Use', 'شروط الاستخدام') + '</button>' +
            '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px" onclick="window.__JOCE_OPEN_PRIVACY__()">' + t2('Privacy Policy', 'سياسة الخصوصية') + '</button>' +
            '<button class="btn btn-secondary" style="height:28px;font-size:11px;padding:0 12px" onclick="window.__JOCE_OPEN_PERMISSIONS__()">' + t2('View permissions', 'عرض الصلاحيات') + '</button>' +
          '</div>' +
        '</div>'
      );
    }
  }

  function importProjectFlat() {
    const input = document.getElementById('projectImportInput');
    if (input) input.click();
  }

  function makeProjectImportInput() {
    if (document.getElementById('projectImportInput')) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'projectImportInput';
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.multiple = true;
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', async function (e) {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      let count = 0;
      const roots = new Set();
      for (const file of files) {
        const rel = file.webkitRelativePath || file.name || '';
        const parts = rel.split('/').filter(Boolean);
        if (!parts.length) continue;
        roots.add(parts[0]);
        const flattened = parts.length > 1 ? parts.slice(1).join('/') : parts[0];
        const content = await file.text().catch(function () { return ''; });
        FS.createFile(flattened, content);
        count++;
      }
      if (roots.size === 1) {
        const rootName = Array.from(roots)[0];
        document.getElementById('projectName').textContent = rootName;
      }
      if (typeof UI !== 'undefined') {
        UI.renderFileTree();
        UI.renderTabs();
      }
      Storage.saveProject();
      if (typeof showToast === 'function') showToast(count + ' file(s) imported as a project', 'success');
      this.value = '';
    });
  }

  function replaceImportProject() {
    const original = window.importProject;
    window.importProject = function () {
      const folderInfo = State.selectedItem && State.folders && State.folders.has(State.selectedItem) ? State.selectedItem : '';
      makeProjectImportInput();
      showModal(t2('Import Project', 'استيراد المشروع'),
        '<div style="display:flex;flex-direction:column;gap:12px">' +
          '<button class="btn btn-secondary" style="width:100%;height:44px;justify-content:center" onclick="document.getElementById(\'fileImportInput\').click();closeModal()">' + icon('file',18,18) + ' ' + t2('Import files', 'استيراد ملفات') + '</button>' +
          '<button class="btn btn-secondary" style="width:100%;height:44px;justify-content:center" onclick="document.getElementById(\'folderImportInput\').click();closeModal()">' + icon('folder',18,18) + ' ' + t2('Import folder (keep root)', 'استيراد مجلد (مع الاحتفاظ بالجذر)') + '</button>' +
          '<button class="btn btn-secondary" style="width:100%;height:44px;justify-content:center" onclick="window.__JOCE_IMPORT_PROJECT_FLAT__();closeModal()">' + icon('package',18,18) + ' ' + t2('Import project (flatten root)', 'استيراد مشروع (بدون المجلد الأساسي)') + '</button>' +
          '<button class="btn btn-secondary" style="width:100%;height:44px;justify-content:center' + (folderInfo ? '' : ';opacity:.55') + '" onclick="' + (folderInfo ? "importFilesToFolder('" + folderInfo.replace(/'/g, "\\'") + "');closeModal()" : 'closeModal()') + '">' + icon('upload',18,18) + ' ' + t2('Import files into selected folder', 'استيراد ملفات للمجلد المحدد') + '</button>' +
          '<p style="font-size:11px;color:var(--text-tertiary);text-align:center;margin-top:8px">' + t2('Folders can be flattened or kept as-is.', 'يمكن استيراد المجلد كما هو أو مع تفريغ الجذر.') + '</p>' +
        '</div>', false);
    };
  }

  function patchShowModal() {
    const original = window.showModal;
    if (!original || original.__jocePatched) return;
    const wrapped = function () {
      const out = original.apply(this, arguments);
      setTimeout(function () {
        try { enhanceSettingsModal(); } catch (e) {}
      }, 0);
      return out;
    };
    wrapped.__jocePatched = true;
    window.showModal = wrapped;
  }

  function patchImportInputs() {
    const fileInput = document.getElementById('fileImportInput');
    const folderInput = document.getElementById('folderImportInput');
    const filesToFolderInput = document.getElementById('filesToFolderInput');
    if (fileInput && !fileInput.__jocePatched) {
      fileInput.__jocePatched = true;
      fileInput.setAttribute('multiple', '');
    }
    if (folderInput && !folderInput.__jocePatched) {
      folderInput.__jocePatched = true;
      folderInput.setAttribute('multiple', '');
    }
    if (filesToFolderInput && !filesToFolderInput.__jocePatched) {
      filesToFolderInput.__jocePatched = true;
      filesToFolderInput.setAttribute('multiple', '');
    }
  }

  function patchSelectionIndicators() {
    if (!State.selectedPaths) State.selectedPaths = new Set();
    syncTreeSelection();
    installExplorerSelectionHooks();
  }

  function init() {
    ensureBodyAttrs();
    makeProjectImportInput();
    patchShowModal();
    replaceImportProject();
    patchContextMenu();

          return '<button type="button" class="joce-settings-tab' + active + '" style="border-radius:12px" onclick="window.__JOCE_THEME_PRESET__(\'' + id + '\')">' + escapeHtml(p.label) + '</button>';
    window.__JOCE_UI_SCALE__ = function (v) { applyUiScale(v); };
    window.__JOCE_BG_SCOPE__ = function (scope) { applyBackgroundScope(scope); };
    window.__JOCE_OPEN_DEV__ = function () { openDeveloperCenter(); };
    window.__JOCE_OPEN_TERMS__ = function () { openLegalDoc('terms'); };
    window.__JOCE_OPEN_PRIVACY__ = function () { openLegalDoc('privacy'); };
    window.__JOCE_OPEN_PERMISSIONS__ = function () { openLegalDoc('permissions'); };
    window.__JOCE_CLAIM_DEV__ = function () { claimDeveloperDevice(); };
    window.__JOCE_BULK_DELETE__ = function () { bulkDeleteSelected(); };
    window.__JOCE_BULK_DUPLICATE__ = function () { bulkDuplicateSelected(); };
    window.__JOCE_BULK_MOVE__ = function () { bulkMoveSelected(); };
    window.__JOCE_BULK_EXPORT__ = function () { bulkExportSelected(); };
    window.__JOCE_IMPORT_PROJECT_FLAT__ = function () { importProjectFlat(); };
    window.__JOCE_OPEN_UPDATES__ = function () { openUpdateLog(); };
    window.__JOCE_MARK_READ__ = function () { markUpdateLogRead(); };

    if (typeof openUpdateLog === 'function') {
      const prev = window.openUpdateLog;
      window.openUpdateLog = function () {
        return openUpdateLog();
      };
    } else {
      window.openUpdateLog = openUpdateLog;
    }

    if (typeof toggleFullscreen === 'function') {
      const prevFs = window.toggleFullscreen;
      window.toggleFullscreen = function () {
        const res = prevFs.apply(this, arguments);
        syncTreeSelection();
        return res;
      };
    }

    if (typeof applyBackground === 'function') {
      const prevBg = window.applyBackground;
      window.applyBackground = function () {
        const res = prevBg.apply(this, arguments);
        applyBackgroundScope(prefs.bgScope || 'full');
        return res;
      };
    }

    if (typeof Storage !== 'undefined' && Storage.saveSettings) {
      const prevSave = Storage.saveSettings.bind(Storage);
      Storage.saveSettings = function () {
        try {
          prevSave();
        } catch (e) {}
        persist();
      };
    }

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.modal') && !e.target.closest('.bulk-actions-bar')) {
        // no-op
      }
    });

    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        const tree = document.getElementById('fileTree');
        if (tree && tree.contains(document.activeElement) || document.activeElement === document.body) {
          e.preventDefault();
          ensureSelectionStore();
          State.selectedPaths = new Set((State.files ? Object.keys(State.files) : []).concat(State.folders ? Array.from(State.folders) : []));
          syncTreeSelection();
          if (typeof showToast === 'function') showToast(t2('All items selected', 'تم تحديد الكل'), 'info');
        }
      }
    });

    if (typeof UI !== 'undefined' && UI.renderFileTree) {
      const prevRender = UI.renderFileTree.bind(UI);
      UI.renderFileTree = function () {
        const out = prevRender();
        setTimeout(function () {
          installExplorerSelectionHooks();
          syncTreeSelection();
        }, 0);
        return out;
      };
    }


    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    }

    const obs = new MutationObserver(function () {
      try { patchImportInputs(); enhanceSettingsModal(); } catch (e) {}
    });
    obs.observe(document.body, { childList: true, subtree: true });

    setTimeout(function () {
      patchImportInputs();
      patchSelectionIndicators();
      enhanceSettingsModal();
      applyThemePreset(prefs.themePreset || 'matrix');
      applyBackgroundScope(prefs.bgScope || 'full');
      if (prefs.developerToken) {
        // keep device claimed
      }
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();