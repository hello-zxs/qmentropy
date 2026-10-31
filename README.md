# qmentropy.com

郑翔升的个人学术站点 — 物理硕士（Western University），研究方向为变换光学、测地线透镜与量子光学。

英文默认在 `/`，中文在 `/zh/`。Jekyll 静态站点，**不依赖第三方主题**：导航、页面、文章、论文与归档都由本仓库自己的 layout + CSS 构成，只有一套视觉。

## 设计原则

- **一套浅色系统**：白/浅灰底、黑色正文、蓝色链接，Inter / Inter Tight 自托管字体。
- **论文是“论文纸”**：`/papers/<id>/` 用衬线体、编号章节、`[n]` 参考文献和打印版式；导航与页脚仍与全站一致。
- **数据驱动**：首页文案在 `_data/home*.yml`，论文元数据在 `_data/publications.yml`，导航在 `_data/navigation*.yml`。
- **少依赖**：只剩 `jekyll-sitemap`；没有主题、没有前端框架，MathJax 仅在需要公式的页面加载。

## 页面类型

| 路径 | layout | 内容来源 |
|---|---|---|
| `/`、`/zh/` | `home-apple` | `_data/home.yml`、`_data/home_zh.yml` |
| Research / Publications / CV / About | `page` | `research.md`、`publications.md`、`cv.md`、`about.md`（中文在 `zh/`） |
| 论文全文 | `paper` | `papers/<id>.md` |
| 404 | `page`（`hide_header: true`） | `404.md` |

笔记的 `post` / `archive` 布局与样式保留着，但**目前没有发布任何笔记**；等有真实内容再启用。

## 全站骨架

| 文件 | 作用 |
|---|---|
| `_layouts/page.html` | 普通内容页：页头、正文、右侧目录 |
| `_layouts/post.html` | 文章页：日期、阅读时间、正文、目录 |
| `_layouts/archive.html` | Notes / 年份归档：标签筛选、按年分组 |
| `_layouts/paper.html` | 论文页：摘要、Index Terms、正文、参考文献、引用块 |
| `_layouts/home-apple.html` | 首页 |
| `_includes/site/head.html` | 全站 `<head>`：meta、OG、字体、CSS、可选 MathJax |
| `_includes/site/nav.html` | 全站导航 + 语言切换 + 论文页 Print 按钮 |
| `_includes/site/menu.html` | 移动端菜单 |
| `_includes/site/footer.html` | 全站页脚 |
| `_includes/site/scripts.html` | 统计、阅读进度、返回顶部、`site.js` |
| `_includes/home/*.html` | 首页分段：hero / publications / research / thesis / notes |
| `assets/css/site.css` | 全站样式；顶部 `:root` 是颜色、字体、圆角、动效 token |
| `assets/css/paper.css` | 论文纸样式 + `@media print` |
| `assets/js/site.js` | 导航、菜单、滚动淡入、目录、标签筛选、阅读进度、打印 |

## 首页

改字不用碰 HTML：

- 文案：`_data/home.yml`（英）、`_data/home_zh.yml`（中）
- 结构：`_layouts/home-apple.html` + `_includes/home/*.html`
- 首屏大标题是姓名；下面是 Selected publications（读 `_data/publications.yml`）与三条研究线索。

## 论文（IEEE 格式）

- 元数据：`_data/publications.yml`（标题、类型、摘要、IEEE/APA 引用、BibTeX、URL）
- 正文：`papers/<id>.md`，front matter 写 `layout: paper`、`pub_id: <id>`、`index_terms`、`references`
- 参考文献：写在 `references:` 列表里，由 `_includes/paper/reference.html` 按 IEEE 渲染并自动编号
- 引用块：论文页底部自动给出 IEEE / APA / BibTeX，来自 `publications.yml`
- 打印：右上角 `Print / PDF` 调浏览器打印，`paper.css` 去掉导航、改白底
- 插图：`python tools/make_paper_figures.py`（需要 matplotlib）

新增一篇论文：`publications.yml` 加记录 → 新建 `papers/<id>.md` → `/publications/` 与首页自动出现。

## 笔记（暂未发布）

`post` 与 `archive` 布局还在，但 `_posts/`、`_zh_posts/` 目前是空的，站上也没有 Notes/Archive 入口。等有真正值得发布的实验记录或笔记时，再按 `_posts/YYYY-MM-DD-slug.md` 添加，并在导航里加回入口。

## 双语

- 页面 front matter：`lang: en` / `lang: zh`、`locale: zh-CN`、`ref: <slug>`
- URL 对应：`_data/i18n.yml` 的 `refs`
- 导航：`_data/navigation.yml`（英）、`_data/navigation_zh.yml`（中）
- 没有对应译文时，语言按钮回退到中文/英文首页

## 本地预览

```bash
bundle install
bundle exec jekyll serve
# 英文 http://127.0.0.1:4000
# 中文 http://127.0.0.1:4000/zh/
```

## 部署

推送到 `main` 即触发 GitHub Actions（构建检查）与 GitHub Pages。

```bash
git add .
git commit -m "content: ..."
git push origin main
```

## 可选：访问统计

在 `_config.yml` 填 `goatcounter_code`，`site/scripts.html` 会自动加载 GoatCounter；留空则不加载。

## 目录

```
├── _config.yml                  # 站点配置、默认 layout、集合
├── _data/
│   ├── home.yml / home_zh.yml   # 首页全部文案
│   ├── publications.yml         # 论文元数据 + IEEE/APA + BibTeX
│   ├── navigation*.yml          # 双语导航
│   └── i18n.yml                 # ref → 中英文 URL
├── _includes/
│   ├── site/                    # head / nav / menu / footer / scripts
│   ├── home/                    # 首页分段
│   └── paper/reference.html     # IEEE 参考文献
├── _layouts/                    # page / post / archive / paper / home-apple
├── _posts/  _zh_posts/          # 暂空，笔记基础设施保留
├── papers/                      # 论文全文
├── zh/                          # 中文页面
├── assets/css/site.css          # 全站样式（token 在顶部）
├── assets/css/paper.css         # 论文样式 + 打印
├── assets/js/site.js            # 全站交互
├── assets/fonts/                # 自托管 Inter / Inter Tight
├── assets/images/               # hero、OG、favicon、论文插图
├── tools/make_assets.py         # 图片生成（hero）
├── tools/make_paper_figures.py  # 论文插图
├── EDITING.md                   # “想改什么 → 去哪”
└── Gemfile
```
