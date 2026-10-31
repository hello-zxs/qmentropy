# 编辑地图

一张“想改什么 → 去哪里”的索引。全站只有一套浅色系统：样式在 `assets/css/site.css`，骨架在 `_includes/site/`，不同页面类型用不同 layout。

## 全站

| 想改什么 | 去哪里 |
|---|---|
| 配色、字体、圆角、动效时长 | `assets/css/site.css` 顶部的 `:root` |
| 导航项（增删、顺序、文字） | `_data/navigation.yml`（英）、`_data/navigation_zh.yml`（中） |
| 导航结构与语言按钮 | `_includes/site/nav.html` |
| 移动端菜单 | `_includes/site/menu.html` |
| 页脚 | `_includes/site/footer.html` |
| `<head>`、meta、OG、字体、MathJax | `_includes/site/head.html` |
| 全站交互 | `assets/js/site.js` |
| 滚动动效方向/重置 | `assets/js/site.js` 的 reveal 段；样式在 `site.css` 的 `/* motion */` |
| 阅读进度 / 返回顶部 / 统计 | `_includes/site/scripts.html` |

## 页面类型

| 页面 | layout | 改哪里 |
|---|---|---|
| 首页 | `home-apple` | `_data/home*.yml` + `_includes/home/*` |
| Research / Publications / CV / About | `page` | 同名 `.md` 的正文；页头文字在 front matter 的 `kicker` / `lead` |
| 论文全文 | `paper` | `papers/<id>.md` + `_data/publications.yml` |
| 404 | `page` | `404.md` |

`post` / `archive` 布局还在，但目前没有发布笔记。

## 首页

| 想改什么 | 去哪里 |
|---|---|
| 首屏小标题、姓名、副标题、按钮 | `_data/home.yml` → `hero` |
| 状态标签 | `_data/home.yml` → `hero.status` |
| 代表性论文标题/按钮文字 | `_data/home.yml` → `publications` |
| 论文条目本身 | `_data/publications.yml`（与 /publications/ 共用） |
| 三条研究方向 | `_data/home.yml` → `research.tiles` |
| 中文首页全部文案 | `_data/home_zh.yml`（字段与英文一一对应） |

## 论文

| 想改什么 | 去哪里 |
|---|---|
| 论文列表、顺序、摘要 | `_data/publications.yml` |
| 论文正文 | `papers/<id>.md` |
| 摘要 / Index Terms | `papers/<id>.md` 的 front matter |
| 参考文献 | 论文 front matter 的 `references:` |
| IEEE / APA 引用、BibTeX | `_data/publications.yml` 的 `cite_ieee` / `cite_apa` / `bibtex` |
| 论文版式、打印 PDF | `assets/css/paper.css` |
| 论文插图 | `python tools/make_paper_figures.py` |

新增论文：`publications.yml` 加一条 → 新建 `papers/<id>.md`（`layout: paper`、`pub_id: <id>`、`references:`）→ `/publications/` 自动出现。

## 笔记（暂未发布）

- 英文：`_posts/YYYY-MM-DD-slug.md`；中文：`_zh_posts/YYYY-MM-DD-slug.md`。
- 需要时再在导航和 `_data/i18n.yml` 里加入口；目前站上没有 Notes/Archive 页面。
- `_layouts/archive.html` 与 `_layouts/post.html` 保留，标签筛选逻辑在 `assets/js/site.js`。

## 图片

| 文件 | 用途 | 重新生成 |
|---|---|---|
| `assets/images/hero-light.png` | 首页首屏背景 | `python tools/make_assets.py` |
| `assets/images/paper-fig1.png` | Morse 论文图 1 | `python tools/make_paper_figures.py` |

## 改完怎么发布

```bash
git add .
git commit -m "content: ..."
git push origin main
```

推送后 GitHub Actions 构建一次，GitHub Pages 自动更新。本地预览：

```bash
bundle exec jekyll serve
# 英文 http://127.0.0.1:4000
# 中文 http://127.0.0.1:4000/zh/
```
