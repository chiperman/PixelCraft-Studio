

import { GridConfig } from './types';

// Convert RGB(A) to Hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Flood Fill Algorithm
export const floodFill = (
  grid: string[],
  config: GridConfig,
  x: number,
  y: number,
  targetColor: string,
  replacementColor: string
): string[] => {
  const index = y * config.width + x;
  if (index < 0 || index >= grid.length) return grid;
  
  const currentColor = grid[index];
  if (currentColor === replacementColor) return grid;

  const newGrid = [...grid];
  const queue: [number, number][] = [[x, y]];
  
  while (queue.length > 0) {
    const [cx, cy] = queue.pop()!;
    const cIndex = cy * config.width + cx;
    
    if (newGrid[cIndex] === currentColor) {
      newGrid[cIndex] = replacementColor;
      
      if (cx + 1 < config.width) queue.push([cx + 1, cy]);
      if (cx - 1 >= 0) queue.push([cx - 1, cy]);
      if (cy + 1 < config.height) queue.push([cx, cy + 1]);
      if (cy - 1 >= 0) queue.push([cx, cy - 1]);
    }
  }
  return newGrid;
};

// Convert Image to Pixel Grid
export const imageToPixelGrid = (
  imageSrc: string,
  width: number,
  height: number
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Draw image resized to grid dimensions (nearest neighbor automatically handled by canvas somewhat, 
      // but explicit sizing does the downsampling)
      ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const grid: string[] = [];
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        // Treat transparent as empty string (or white/null)
        if (a < 128) {
            grid.push(''); // Transparent
        } else {
            grid.push(rgbToHex(r, g, b));
        }
      }
      resolve(grid);
    };
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });
};

