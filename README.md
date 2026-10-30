# qmentropy.com

> 郑翔升的物理学笔记站：变换光学、测地线透镜与量子光学。
> Jekyll + [Minimal Mistakes](https://mmistakes.com/work/jekyll-themes/minimal-mistakes/)（remote theme），托管于 GitHub Pages。

## 站点结构

| 路径 | 内容 |
|------|------|
| `/` | 首页：研究方向卡片 + 最新文章 |
| `/research/` | 三条研究主线与在研问题 |
| `/tags/` | 按标签浏览全部笔记 |
| `/publications/` | 学位论文、论文与项目 |
| `/cv/` | 简历（可直接打印为 PDF） |
| `/year-archive/` | 按时间归档 |
| `/about/` | 关于我 / 关于本站 |

## 写一篇新笔记

在 `_posts/` 下新建 `YYYY-MM-DD-slug.md`：

```markdown
---
title: "笔记标题"
date: 2026-03-15
categories:
  - Physics
tags:
  - Transformation Optics
toc: true
---

正文。公式用 $...$（行内）或 $$...$$（块级）。
```

也可以用生成器：

```powershell
pwsh -File tools\new-post.ps1 -Title "笔记标题" -Tags "物理,光学"
```

## 公式与图表的按需加载

首页、归档页、404 页面**不会**加载 MathJax / Mermaid；只有需要的页面才付这份流量。

- 文章默认 `mathjax: true`（见 `_config.yml` 的 `defaults`）；
- 其他页面需要公式时，在 front matter 加 `mathjax: true`；
- 需要流程图时，在 front matter 加 `mermaid: true`。

## 本地预览

需要 Ruby 3.3+：

```bash
bundle install
bundle exec jekyll serve
# http://127.0.0.1:4000
```

## 图片素材

首屏背景、三张方向卡片、社交分享图和 favicon 都由脚本生成（Pillow + numpy）：

```bash
python tools/make_assets.py
```

输出到 `assets/images/`，固定随机种子，可重复生成。修改配色或构图后重跑即可。

## 部署

推送到 `main` 即触发 GitHub Pages 构建：

```bash
git add .
git commit -m "更新内容"
git push origin main
```

`.github/workflows/jekyll-build.yml` 会在每次 push / PR 时跑一次 `jekyll build` 并检查关键页面是否生成，构建失败会直接显示在 Actions 里。

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
├── _config.yml                 # 站点配置
├── _data/navigation.yml        # 顶部导航
├── _includes/head/custom.html  # 图标、按需加载的 MathJax/Mermaid
├── _includes/footer/custom.html# 进度条、返回顶部、统计
├── _posts/                     # 文章
├── assets/css/custom.css       # 自定义样式层
├── assets/images/              # 头像、hero、卡片、OG 图、favicon
├── tools/make_assets.py        # 图片生成脚本
├── research.md / publications.md / cv.md / about.md / 404.md
└── Gemfile                     # 本地 / CI 依赖
```
