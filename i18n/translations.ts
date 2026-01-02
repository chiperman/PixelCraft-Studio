import { Language } from '../types';

export const getSystemLanguage = (): Language => {
    const lang = navigator.language;
    if (lang.startsWith('zh-TW') || lang.startsWith('zh-HK')) return 'zh-HK';
    if (lang.startsWith('zh')) return 'zh-CN';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('pt')) return 'pt-BR';
    if (lang.startsWith('ru')) return 'ru';
    if (lang.startsWith('ar')) return 'ar';
    return 'en';
};

export const SUPPORTED_LANGUAGES = [
    { code: 'en', label: '🇺🇸 English' },
    { code: 'zh-CN', label: '🇨🇳 简体中文' },
    { code: 'zh-HK', label: '🇭🇰 繁體中文' },
    { code: 'ja', label: '🇯🇵 日本語' },
    { code: 'ko', label: '🇰🇷 한국어' },
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'de', label: '🇩🇪 Deutsch' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'pt-BR', label: '🇧🇷 Português' },
    { code: 'ru', label: '🇷🇺 Русский' },
    { code: 'ar', label: '🇸🇦 العربية' },
];

export const TRANSLATIONS: Record<Language, any> = {
    en: {
        tools: {
            pencil: 'Pencil',
            eraser: 'Eraser',
            fill: 'Fill Bucket',
            picker: 'Color Picker',
        },
        headers: {
            tools: 'Tools',
            palette: 'Palette',
            actions: 'Actions',
            custom: 'Custom'
        },
        actions: {
            importImg: 'Import Image',
            refLayer: 'Ref Layer',
            export: 'Export PNG',
            save: 'Save Project',
            load: 'Load Project',
            clear: 'Clear Canvas',
            library: 'Project Library'
        },
        resize: {
            title: 'Canvas Size',
            warning: 'Warning: Changing canvas size will clear your current drawing history.',
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
            pan: 'Pan',
            gridOn: 'Grid On',
            gridOff: 'Grid Off',
            layers: 'Toggle Drawing Layer',
            refLayer: 'Toggle Reference Layer',
            refOpacity: 'Ref Opacity',
            drawingLayer: 'Layer',
            lightMode: 'Light Mode',
            darkMode: 'Dark Mode',
            systemMode: 'System',
            language: 'Language',
            customTooltip: 'Click to select, Double-click to edit'
        },
        library: {
            title: 'Project Library',
            saveCurrent: 'Save Current to Library',
            placeholder: 'Project Name...',
            empty: 'No saved projects.',
            load: 'Load',
            rename: 'Rename',
            delete: 'Delete',
            deleteConfirm: 'Delete this project?',
            projectsCount: (n: number) => `${n} Projects`,
            untitled: 'Untitled Project',
            emptyDesc: 'Your creative journey starts here. Save your first masterpiece to see it appear in this collection.',
            exportJSON: 'Export JSON'
        },
        notifications: {
            projectLoaded: 'Project loaded!',
            loadError: 'Failed to load project',
            projectSaved: 'Project saved successfully!',
            cleared: 'Canvas cleared',
            converted: 'Image converted to pixel art!',
            convertError: 'Failed to convert image',
            refSet: 'Background reference set!',
            exported: 'Image exported!',
            resized: (w: number, h: number) => `Canvas resized to ${w}x${h}`,
            librarySaved: 'Project saved to library!',
            libraryDeleted: 'Project deleted.',
            libraryLoaded: 'Project loaded from library!'
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
                project: { title: 'Project', desc: 'Save/Load .json projects, Export to PNG, and use Library.' },
                shortcuts: { title: 'Shortcuts', desc: 'Key bindings for tools and actions.' }
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
            clear: '清空画布',
            library: '项目库'
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
            pan: '平移',
            gridOn: '显示网格',
            gridOff: '隐藏网格',
            layers: '切换绘画图层',
            refLayer: '切换参考图层',
            refOpacity: '参考透明度',
            drawingLayer: '图层',
            lightMode: '浅色模式',
            darkMode: '深色模式',
            systemMode: '跟随系统',
            language: '语言',
            customTooltip: '单击选择，双击编辑'
        },
        library: {
            title: '项目库',
            saveCurrent: '保存当前项目',
            placeholder: '项目名称...',
            empty: '暂无保存的项目',
            load: '加载',
            rename: '重命名',
            delete: '删除',
            deleteConfirm: '确定要删除这个项目吗？',
            projectsCount: (n: number) => `共 ${n} 个项目`,
            untitled: '未命名项目',
            emptyDesc: '您的创作之旅由此开始。保存您的第一个杰作，它将显示在这里。',
            exportJSON: '导出 JSON'
        },
        notifications: {
            projectLoaded: '项目已加载！',
            loadError: '加载项目失败',
            projectSaved: '项目保存成功！',
            cleared: '画布已清空',
            converted: '图片已转换为像素画！',
            convertError: '图片转换失败',
            refSet: '背景参考图已设置！',
            exported: '图片已导出！',
            resized: (w: number, h: number) => `画布已调整为 ${w}x${h}`,
            librarySaved: '项目已保存到项目库！',
            libraryDeleted: '项目已删除。',
            libraryLoaded: '项目已从项目库加载！'
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
                project: { title: '项目管理', desc: '保存/加载 .json 项目文件，导出 PNG 图片，使用项目库管理多作品。' },
                shortcuts: { title: '快捷键', desc: '工具和操作的键盘快捷方式。' }
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
            clear: '清空畫布',
            library: '專案庫'
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
            pan: '平移',
            gridOn: '顯示網格',
            gridOff: '隱藏網格',
            layers: '切換繪畫圖層',
            refLayer: '切換參考圖層',
            refOpacity: '參考透明度',
            drawingLayer: '圖層',
            lightMode: '淺色模式',
            darkMode: '深色模式',
            systemMode: '跟隨系統',
            language: '語言',
            customTooltip: '點擊選取，雙擊編輯'
        },
        library: {
            title: '專案庫',
            saveCurrent: '儲存目前專案',
            placeholder: '專案名稱...',
            empty: '暫無儲存的專案',
            load: '載入',
            rename: '重新命名',
            delete: '刪除',
            deleteConfirm: '確定要刪除這個專案嗎？',
            projectsCount: (n: number) => `共 ${n} 個專案`,
            untitled: '未命名專案',
            emptyDesc: '您的創作之旅由此開始。儲存您的第一個傑作，它將顯示在這裡。',
            exportJSON: '匯出 JSON'
        },
        notifications: {
            projectLoaded: '專案已載入！',
            loadError: '無法載入專案',
            projectSaved: '專案儲存成功！',
            cleared: '畫布已清空',
            converted: '圖片已轉換為像素畫！',
            convertError: '圖片轉換失敗',
            refSet: '背景參考圖已設定！',
            exported: '圖片已匯出！',
            resized: (w: number, h: number) => `畫布已調整為 ${w}x${h}`,
            librarySaved: '專案已儲存到專案庫！',
            libraryDeleted: '專案已刪除。',
            libraryLoaded: '專案已從專案庫載入！'
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
                project: { title: '專案管理', desc: '儲存/載入 .json 專案檔，匯出 PNG 圖片。' },
                shortcuts: { title: '快捷鍵', desc: '工具與動作的鍵盤快捷鍵。' }
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
            clear: 'クリア',
            library: 'ライブラリ'
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
            pan: '移動',
            gridOn: 'グリッド表示',
            gridOff: 'グリッド非表示',
            layers: '描画レイヤー切替',
            refLayer: '参照レイヤー切替',
            refOpacity: '参照不透明度',
            drawingLayer: 'レイヤー',
            lightMode: 'ライト',
            darkMode: 'ダーク',
            systemMode: 'システム設定',
            language: '言語',
            customTooltip: 'クリックで選択、ダブルクリックで編集'
        },
        library: {
            title: 'プロジェクトライブラリ',
            saveCurrent: 'ライブラリに保存',
            placeholder: 'プロジェクト名...',
            empty: '保存されたプロジェクトはありません',
            load: '読込',
            rename: '名前変更',
            delete: '削除',
            deleteConfirm: 'このプロジェクトを削除しますか？',
            projectsCount: (n: number) => `${n} プロジェクト`,
            untitled: '無題のプロジェクト',
            emptyDesc: '創作の旅はここから始まります。最初の傑作を保存して、ここに表示させましょう。',
            exportJSON: 'JSON出力'
        },
        notifications: {
            projectLoaded: 'プロジェクトを読み込みました！',
            loadError: '読み込みに失敗しました',
            projectSaved: 'プロジェクトを保存しました！',
            cleared: 'キャンバスをクリアしました',
            converted: '画像をドット絵に変換しました！',
            convertError: '画像の変換に失敗しました',
            refSet: '背景参照画像を設定しました！',
            exported: '画像をエクスポートしました！',
            resized: (w: number, h: number) => `キャンバスサイズを ${w}x${h} に変更しました`,
            librarySaved: 'ライブラリに保存しました！',
            libraryDeleted: '削除しました。',
            libraryLoaded: 'ライブラリから読み込みました！'
        },
        tutorial: {
            title: '使い方ガイド',
            close: '始める',
            github: 'GitHub',
            sections: {
                tools: { title: '基本ツール', desc: '鉛筆、消しゴム、塗りつぶし、スポイト。' },
                colors: { title: 'カラー', desc: 'プリセットまたはカスタム。カスタム色はダブルクリックで編集可能。' },
                nav: { title: '操作', desc: '拡大縮小：Ctrl+スクロール。移動：スペースキー+ドラッグ。' },
                layers: { title: 'レイヤー', desc: '描画/参照レイヤー의 표시切替。参照画像の不透明度調整。' },
                images: { title: '画像', desc: '「画像読込」でドット絵変換。「参照画像」でトレース用背景設定。' },
                project: { title: 'プロジェクト', desc: '.json形式で保存/読込、PNGでエクスポート。' },
                shortcuts: { title: 'ショートカット', desc: 'ツールとアクションのキー割り当て。' }
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
            clear: '캔버스 지우기',
            library: '라이브러리'
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
            pan: '이동',
            gridOn: '그리드 켜기',
            gridOff: '그리드 끄기',
            layers: '그리기 레이어 토글',
            refLayer: '참조 레이어 토글',
            refOpacity: '참조 투명도',
            drawingLayer: '레이어',
            lightMode: '라이트 모드',
            darkMode: '다크 모드',
            systemMode: '시스템 설정',
            language: '언어',
            customTooltip: '클릭하여 선택, 더블 클릭하여 편집'
        },
        library: {
            title: '프로젝트 라이브러리',
            saveCurrent: '라이브러리에 저장',
            placeholder: '프로젝트 이름...',
            empty: '저장된 프로젝트가 없습니다',
            load: '불러오기',
            rename: '이름 변경',
            delete: '삭제',
            deleteConfirm: '이 프로젝트를 삭제하시겠습니까?',
            projectsCount: (n: number) => `${n} 프로젝트`,
            untitled: '제목 없는 프로젝트',
            emptyDesc: '창의적인 여정이 여기서 시작됩니다. 첫 번째 걸작을 저장하여 여기에 표시하세요.',
            exportJSON: 'JSON 내보내기'
        },
        notifications: {
            projectLoaded: '프로젝트를 불러왔습니다!',
            loadError: '불러오기 실패',
            projectSaved: '프로젝트가 저장되었습니다!',
            cleared: '캔버스 초기화 완료',
            converted: '이미지가 픽셀 아트로 변환되었습니다!',
            convertError: '이미지 변환 실패',
            refSet: '배경 참조가 설정되었습니다!',
            exported: '이미지가 내보내졌습니다!',
            resized: (w: number, h: number) => `캔버스 크기가 ${w}x${h}로 조정되었습니다`,
            librarySaved: '라이브러리에 저장되었습니다!',
            libraryDeleted: '삭제되었습니다.',
            libraryLoaded: '라이브러리에서 불러왔습니다!'
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
                project: { title: '프로젝트', desc: '.json 프로젝트 저장/불러오기 및 PNG 내보내기.' },
                shortcuts: { title: '단축키', desc: '도구 및 동작에 대한 키보드 단축키.' }
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
            clear: 'Effacer',
            library: 'Bibliothèque'
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
            pan: 'Déplacer',
            gridOn: 'Grille On',
            gridOff: 'Grille Off',
            layers: 'Afficher Dessin',
            refLayer: 'Afficher Réf',
            refOpacity: 'Opacité Réf',
            drawingLayer: 'Calque',
            lightMode: 'Mode Clair',
            darkMode: 'Mode Sombre',
            systemMode: 'Système',
            language: 'Langue',
            customTooltip: 'Cliquez pour sélectionner, double-cliquez pour modifier'
        },
        library: {
            title: 'Bibliothèque de projets',
            saveCurrent: 'Enregistrer dans la bibliothèque',
            placeholder: 'Nom du projet...',
            empty: 'Aucun projet enregistré',
            load: 'Charger',
            rename: 'Renommer',
            delete: 'Supprimer',
            deleteConfirm: 'Supprimer ce projet ?',
            projectsCount: (n: number) => `${n} Projets`,
            untitled: 'Projet sans titre',
            emptyDesc: 'Votre voyage créatif commence ici. Enregistrez votre premier chef-d\'œuvre pour le voir apparaître ici.',
            exportJSON: 'Exporter JSON'
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
            resized: (w: number, h: number) => `Redimensionné à ${w}x${h}`,
            librarySaved: 'Projet enregistré !',
            libraryDeleted: 'Projet supprimé.',
            libraryLoaded: 'Projet chargé !'
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
                project: { title: 'Projet', desc: 'Sauvegarder/Charger .json et Exporter PNG.' },
                shortcuts: { title: 'Raccourcis', desc: 'Raccourcis clavier pour les outils et les actions.' }
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
            clear: 'Leeren',
            library: 'Bibliothek'
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
            pan: 'Bewegen',
            gridOn: 'Raster Ein',
            gridOff: 'Raster Aus',
            layers: 'Zeichnungsebene',
            refLayer: 'Referenzebene',
            refOpacity: 'Ref Deckkraft',
            drawingLayer: 'Ebene',
            lightMode: 'Hell',
            darkMode: 'Dunkel',
            systemMode: 'System',
            language: 'Sprache',
            customTooltip: 'Klicken zum Auswählen, Doppelklick zum Bearbeiten'
        },
        library: {
            title: 'Projektbibliothek',
            saveCurrent: 'In Bibliothek speichern',
            placeholder: 'Projektname...',
            empty: 'Keine gespeicherten Projekte',
            load: 'Laden',
            rename: 'Umbenennen',
            delete: 'Löschen',
            deleteConfirm: 'Dieses Projekt löschen?',
            projectsCount: (n: number) => `${n} Projekte`,
            untitled: 'Unbenanntes Projekt',
            emptyDesc: 'Ihre kreative Reise beginnt hier. Speichern Sie Ihr erstes Meisterwerk, damit es hier erscheint.',
            exportJSON: 'JSON exportieren'
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
            resized: (w: number, h: number) => `Größe auf ${w}x${h} geändert`,
            librarySaved: 'Projekt in Bibliothek gespeichert!',
            libraryDeleted: 'Projekt gelöscht.',
            libraryLoaded: 'Projekt aus Bibliothek geladen!'
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
                project: { title: 'Projekt', desc: '.json speichern/laden und PNG exportieren.' },
                shortcuts: { title: 'Tastenkürzel', desc: 'Tastenkürzel für Werkzeuge und Aktionen.' }
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
            clear: 'Limpiar',
            library: 'Biblioteca'
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
            pan: 'Mover',
            gridOn: 'Ver Rejilla',
            gridOff: 'Ocultar Rejilla',
            layers: 'Capa Dibujo',
            refLayer: 'Capa Ref',
            refOpacity: 'Opacidad Ref',
            drawingLayer: 'Capa',
            lightMode: 'Modo Claro',
            darkMode: 'Modo Oscuro',
            systemMode: 'Sistema',
            language: 'Idioma',
            customTooltip: 'Clic para seleccionar, doble clic para editar'
        },
        library: {
            title: 'Biblioteca',
            saveCurrent: 'Guardar en biblioteca',
            placeholder: 'Nombre del proyecto...',
            empty: 'No hay proyectos guardados',
            load: 'Cargar',
            rename: 'Renombrar',
            delete: 'Eliminar',
            deleteConfirm: '¿Eliminar este proyecto?',
            projectsCount: (n: number) => `${n} Proyectos`,
            untitled: 'Proyecto sin título',
            emptyDesc: 'Tu viaje creativo comienza aquí. Guarda tu primera obra maestra para verla aquí.',
            exportJSON: 'Exportar JSON'
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
            resized: (w: number, h: number) => `Redimensionado a ${w}x${h}`,
            librarySaved: '¡Proyecto guardado en biblioteca!',
            libraryDeleted: 'Proyecto eliminado.',
            libraryLoaded: '¡Proyecto cargado desde biblioteca!'
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
                project: { title: 'Proyecto', desc: 'Guardar/Cargar .json y Exportar PNG.' },
                shortcuts: { title: 'Atajos', desc: 'Atajos de teclado para herramientas y acciones.' }
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
            clear: 'Limpar Tela',
            library: 'Biblioteca'
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
            pan: 'Mover',
            gridOn: 'Grade On',
            gridOff: 'Grade Off',
            layers: 'Camada de Desenho',
            refLayer: 'Camada de Ref',
            refOpacity: 'Opacidade Ref',
            drawingLayer: 'Camada',
            lightMode: 'Modo Claro',
            darkMode: 'Modo Escuro',
            systemMode: 'Sistema',
            language: 'Idioma',
            customTooltip: 'Clique para selecionar, clique duplo para editar'
        },
        library: {
            title: 'Biblioteca',
            saveCurrent: 'Salvar na biblioteca',
            placeholder: 'Nome do projeto...',
            empty: 'Nenhum projeto salvo',
            load: 'Carregar',
            rename: 'Renommer',
            delete: 'Excluir',
            deleteConfirm: 'Excluir este projeto?',
            projectsCount: (n: number) => `${n} Projetos`,
            untitled: 'Projeto sem título',
            emptyDesc: 'Sua jornada criativa começa aqui. Salve sua primeira obra-prima para vê-la aparecer aqui.',
            exportJSON: 'Exportar JSON'
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
            resized: (w: number, h: number) => `Redimensionado para ${w}x${h}`,
            librarySaved: 'Projeto salvo na biblioteca!',
            libraryDeleted: 'Projeto excluído.',
            libraryLoaded: 'Projeto carregado da biblioteca!'
        },
        tutorial: {
            title: 'Guia',
            close: 'Começar',
            github: 'GitHub',
            sections: {
                tools: { title: 'Ferramentas', desc: 'Lápis, Borracha, Balde, Conta-gotas.' },
                colors: { title: 'Cores', desc: 'Clique duplo nas cores personalizadas para editar.' },
                nav: { title: 'Navegação', desc: 'Zoom: Ctrl+Roda. Mover: Espacio+Arrastrar.' },
                layers: { title: 'Camadas', desc: 'Gerenciar camadas de desenho e referência.' },
                images: { title: 'Imagens', desc: 'Converter para pixels ou usar como referência.' },
                project: { title: 'Projeto', desc: 'Salvar/Carregar .json e Exportar PNG.' },
                shortcuts: { title: 'Atalhos', desc: 'Atalhos de teclado para ferramentas y ações.' }
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
            clear: 'Очистить',
            library: 'Библиотека'
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
            pan: 'Панорама',
            gridOn: 'Сетка вкл',
            gridOff: 'Сетка выкл',
            layers: 'Слой рис.',
            refLayer: 'Слой реф.',
            refOpacity: 'Прозр. реф.',
            drawingLayer: 'Слой',
            lightMode: 'Светлая',
            darkMode: 'Темная',
            systemMode: 'Системная',
            language: 'Язык',
            customTooltip: 'Клик для выбора, двойной клик для редактирования'
        },
        library: {
            title: 'Библиотека проектов',
            saveCurrent: 'Сохранить в библиотеку',
            placeholder: 'Название проекта...',
            empty: 'Нет сохраненных проектов',
            load: 'Загрузить',
            rename: 'Переименовать',
            delete: 'Удалить',
            deleteConfirm: 'Удалить этот проект?',
            projectsCount: (n: number) => `${n} Проектов`,
            untitled: 'Безымянный проект',
            emptyDesc: 'Ваше творческое путешествие начинается здесь. Сохраните свой первый шедевр, чтобы увидеть его здесь.',
            exportJSON: 'Экспорт JSON'
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
            resized: (w: number, h: number) => `Размер изменен на ${w}x${h}`,
            librarySaved: 'Проект сохранен в библиотеку!',
            libraryDeleted: 'Проект удален.',
            libraryLoaded: 'Проект загружен из библиотеки!'
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
                project: { title: 'Проект', desc: 'Сохранить/Открыть .json и Экспорт PNG.' },
                shortcuts: { title: 'Горячие клавиши', desc: 'Горячие клавиши для инструментов и действий.' }
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
            clear: 'مسح اللوحة',
            library: 'المكتبة'
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
            pan: 'تحريك',
            gridOn: 'شبكة تشغيل',
            gridOff: 'شبكة إيقاف',
            layers: 'طبقة الرسم',
            refLayer: 'طبقة المرجع',
            refOpacity: 'شفافية المرجع',
            drawingLayer: 'طبقة',
            lightMode: 'وضع فاتح',
            darkMode: 'وضع داكن',
            systemMode: 'النظام',
            language: 'اللغة',
            customTooltip: 'انقر للتحديد، انقر مرتين للتحرير'
        },
        library: {
            title: 'مكتبة المشاريع',
            saveCurrent: 'حفظ في المكتبة',
            placeholder: 'اسم المشروع...',
            empty: 'لا توجد مشاريع محفوظة',
            load: 'تحميل',
            rename: 'إعادة تسمية',
            delete: 'حذف',
            deleteConfirm: 'هل تريد حذف هذا المشروع؟',
            projectsCount: (n: number) => `${n} مشاريع`,
            untitled: 'مشروع بدون عنوان',
            emptyDesc: 'رحلتك الإبداعية تبدأ هنا. احفظ تحفتك الأولى لتظهر هنا.',
            exportJSON: 'تصدير JSON'
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
            resized: (w: number, h: number) => `تم تغيير الحجم إلى ${w}x${h}`,
            librarySaved: 'تم حفظ المشروع في المكتبة!',
            libraryDeleted: 'تم حذف المشروع.',
            libraryLoaded: 'تم تحميل المشروع من المكتبة!'
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
                project: { title: 'المشروع', desc: 'حفظ/تحميل .json وتصدير PNG.' },
                shortcuts: { title: 'اختصارات', desc: 'اختصارات لوحة المفاتيح للأدوات والإجراءات.' }
            }
        }
    }
};
