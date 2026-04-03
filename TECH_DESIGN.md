# TECH_DESIGN

## 技术栈

| 类别 | 选型 | 说明 |
|------|------|------|
| 运行时 | 纯静态 HTML | 无 Node/Vite 构建；GitHub Pages 等静态托管即可 |
| 样式 | **Tailwind CSS**（`cdn.tailwindcss.com`） | Play CDN，按需 utility；主题差异辅以各主题 `styles.css` |
| 图标 | **Font Awesome 6.4**（cdnjs） | 全站统一 `fa` 图标集 |
| 字体 | **Google Fonts — Noto Sans SC** | 子页引入；中文排版与标题字重 |
| 脚本 | 原生 ES5/ES6 少量脚本 | `theme-switcher.js`、`scrollbar-control.js` |
| 图片 | **Unsplash** 等外链 | 原型占位；注意版权与外链稳定性 |

## 目录结构（当前仓库）

```
ui.loongzero.com/
├── index.html              # 展示壳：手机框网格 + iframe + 主题切换 UI
├── themes.json             # 主题注册表（id、路径、预览色、默认主题）
├── theme-switcher.js       # 读 themes.json、切主题、写 localStorage、改 iframe src
├── scrollbar-control.js    # 子页内：滚动时短暂显示滚动条相关 class（与 iframe 内文档配合）
├── CNAME                   # 自定义域名（部署用）
└── themes/
    ├── warm-earth/         # 主题：暖色大地
    │   ├── styles.css
    │   ├── home.html
    │   ├── category.html
    │   ├── detail.html
    │   ├── cart.html
    │   ├── search.html
    │   ├── profile.html
    │   └── orders.html
    └── maillard/           # 主题：美拉德配色（同上 7 页面 + styles.css）
```

**约定**

- 每个主题目录下 **7 个页面文件名固定**，与 `theme-switcher.js` 内 `pages` 数组顺序一致：`home` → `category` → `detail` → `cart` → `search` → `profile` → `orders`。
- 新增主题：复制某一主题目录、改 `styles.css` 与文案/色值，并在 `themes.json` 中增加一项。

## 数据模型

### 1. 主题配置（`themes.json`）

单文件 JSON，供 `theme-switcher.js` 拉取。

| 字段 | 含义 |
|------|------|
| `themes[]` | 主题列表 |
| `themes[].id` | 唯一标识，与目录名一致 |
| `themes[].name` / `description` | 面板展示文案 |
| `themes[].path` | 相对站点根的路径，如 `themes/warm-earth` |
| `themes[].preview` | `primaryColor`、`accentColor`、`backgroundColor`，用于面板色块与手机外框着色 |
| `defaultTheme` | 首次无 localStorage 时的默认主题 id |

### 2. 业务数据（原型阶段）

无后端、无 API。商品、订单、用户等为 **HTML 内静态占位**（文案、价格、Unsplash 图 URL）。若后续接 API，建议在 PRD 中单独定义 REST/GraphQL 模型；当前仓库不持久化业务实体。

## 关键模块与实现要点

### `index.html`

- **iframe 矩阵**：每个「手机框」内一个 iframe，`src` 指向 `themes/<当前主题>/<页面>.html`；不在 index 内堆业务 UI。
- **手机壳**：`.phone-frame` 375×812、圆角、`.notch` 模拟刘海；iframe 内为真实滚动区。
- **滚动条**：对 iframe 的 WebKit/CSS 规则尽量隐藏滚动条，保持「App 内嵌」观感。
- **资源版本**：`window.__ASSET_VERSION__` + `theme-switcher.js` 查询参数，减少脚本缓存导致的旧逻辑。

### `theme-switcher.js`

- 启动时 `fetch('themes.json')`；失败则回退仅 `warm-earth`。
- `localStorage.currentTheme` 记住用户选择；`applyTheme` 按固定 **iframe 顺序** 批量设置 `iframe.src`（含 cache bust）。
- 根据 `preview.primaryColor` 同步 `.phone-frame` / `.notch` 背景色；面板内 `.theme-option` 高亮当前主题。

### 子页 HTML（`themes/*/*.html`）

- 统一引入 Tailwind、Font Awesome、`styles.css`、`scrollbar-control.js`。
- 链接里使用 `?v=__ASSET_VERSION__` 占位（与入口页的版本策略配合时需注意：独立打开子页时该串为字面量，可按部署流程替换或改为固定版本号）。

### `styles.css`（按主题）

- 定义该主题的 body 背景、标题/价格/卡片等 **非 Tailwind 的设计 token**（如 `.vintage-bg`、`.vintage-price`）。
- 与 Tailwind 并存：布局与间距以 utility 为主，品牌色与组件质感以 CSS 类补充。

### 性能与后续迭代

- 多 iframe 同时加载：请求数与图片体积为主要成本；可按需 **懒加载 iframe**（`loading="lazy"` 或进入视口再赋 `src`）。
- 无打包意味着无 tree-shaking；控制单页 DOM 与外链图尺寸即可。

## 设计协作（Figma）

- 区块语义化（`header` / `section` / 主列表）便于对图层。
- 间距优先用 Tailwind spacing scale，减少任意像素。
- 主题扩展时保持 **同一信息架构**（7 屏），仅换视觉 token 与 copy。
