# qmentropy.com

> 物理学学术笔记站 · 变换光学 & 量子光学
> 基于 Jekyll + Minimal Mistakes 主题，托管于 GitHub Pages。

## 快速开始

### 写一篇新笔记

在 `_posts/` 下新建文件，命名格式：`YYYY-MM-DD-标题.md`，头部 front matter 示例：

```markdown
---
title: "笔记标题"
date: 2026-03-15
categories:
  - Physics
tags:
  - 标签1
toc: true
---

正文内容... 公式用 $$...$$ 渲染
```

### 本地预览（需要 Ruby）

```bash
gem install jekyll bundler
bundle install
bundle exec jekyll serve
# 打开 http://localhost:4000
```

### 部署（GitHub Pages）

推送到 `main` 分支即可自动构建：
```bash
git add .
git commit -m "更新内容"
git push origin main
```

## 目录结构

```
├── _config.yml          # 站点配置（★ 个人信息的唯一填写处）
├── _posts/              # 文章（命名 YYYY-MM-DD-标题.md）
├── _data/navigation.yml # 导航栏
├── _includes/head/custom.html  # 自定义 head（favicon 等）
├── assets/images/       # 头像、favicon
├── about.md             # 关于页
├── tags.md              # 标签归档
└── year-archive.md      # 按年归档
```

## ★ 上线前必填（约 30 秒）

打开 `_config.yml`，搜索 `【★填写】` 标记，填写：
1. `name` —— 你的名字
2. `author.links` 的 Email —— 联系邮箱
3. `author.links` 的 GitHub —— 你的 GitHub 主页（已填 hello-zxs，请核对）

## 功能清单

- ✅ MathJax 数学公式（$...$ 行内，$$...$$ 块级）
- ✅ 站内搜索
- ✅ 按标签/按年份归档
- ✅ 文章目录（toc）、阅读时间、相关文章
- ✅ 自定义域名 qmentropy.com
- ✅ 自定义 favicon 与头像
- ✅ SEO / Sitemap / RSS Feed