export const TRANSLATIONS = {
  en: {
    tools: {
      pencil: 'Pencil',
      eraser: 'Eraser',
      fill: 'Fill',
      picker: 'Picker',
    },
    headers: {
      tools: 'Tools',
      palette: 'Palette',
      actions: 'Actions',
      custom: 'Custom'
    },
    actions: {
      importImg: 'Import Img',
      refLayer: 'Ref Layer',
      export: 'Export PNG',
      save: 'Save Project',
      load: 'Load Project',
      clear: 'Clear Canvas'
    },
    resize: {
      title: 'Canvas Size',
      warning: 'Warning: Resizing the canvas will clear your current artwork history.',
      presets: 'Quick Presets',
      width: 'Width (px)',
      height: 'Height (px)',
      cancel: 'Cancel',
      apply: 'Apply New Size'
    },
    ui: {
      undo: 'Undo',
      redo: 'Redo',
      zoom: 'Zoom',
      gridOn: 'Grid On',
      gridOff: 'Grid Off',
      layers: 'Toggle Drawing Layer',
      refLayer: 'Toggle Reference Layer',
      refOpacity: 'Ref Opacity',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      systemMode: 'System',
      language: 'Language'
    },
    notifications: {
      projectLoaded: 'Project loaded!',
      loadError: 'Failed to load project',
      projectSaved: 'Project saved successfully!',
      cleared: 'Canvas and reference layer cleared',
      converted: 'Image converted to pixel art!',
      convertError: 'Failed to convert image',
      refSet: 'Background reference set!',
      exported: 'Image exported!',
      resized: (w: number, h: number) => `Canvas resized to ${w}x${h}`
    },
    tutorial: {
      title: 'PixelCraft Guide',
      close: 'Start Creating',
      github: 'GitHub',
      sections: {
        tools: { title: 'Basic Tools', desc: 'Pencil, Eraser, Fill Bucket, and Color Picker.' },
        colors: { title: 'Colors', desc: 'Use presets or Custom slots. Double-click custom slots to edit.' },
        nav: { title: 'Navigation', desc: 'Zoom: Slider or Ctrl+Scroll. Pan: Hold Space+Drag or Middle Mouse.' },
        layers: { title: 'Layers', desc: 'Toggle Drawing & Reference layers. Adjust Reference Opacity.' },
        images: { title: 'Images', desc: '"Import" to convert image to pixels. "Ref Layer" for tracing background.' },
        project: { title: 'Project', desc: 'Save/Load .json projects and Export to PNG.' }
      }
    }
  },
  'zh-CN': {
    tools: {
      pencil: '铅笔',
      eraser: '橡皮擦',
      fill: '填充',
      picker: '取色器',
    },
    headers: {
      tools: '工具',
      palette: '调色板',
      actions: '操作',
      custom: '自定义'
    },
    actions: {
      importImg: '导入图片',
      refLayer: '参考图层',
      export: '导出 PNG',
      save: '保存项目',
      load: '加载项目',
      clear: '清空画布'
    },
    resize: {
      title: '画布尺寸',
      warning: '警告：调整画布尺寸将清空当前的绘画历史。',
      presets: '快速预设',
      width: '宽度 (px)',
      height: '高度 (px)',
      cancel: '取消',
      apply: '应用新尺寸'
    },
    ui: {
      undo: '撤销',
      redo: '重做',
      zoom: '缩放',
      gridOn: '显示网格',
      gridOff: '隐藏网格',
      layers: '切换绘画图层',
      refLayer: '切换参考图层',
      refOpacity: '参考透明度',
      lightMode: '浅色模式',
      darkMode: '深色模式',
      systemMode: '跟随系统',
      language: '语言'
    },
    notifications: {
      projectLoaded: '项目已加载！',
      loadError: '加载项目失败',
      projectSaved: '项目保存成功！',
      cleared: '画布和参考图层已清空',
      converted: '图片已转换为像素画！',
      convertError: '图片转换失败',
      refSet: '背景参考图已设置！',
      exported: '图片已导出！',
      resized: (w: number, h: number) => `画布已调整为 ${w}x${h}`
    },
    tutorial: {
      title: '功能教程',
      close: '开始创作',
      github: 'GitHub',
      sections: {
        tools: { title: '基础工具', desc: '铅笔绘画，橡皮擦，油漆桶填充，吸管吸色。' },
        colors: { title: '调色板', desc: '使用预设或自定义色块。双击下方自定义色块可编辑颜色。' },
        nav: { title: '画布导航', desc: '缩放：滑块或 Ctrl+滚轮。平移：按住空格+拖拽或鼠标中键。' },
        layers: { title: '图层管理', desc: '切换绘画/参考图层显示。调整参考图透明度用于临摹。' },
        images: { title: '图片处理', desc: '“导入图片”转换像素画。“参考图层”设置背景垫图。' },
        project: { title: '项目管理', desc: '保存/加载 .json 项目文件，导出 PNG 图片。' }
      }
    }
  },
  'zh-HK': {
    tools: {
      pencil: '鉛筆',
      eraser: '橡皮擦',
      fill: '填色',
      picker: '吸管',
    },
    headers: {
      tools: '工具',
      palette: '調色盤',
      actions: '動作',
      custom: '自訂'
    },
    actions: {
      importImg: '匯入圖片',
      refLayer: '參考圖層',
      export: '匯出 PNG',
      save: '儲存專案',
      load: '載入專案',
      clear: '清空畫布'
    },
    resize: {
      title: '畫布尺寸',
      warning: '警告：調整畫布尺寸將清空目前的繪畫紀錄。',
      presets: '快速預設',
      width: '寬度 (px)',
      height: '高度 (px)',
      cancel: '取消',
      apply: '應用新尺寸'
    },
    ui: {
      undo: '復原',
      redo: '重做',
      zoom: '縮放',
      gridOn: '顯示網格',
      gridOff: '隱藏網格',
      layers: '切換繪畫圖層',
      refLayer: '切換參考圖層',
      refOpacity: '參考透明度',
      lightMode: '淺色模式',
      darkMode: '深色模式',
      systemMode: '跟隨系統',
      language: '語言'
    },
    notifications: {
      projectLoaded: '專案已載入！',
      loadError: '無法載入專案',
      projectSaved: '專案儲存成功！',
      cleared: '畫布和參考圖層已清空',
      converted: '圖片已轉換為像素畫！',
      convertError: '圖片轉換失敗',
      refSet: '背景參考圖已設定！',
      exported: '圖片已匯出！',
      resized: (w: number, h: number) => `畫布已調整為 ${w}x${h}`
    },
    tutorial: {
      title: '功能教學',
      close: '開始創作',
      github: 'GitHub',
      sections: {
        tools: { title: '基礎工具', desc: '鉛筆繪畫，橡皮擦，油漆桶填色，吸管吸色。' },
        colors: { title: '調色盤', desc: '使用預設或自訂色塊。雙擊下方自訂色塊可編輯顏色。' },
        nav: { title: '畫布導航', desc: '縮放：滑桿或 Ctrl+滾輪。平移：按住空白鍵+拖曳或滑鼠中鍵。' },
        layers: { title: '圖層管理', desc: '切換繪畫/參考圖層顯示。調整參考圖透明度用於臨摹。' },
        images: { title: '圖片處理', desc: '「匯入圖片」轉換像素畫。「參考圖層」設定背景墊圖。' },
        project: { title: '專案管理', desc: '儲存/載入 .json 專案檔，匯出 PNG 圖片。' }
      }
    }
  },
  ja: {
     tools: {
      pencil: '鉛筆',
      eraser: '消しゴム',
      fill: '塗りつぶし',
      picker: 'スポイト',
    },
    headers: {
      tools: 'ツール',
      palette: 'パレット',
      actions: 'アクション',
      custom: 'カスタム'
    },
    actions: {
      importImg: '画像読込',
      refLayer: '参照画像',
      export: 'PNG出力',
      save: '保存',
      load: '開く',
      clear: 'クリア'
    },
    resize: {
      title: 'キャンバスサイズ',
      warning: '警告：キャンバスサイズを変更すると、現在の履歴が消去されます。',
      presets: 'プリセット',
      width: '幅 (px)',
      height: '高さ (px)',
      cancel: 'キャンセル',
      apply: '変更を適用'
    },
    ui: {
      undo: '元に戻す',
      redo: 'やり直し',
      zoom: 'ズーム',
      gridOn: 'グリッド表示',
      gridOff: 'グリッド非表示',
      layers: '描画レイヤー切替',
      refLayer: '参照レイヤー切替',
      refOpacity: '参照不透明度',
      lightMode: 'ライト',
      darkMode: 'ダーク',
      systemMode: 'システム設定',
      language: '言語'
    },
    notifications: {
      projectLoaded: 'プロジェクトを読み込みました！',
      loadError: '読み込みに失敗しました',
      projectSaved: 'プロジェクトを保存しました！',
      cleared: 'キャンバスと参照レイヤーをクリアしました',
      converted: '画像をドット絵に変換しました！',
      convertError: '画像の変換に失敗しました',
      refSet: '背景参照画像を設定しました！',
      exported: '画像をエクスポートしました！',
      resized: (w: number, h: number) => `キャンバスサイズを ${w}x${h} に変更しました`
    },
    tutorial: {
      title: '使い方ガイド',
      close: '始める',
      github: 'GitHub',
      sections: {
        tools: { title: '基本ツール', desc: '鉛筆、消しゴム、塗りつぶし、スポイト。' },
        colors: { title: 'カラー', desc: 'プリセットまたはカスタム。カスタム色はダブルクリックで編集可能。' },
        nav: { title: '操作', desc: '拡大縮小：Ctrl+スクロール。移動：スペースキー+ドラッグ。' },
        layers: { title: 'レイヤー', desc: '描画/参照レイヤーの表示切替。参照画像の不透明度調整。' },
        images: { title: '画像', desc: '「画像読込」でドット絵変換。「参照画像」でトレース用背景設定。' },
        project: { title: 'プロジェクト', desc: '.json形式で保存/読込、PNGでエクスポート。' }
      }
    }
  },
  ko: {
    tools: {
      pencil: '연필',
      eraser: '지우개',
      fill: '채우기',
      picker: '스포이트',
    },
    headers: {
      tools: '도구',
      palette: '팔레트',
      actions: '동작',
      custom: '사용자 지정'
    },
    actions: {
      importImg: '이미지 가져오기',
      refLayer: '참조 레이어',
      export: 'PNG 내보내기',
      save: '프로젝트 저장',
      load: '프로젝트 열기',
      clear: '캔버스 지우기'
    },
    resize: {
      title: '캔버스 크기',
      warning: '경고: 캔버스 크기를 조정하면 현재 작업 기록이 지워집니다.',
      presets: '빠른 설정',
      width: '너비 (px)',
      height: '높이 (px)',
      cancel: '취소',
      apply: '새 크기 적용'
    },
    ui: {
      undo: '실행 취소',
      redo: '다시 실행',
      zoom: '확대/축소',
      gridOn: '그리드 켜기',
      gridOff: '그리드 끄기',
      layers: '그리기 레이어 토글',
      refLayer: '참조 레이어 토글',
      refOpacity: '참조 투명도',
      lightMode: '라이트 모드',
      darkMode: '다크 모드',
      systemMode: '시스템 설정',
      language: '언어'
    },
    notifications: {
      projectLoaded: '프로젝트를 불러왔습니다!',
      loadError: '불러오기 실패',
      projectSaved: '프로젝트가 저장되었습니다!',
      cleared: '캔버스 및 참조 레이어가 지워졌습니다',
      converted: '이미지가 픽셀 아트로 변환되었습니다!',
      convertError: '이미지 변환 실패',
      refSet: '배경 참조가 설정되었습니다!',
      exported: '이미지가 내보내졌습니다!',
      resized: (w: number, h: number) => `캔버스 크기가 ${w}x${h}로 조정되었습니다`
    },
    tutorial: {
      title: '사용 가이드',
      close: '시작하기',
      github: 'GitHub',
      sections: {
        tools: { title: '기본 도구', desc: '연필, 지우개, 채우기, 스포이트.' },
        colors: { title: '색상', desc: '프리셋 및 사용자 지정. 사용자 지정 색은 더블 클릭하여 편집.' },
        nav: { title: '탐색', desc: '확대/축소: Ctrl+스크롤. 이동: 스페이스바+드래그.' },
        layers: { title: '레이어', desc: '그리기/참조 레이어 전환. 참조 불투명도 조절.' },
        images: { title: '이미지', desc: '이미지를 픽셀로 변환하거나 참조 배경으로 설정.' },
        project: { title: '프로젝트', desc: '.json 프로젝트 저장/불러오기 및 PNG 내보내기.' }
      }
    }
  },
  fr: {
    tools: {
      pencil: 'Crayon',
      eraser: 'Gomme',
      fill: 'Remplir',
      picker: 'Pipette',
    },
    headers: {
      tools: 'Outils',
      palette: 'Palette',
      actions: 'Actions',
      custom: 'Perso'
    },
    actions: {
      importImg: 'Importer Img',
      refLayer: 'Calque Réf',
      export: 'Exporter PNG',
      save: 'Sauvegarder',
      load: 'Ouvrir',
      clear: 'Effacer'
    },
    resize: {
      title: 'Taille du canevas',
      warning: 'Attention : Redimensionner le canevas effacera votre historique actuel.',
      presets: 'Préréglages',
      width: 'Largeur (px)',
      height: 'Hauteur (px)',
      cancel: 'Annuler',
      apply: 'Appliquer'
    },
    ui: {
      undo: 'Annuler',
      redo: 'Refaire',
      zoom: 'Zoom',
      gridOn: 'Grille On',
      gridOff: 'Grille Off',
      layers: 'Afficher Dessin',
      refLayer: 'Afficher Réf',
      refOpacity: 'Opacité Réf',
      lightMode: 'Mode Clair',
      darkMode: 'Mode Sombre',
      systemMode: 'Système',
      language: 'Langue'
    },
    notifications: {
      projectLoaded: 'Projet chargé !',
      loadError: 'Erreur de chargement',
      projectSaved: 'Projet sauvegardé !',
      cleared: 'Canevas effacé',
      converted: 'Image convertie en pixel art !',
      convertError: 'Échec de conversion',
      refSet: 'Image de référence définie !',
      exported: 'Image exportée !',
      resized: (w: number, h: number) => `Redimensionné à ${w}x${h}`
    },
    tutorial: {
      title: 'Guide PixelCraft',
      close: 'Commencer',
      github: 'GitHub',
      sections: {
        tools: { title: 'Outils', desc: 'Crayon, Gomme, Remplissage et Pipette.' },
        colors: { title: 'Couleurs', desc: 'Double-cliquez sur les couleurs personnalisées pour éditer.' },
        nav: { title: 'Navigation', desc: 'Zoom : Ctrl+Molette. Déplacer : Espace+Glisser.' },
        layers: { title: 'Calques', desc: 'Gérer les calques Dessin et Référence.' },
        images: { title: 'Images', desc: 'Convertir en pixels ou utiliser comme référence.' },
        project: { title: 'Projet', desc: 'Sauvegarder/Charger .json et Exporter PNG.' }
      }
    }
  },
  de: {
    tools: {
      pencil: 'Stift',
      eraser: 'Radierer',
      fill: 'Füllen',
      picker: 'Pipette',
    },
    headers: {
      tools: 'Werkzeuge',
      palette: 'Palette',
      actions: 'Aktionen',
      custom: 'Benutzer'
    },
    actions: {
      importImg: 'Bild Import',
      refLayer: 'Ref Ebene',
      export: 'Export PNG',
      save: 'Speichern',
      load: 'Öffnen',
      clear: 'Leeren'
    },
    resize: {
      title: 'Leinwandgröße',
      warning: 'Warnung: Das Ändern der Größe löscht den aktuellen Verlauf.',
      presets: 'Voreinstellungen',
      width: 'Breite (px)',
      height: 'Höhe (px)',
      cancel: 'Abbrechen',
      apply: 'Anwenden'
    },
    ui: {
      undo: 'Rückgängig',
      redo: 'Wiederholen',
      zoom: 'Zoom',
      gridOn: 'Raster Ein',
      gridOff: 'Raster Aus',
      layers: 'Zeichnungsebene',
      refLayer: 'Referenzebene',
      refOpacity: 'Ref Deckkraft',
      lightMode: 'Hell',
      darkMode: 'Dunkel',
      systemMode: 'System',
      language: 'Sprache'
    },
    notifications: {
      projectLoaded: 'Projekt geladen!',
      loadError: 'Ladefehler',
      projectSaved: 'Projekt gespeichert!',
      cleared: 'Alles gelöscht',
      converted: 'Bild konvertiert!',
      convertError: 'Fehler bei Konvertierung',
      refSet: 'Referenzbild gesetzt!',
      exported: 'Bild exportiert!',
      resized: (w: number, h: number) => `Größe auf ${w}x${h} geändert`
    },
    tutorial: {
      title: 'Anleitung',
      close: 'Starten',
      github: 'GitHub',
      sections: {
        tools: { title: 'Werkzeuge', desc: 'Stift, Radierer, Füllen, Pipette.' },
        colors: { title: 'Farben', desc: 'Doppelklick auf benutzerdefinierte Farben zum Bearbeiten.' },
        nav: { title: 'Navigation', desc: 'Zoom: Ctrl+Mausrad. Bewegen: Leertaste+Ziehen.' },
        layers: { title: 'Ebenen', desc: 'Zeichnungs- und Referenzebenen verwalten.' },
        images: { title: 'Bilder', desc: 'In Pixel umwandeln oder als Referenz nutzen.' },
        project: { title: 'Projekt', desc: '.json speichern/laden und PNG exportieren.' }
      }
    }
  },
  es: {
    tools: {
      pencil: 'Lápiz',
      eraser: 'Borrador',
      fill: 'Relleno',
      picker: 'Gotero',
    },
    headers: {
      tools: 'Hrrts',
      palette: 'Paleta',
      actions: 'Acciones',
      custom: 'Pers.'
    },
    actions: {
      importImg: 'Imp. Imagen',
      refLayer: 'Capa Ref',
      export: 'Exportar PNG',
      save: 'Guardar',
      load: 'Cargar',
      clear: 'Limpiar'
    },
    resize: {
      title: 'Tamaño Lienzo',
      warning: 'Advertencia: Cambiar el tamaño borrará el historial actual.',
      presets: 'Preajustes',
      width: 'Ancho (px)',
      height: 'Alto (px)',
      cancel: 'Cancelar',
      apply: 'Aplicar'
    },
    ui: {
      undo: 'Deshacer',
      redo: 'Rehacer',
      zoom: 'Zoom',
      gridOn: 'Ver Rejilla',
      gridOff: 'Ocultar Rejilla',
      layers: 'Capa Dibujo',
      refLayer: 'Capa Ref',
      refOpacity: 'Opacidad Ref',
      lightMode: 'Modo Claro',
      darkMode: 'Modo Oscuro',
      systemMode: 'Sistema',
      language: 'Idioma'
    },
    notifications: {
      projectLoaded: 'Proyecto cargado!',
      loadError: 'Error de carga',
      projectSaved: 'Proyecto guardado!',
      cleared: 'Lienzo limpiado',
      converted: 'Imagen convertida!',
      convertError: 'Error al convertir',
      refSet: 'Referencia establecida!',
      exported: 'Imagen exportada!',
      resized: (w: number, h: number) => `Redimensionado a ${w}x${h}`
    },
    tutorial: {
      title: 'Guía',
      close: 'Empezar',
      github: 'GitHub',
      sections: {
        tools: { title: 'Herramientas', desc: 'Lápiz, Borrador, Cubo, Gotero.' },
        colors: { title: 'Colores', desc: 'Doble clic en colores personalizados para editar.' },
        nav: { title: 'Navegación', desc: 'Zoom: Ctrl+Rueda. Mover: Espacio+Arrastrar.' },
        layers: { title: 'Capas', desc: 'Gestionar capas de dibujo y referencia.' },
        images: { title: 'Imágenes', desc: 'Convertir a píxeles o usar como referencia.' },
        project: { title: 'Proyecto', desc: 'Guardar/Cargar .json y Exportar PNG.' }
      }
    }
  },
  'pt-BR': {
    tools: {
      pencil: 'Lápis',
      eraser: 'Borracha',
      fill: 'Preencher',
      picker: 'Conta-gotas',
    },
    headers: {
      tools: 'Ferramentas',
      palette: 'Paleta',
      actions: 'Ações',
      custom: 'Personalizado'
    },
    actions: {
      importImg: 'Importar Img',
      refLayer: 'Camada Ref',
      export: 'Exportar PNG',
      save: 'Salvar',
      load: 'Carregar',
      clear: 'Limpar Tela'
    },
    resize: {
      title: 'Tamanho da Tela',
      warning: 'Aviso: Redimensionar a tela limpará seu histórico atual.',
      presets: 'Predefinições',
      width: 'Largura (px)',
      height: 'Altura (px)',
      cancel: 'Cancelar',
      apply: 'Aplicar'
    },
    ui: {
      undo: 'Desfazer',
      redo: 'Refazer',
      zoom: 'Zoom',
      gridOn: 'Grade On',
      gridOff: 'Grade Off',
      layers: 'Camada de Desenho',
      refLayer: 'Camada de Ref',
      refOpacity: 'Opacidade Ref',
      lightMode: 'Modo Claro',
      darkMode: 'Modo Escuro',
      systemMode: 'Sistema',
      language: 'Idioma'
    },
    notifications: {
      projectLoaded: 'Projeto carregado!',
      loadError: 'Erro ao carregar',
      projectSaved: 'Projeto salvo!',
      cleared: 'Tela limpa',
      converted: 'Imagem convertida!',
      convertError: 'Erro na conversão',
      refSet: 'Referência definida!',
      exported: 'Imagem exportada!',
      resized: (w: number, h: number) => `Redimensionado para ${w}x${h}`
    },
    tutorial: {
      title: 'Guia',
      close: 'Começar',
      github: 'GitHub',
      sections: {
        tools: { title: 'Ferramentas', desc: 'Lápis, Borracha, Balde, Conta-gotas.' },
        colors: { title: 'Cores', desc: 'Clique duplo nas cores personalizadas para editar.' },
        nav: { title: 'Navegação', desc: 'Zoom: Ctrl+Roda. Mover: Espaço+Arrastar.' },
        layers: { title: 'Camadas', desc: 'Gerenciar camadas de desenho e referência.' },
        images: { title: 'Imagens', desc: 'Converter para pixels ou usar como referência.' },
        project: { title: 'Projeto', desc: 'Salvar/Carregar .json e Exportar PNG.' }
      }
    }
  },
  ru: {
    tools: {
      pencil: 'Карандаш',
      eraser: 'Ластик',
      fill: 'Заливка',
      picker: 'Пипетка',
    },
    headers: {
      tools: 'Инструменты',
      palette: 'Палитра',
      actions: 'Действия',
      custom: 'Свой'
    },
    actions: {
      importImg: 'Импорт',
      refLayer: 'Референс',
      export: 'Экспорт PNG',
      save: 'Сохранить',
      load: 'Открыть',
      clear: 'Очистить'
    },
    resize: {
      title: 'Размер холста',
      warning: 'Внимание: Изменение размера очистит историю.',
      presets: 'Пресеты',
      width: 'Ширина (px)',
      height: 'Высота (px)',
      cancel: 'Отмена',
      apply: 'Применить'
    },
    ui: {
      undo: 'Отменить',
      redo: 'Вернуть',
      zoom: 'Зум',
      gridOn: 'Сетка вкл',
      gridOff: 'Сетка выкл',
      layers: 'Слой рис.',
      refLayer: 'Слой реф.',
      refOpacity: 'Прозр. реф.',
      lightMode: 'Светлая',
      darkMode: 'Темная',
      systemMode: 'Системная',
      language: 'Язык'
    },
    notifications: {
      projectLoaded: 'Проект загружен!',
      loadError: 'Ошибка загрузки',
      projectSaved: 'Проект сохранен!',
      cleared: 'Холст очищен',
      converted: 'Картинка конвертирована!',
      convertError: 'Ошибка конвертации',
      refSet: 'Референс установлен!',
      exported: 'Картинка экспортирована!',
      resized: (w: number, h: number) => `Размер изменен на ${w}x${h}`
    },
    tutorial: {
      title: 'Руководство',
      close: 'Начать',
      github: 'GitHub',
      sections: {
        tools: { title: 'Инструменты', desc: 'Карандаш, Ластик, Заливка, Пипетка.' },
        colors: { title: 'Цвета', desc: 'Двойной клик по своему цвету для редактирования.' },
        nav: { title: 'Навигация', desc: 'Зум: Ctrl+Колесо. Перемещение: Пробел+Тянуть.' },
        layers: { title: 'Слои', desc: 'Управление слоями рисования и референса.' },
        images: { title: 'Изображения', desc: 'Конвертация в пиксели или фон для обводки.' },
        project: { title: 'Проект', desc: 'Сохранить/Открыть .json и Экспорт PNG.' }
      }
    }
  },
  ar: {
    tools: {
      pencil: 'قلم',
      eraser: 'ممحاة',
      fill: 'ملء',
      picker: 'ماصة',
    },
    headers: {
      tools: 'أدوات',
      palette: 'ألوان',
      actions: 'إجراءات',
      custom: 'مخصص'
    },
    actions: {
      importImg: 'استيراد صورة',
      refLayer: 'طبقة مرجعية',
      export: 'تصدير PNG',
      save: 'حفظ المشروع',
      load: 'فتح المشروع',
      clear: 'مسح اللوحة'
    },
    resize: {
      title: 'حجم اللوحة',
      warning: 'تحذير: تغيير الحجم سيؤدي إلى مسح السجل الحالي.',
      presets: 'إعدادات مسبقة',
      width: 'عرض (px)',
      height: 'ارتفاع (px)',
      cancel: 'إلغاء',
      apply: 'تطبيق'
    },
    ui: {
      undo: 'تراجع',
      redo: 'إعادة',
      zoom: 'تكبير/تصغير',
      gridOn: 'شبكة تشغيل',
      gridOff: 'شبكة إيقاف',
      layers: 'طبقة الرسم',
      refLayer: 'طبقة المرجع',
      refOpacity: 'شفافية المرجع',
      lightMode: 'وضع فاتح',
      darkMode: 'وضع داكن',
      systemMode: 'النظام',
      language: 'اللغة'
    },
    notifications: {
      projectLoaded: 'تم تحميل المشروع!',
      loadError: 'فشل التحميل',
      projectSaved: 'تم حفظ المشروع!',
      cleared: 'تم مسح اللوحة',
      converted: 'تم تحويل الصورة!',
      convertError: 'فشل التحويل',
      refSet: 'تم تعيين المرجع!',
      exported: 'تم التصدير!',
      resized: (w: number, h: number) => `تم تغيير الحجم إلى ${w}x${h}`
    },
    tutorial: {
      title: 'دليل الاستخدام',
      close: 'ابدأ الرسم',
      github: 'GitHub',
      sections: {
        tools: { title: 'الأدوات', desc: 'القلم، الممحاة، الملء، والماصة.' },
        colors: { title: 'الألوان', desc: 'انقر نقرًا مزدوجًا على الألوان المخصصة للتحرير.' },
        nav: { title: 'التنقل', desc: 'تكبير: Ctrl+عجلة. تحريك: مسافة+سحب.' },
        layers: { title: 'الطبقات', desc: 'إدارة طبقات الرسم والمرجع.' },
        images: { title: 'الصور', desc: 'تحويل إلى بكسل أو استخدام كخلفية مرجعية.' },
        project: { title: 'المشروع', desc: 'حفظ/تحميل .json وتصدير PNG.' }
      }
    }
  }
};