# TECH_DESIGN

## 技术栈
- 前端：静态 HTML + **Tailwind CSS**（CDN 或构建引入按项目现状选择）
- 图标：**FontAwesome**
- 图片：Unsplash / Pexels 外链或下载后放静态资源目录（按版权与加载策略定）

## 目录结构（原则）
- `index.html`：主入口；仅负责布局、iframe 列表、全局壳样式引用；**平铺嵌入**各功能页。
- `themes/<主题名>/` 或根下按功能：`home.html`、`games.html`、`me.html` 等，**一屏一文件**。
- 自定义样式：`*.css` 独立文件，在需要的 HTML 中 `<link>` 引入。
- 公共片段：若多处重复，可抽 `common.css` 或少量共享 JS（保持低复杂度）。

## 数据模型
- 原型阶段无后端；数据可为静态占位文案与占位图 URL。

## 关键模块设计

### index.html
- 使用 **iframe** 的 `src` 指向各功能 HTML，**不在 index 内写各页完整 UI 代码**。
- **平铺展示**：在 index 上用网格或纵向流式排列多个「手机外框 + iframe」，使所有页面同时可见（可滚动浏览整页）。

### 单页 HTML
- 每页只负责一个功能界面；类名以 Tailwind 为主。
- 自定义样式放入独立 CSS，避免在 HTML 内大段 `<style>`（除非极小且为降低文件数）。

### iPhone 15 外观
- 用外层容器模拟机身比例、圆角、刘海/灵动岛区域、阴影；内部为 `100%` 宽高的滚动内容区。
- 具体尺寸可参考公开 iPhone 15 逻辑分辨率与 CSS 比例做近似（不必 1:1 物理像素）。

### 低 TOKEN
- 复用相同结构块时抽公共 class / 少量组件式 HTML 片段（仍保持多文件清晰）。
- 避免重复大段 SVG；图标优先 FontAwesome。
- 图片用合理 `width`/`height` 与压缩资源。

### Figma 友好
- 语义化区块（header/main/tab 等）便于对照图层。
- 避免过度绝对定位叠层；间距尽量用统一 scale（Tailwind spacing）。
- 命名稳定的容器 class，减少「魔法数字」散落。

## 性能与稳定性
- 多 iframe 同时加载时注意总请求数；必要时延迟加载 iframe `src`（后续迭代）。
