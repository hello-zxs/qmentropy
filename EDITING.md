# 编辑地图

一张“想改什么 → 去哪里”的索引。首页是数据驱动的：文案在 `_data/`，结构在 `_includes/home/`，样式在 `assets/css/home.css`。

## 首页

| 想改什么 | 去哪里 |
|---|---|
| 首屏小标题、大标题、副标题 | `_data/home.yml` → `hero` |
| 首屏两个按钮的文字/链接 | `_data/home.yml` → `hero.primary_*`、`hero.secondary_*` |
| 状态标签（MSc @ Western …） | `_data/home.yml` → `hero.status` |
| 三张研究方向卡片 | `_data/home.yml` → `research.tiles`（顺序即显示顺序） |
| 卡片图片 | `assets/images/feature-*.png`，路径写在 `research.tiles[].image` |
| 黑色论文段 | `_data/home.yml` → `thesis` |
| “最新文章”标题 / 全部笔记链接 | `_data/home.yml` → `notes` |
| 首页显示几篇文章 | `_includes/home/notes.html` → `limit: 4` |
| 页脚文字与链接 | `_data/home.yml` → `footer` |
| 中文版所有文案 | `_data/home_zh.yml`（字段与英文一一对应） |
| 顶部导航 | `_data/navigation.yml`（英）、`_data/navigation_zh.yml`（中） |
| 配色 / 圆角 / 字体 / 动效时长 | `assets/css/home.css` 顶部的 `:root` |
| 页面结构 | `_layouts/home-apple.html` + `_includes/home/*.html` |
| 首页脚本（滚动、菜单） | `assets/js/home.js` |
| 首页“代表性论文” | `_data/publications.yml` + `_includes/home/publications.html` |

## 论文（IEEE）

| 想改什么 | 去哪里 |
|---|---|
| 论文列表、顺序、摘要 | `_data/publications.yml` |
| 论文正文 | `papers/<id>.md` |
| 参考文献 | 论文 front matter 的 `references:` 列表 |
| IEEE / APA 引用、BibTeX | `_data/publications.yml` 的 `cite_ieee` / `cite_apa` / `bibtex` |
| 论文版式、打印 PDF | `assets/css/paper.css`（含 `@media print`） |
| 论文插图 | `python tools/make_paper_figures.py`（需要 matplotlib） |

新增论文：在 `_data/publications.yml` 加一条 → 新建 `papers/<id>.md`（`layout: paper`、`pub_id: <id>`、`references:`）→ `/publications/` 自动出现。

## 图片

| 文件 | 用途 | 重新生成 |
|---|---|---|
| `assets/images/hero-light.png` | 首页首屏背景 | `python tools/make_assets.py` |
| `assets/images/feature-to.png` | 变换光学卡片 | 同上 |
| `assets/images/feature-lens.png` | 测地线透镜卡片 + 论文段 | 同上 |
| `assets/images/feature-quantum.png` | 量子光学卡片 | 同上 |
| `assets/images/paper-fig1.png` | Morse 论文图 1 | `python tools/make_paper_figures.py` |
| `assets/images/paper-fig2.png` | 综述图 1 | 同上 |

## 首页结构

```
index.html                     ← 只写 front matter，渲染 home-apple 布局
zh/index.html                  ← 同上，lang: zh
_layouts/home-apple.html       ← <head> + 页面骨架
_includes/home/nav.html        ← 顶部导航（含语言切换）
_includes/home/menu.html       ← 移动端菜单
_includes/home/hero.html       ← 首屏
_includes/home/publications.html ← 代表性论文
_includes/home/research.html   ← 三张卡片
_includes/home/thesis.html     ← 黑色论文段
_includes/home/notes.html      ← 最新文章（自动取最新 4 篇）
_includes/home/footer.html     ← 页脚
_data/home.yml / home_zh.yml   ← 全部文案
assets/css/home.css            ← 设计 token + 布局
assets/js/home.js              ← 导航、滚动淡入、移动菜单
assets/fonts/*.woff2           ← 自托管 Inter / Inter Tight

papers/<id>.md                 ← 论文正文
_data/publications.yml         ← 论文元数据、IEEE/APA 引用、BibTeX
_layouts/paper.html            ← 论文版式
_includes/paper/reference.html ← IEEE 参考文献渲染
assets/css/paper.css           ← 论文样式 + 打印版式
tools/make_paper_figures.py    ← 论文插图
```

## 双语怎么对应

- 页面 front matter 用 `lang` + `ref`；首页的对应关系写在 `_data/i18n.yml` 的 `home` 条目。
- 语言切换按钮读 `site.data.i18n.refs.home`，所以中英文 URL 只需要改这一处。
- 中文页面额外写 `locale: zh-CN`，主题内页的 UI 文案仍然会自动切换。

## 改完怎么发布

```bash
git add .
git commit -m "content: update homepage"
git push origin main
```

推送后 GitHub Actions 会构建一次，GitHub Pages 自动更新。本地预览：

```bash
bundle exec jekyll serve
# 英文 http://127.0.0.1:4000
# 中文 http://127.0.0.1:4000/zh/
```
