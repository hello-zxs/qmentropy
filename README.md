# qmentropy.com

> 郑翔升的物理学笔记站，中英双语：英文在 `/`，中文在 `/zh/`。
> Jekyll + [Minimal Mistakes](https://mademistakes.com/work/jekyll-themes/minimal-mistakes/) 4.28.1（remote theme，已锁定版本），托管于 GitHub Pages。

## 语言结构

| 路径 | 语言 | 内容位置 |
|------|------|----------|
| `/` `/research/` `/publications/` `/cv/` `/about/` | English | `index.html`、`research.md`、`publications.md`、`cv.md`、`about.md` |
| `/zh/` `/zh/research/` … | 中文 | `zh/index.html`、`zh/*.md` |
| 博客文章 | English | `_posts/` |
| 中文文章 | 中文 | `_zh_posts/`（collection `zh_posts`） |

每个页面/文章在 front matter 里声明 `lang` 和 `ref`：

```yaml
lang: en          # en | zh
ref: research     # 双语页面的对应键，见 _data/i18n.yml
```

- `_data/i18n.yml` 维护 `ref` → 两种语言 URL 的映射。顶部语言切换器和 `<link rel="alternate" hreflang>` 都读它。
- 中文页面额外写 `locale: zh-CN`，主题的界面文案（"最新文章"、"目录"、"关注"等）会自动切换。
- 导航：英文 `_data/navigation.yml`，中文 `_data/navigation_zh.yml`。
- `_includes/masthead.html` 与 `_layouts/default.html` 是本仓库覆盖主题的文件（主题锁定 4.28.1），内页语言切换器位于 masthead 中。
- 首页使用独立布局 `_layouts/home-apple.html`，不加载主题 CSS；内页仍使用主题布局。
- 🔎 **改首页文案/样式，先看 [EDITING.md](EDITING.md)**——一张“想改什么 → 去哪里”的地图。

## 首页（Apple 风格）

首页是数据驱动的，改字不用碰 HTML：

| 文件 | 作用 |
|------|------|
| `_data/home.yml` | 英文首页全部文案（hero、三张卡片、论文段、页脚） |
| `_data/home_zh.yml` | 中文首页文案，字段与英文一一对应 |
| `_layouts/home-apple.html` | 页面骨架、meta、字体预加载 |
| `_includes/home/*.html` | nav / menu / hero / research / thesis / notes / footer 七个小片段 |
| `assets/css/home.css` | 设计 token（颜色、字号、圆角、动效）与布局 |
| `assets/js/home.js` | 导航滚动状态、滚动淡入、移动端菜单 |
| `assets/fonts/*.woff2` | 自托管 Inter / Inter Tight，不依赖 Google Fonts |

首页以外（Research、Publications、CV、About、文章）仍然沿用原来的深色主题；后续如果要把整套设计延伸过去，再改主题布局。

## 新增一篇双语文章

1. 英文：`_posts/YYYY-MM-DD-slug.md`，front matter 加 `lang: en`、`ref: slug`；
2. 中文：`_zh_posts/YYYY-MM-DD-slug.md`，front matter 加 `lang: zh`、`locale: zh-CN`、`ref: slug`，并写死 `permalink: /zh/<与英文相同的路径>`；
3. 在 `_data/i18n.yml` 增加映射：

```yaml
  slug:
    en: "/physics/2026/09/01/slug.html"
    zh: "/zh/physics/2026/09/01/slug.html"
```

只写一种语言也可以：语言切换器只在 `ref` 有对应项时出现。

## 写一篇新笔记（英文）

在 `_posts/` 下新建 `YYYY-MM-DD-slug.md`：

```markdown
---
title: "Note title"
date: 2026-03-15
categories:
  - Physics
tags:
  - Transformation Optics
toc: true
lang: en
ref: my-note
---

正文。公式用 $...$（行内）或 $$...$$（块级）。
```

也可以用生成器：

```powershell
pwsh -File tools\new-post.ps1 -Title "Note title" -Tags "physics,optics"
```

## 公式与图表的按需加载

首页、归档页、404 页面**不会**加载 MathJax / Mermaid；只有需要的页面才付这份流量。

- 文章默认 `mathjax: true`（见 `_config.yml` 的 `defaults`，`zh_posts` 同样开启）；
- 其他页面需要公式时，在 front matter 加 `mathjax: true`；
- 需要流程图时，在 front matter 加 `mermaid: true`。

## 本地预览

需要 Ruby 3.3+：

```bash
bundle install
bundle exec jekyll serve
# 英文 http://127.0.0.1:4000
# 中文 http://127.0.0.1:4000/zh/
```

## 图片素材

首屏背景、三张方向卡片、社交分享图和 favicon 都由脚本生成（Pillow + numpy）：

```bash
python tools/make_assets.py
```

输出到 `assets/images/`，固定随机种子，可重复生成。

## 部署

推送到 `main` 即触发 GitHub Pages 构建：

```bash
git add .
git commit -m "更新内容"
git push origin main
```

`.github/workflows/jekyll-build.yml` 会在每次 push / PR 时跑一次 `jekyll build` 并检查关键页面（含 `/zh/`）是否生成。

## 可选：评论与统计

两项都需要各自的账号，未配置时站点不会发出任何第三方请求。

**giscus 评论**

1. 仓库 Settings → General → 勾选 Discussions；
2. 安装 [giscus app](https://github.com/apps/giscus)；
3. 在 [giscus.app](https://giscus.app) 选择 `hello-zxs/qmentropy`，把生成的 `repo_id`、`category_id` 填入 `_config.yml`；
4. 在文章的 front matter 里设置 `comments: true`。

**GoatCounter 统计**

1. 在 [goatcounter.com](https://www.goatcounter.com/signup) 注册；
2. 把站点代码填入 `_config.yml` 的 `goatcounter_code`。

## 目录

```
├── _config.yml                 # 站点配置、双语 defaults
├── EDITING.md                  # “想改哪里 → 去哪个文件”
├── _data/navigation.yml        # 英文导航
├── _data/navigation_zh.yml     # 中文导航
├── _data/i18n.yml              # ref → 中英文 URL 映射
├── _data/home.yml              # 英文首页文案
├── _data/home_zh.yml           # 中文首页文案
├── _includes/masthead.html     # 覆盖主题：内页语言切换 + 双语导航
├── _includes/lang-switch.html  # 内页语言切换按钮
├── _includes/home/             # 首页片段（nav/menu/hero/research/thesis/notes/footer）
├── _layouts/default.html       # 覆盖主题：取消 masthead 缓存
├── _layouts/home-apple.html    # 首页独立布局
├── _posts/                     # 英文文章
├── _zh_posts/                  # 中文文章（collection）
├── zh/                         # 中文页面
├── assets/css/custom.css       # 内页样式
├── assets/css/home.css         # 首页样式（token 在顶部）
├── assets/js/home.js           # 首页交互
├── assets/fonts/               # 自托管 Inter / Inter Tight
├── assets/images/              # hero、卡片、OG 图、favicon
├── tools/make_assets.py        # 图片生成脚本（含 hero-light.png）
└── Gemfile                     # 本地 / CI 依赖
```
