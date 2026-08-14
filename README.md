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
1. `name` —— 你的名字 ✅（已填 Zheng Xiangsheng）
2. `author.links` 的 Email ✅（已填）
3. `author.links` 的 GitHub ✅（已填）

## 启用评论（giscus，约 2 分钟）

1. GitHub 仓库 → **Settings → General** → 勾选 **Discussions**
2. 安装 giscus 应用：https://github.com/apps/giscus
3. 打开 https://giscus.app ，填仓库名 `hello-zxs/qmentropy`，选择分类
4. 把生成的 **repo_id** 和 **category_id** 填入 `_config.yml` 的 `comments.giscus` 下
5. （可选）取消注释 `# language: "zh-CN"` 启用中文评论界面

## 启用访问统计（GoatCounter，约 1 分钟）

1. 免费注册：https://www.goatcounter.com/signup
2. 注册后获得站点代码（如 `qmentropy`）
3. 填入 `_config.yml` 的 `goatcounter_code`

## 新笔记生成器

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools\new-post.ps1 -Title "笔记标题" -Tags "物理,光学"
```

自动创建带 front matter 模板的文章，写作零门槛。

## 功能清单

- ✅ MathJax 数学公式（$...$ 行内，$$...$$ 块级）
- ✅ Mermaid 流程图/实验装置图（```mermaid 代码块）
- ✅ giscus 评论（需按上文启用）
- ✅ GoatCounter 访问统计（需按上文启用）
- ✅ 阅读进度条 + 返回顶部按钮
- ✅ 暗色主题
- ✅ 自定义 404 页面
- ✅ Publications 出版物/项目页
- ✅ GitHub Actions 自动构建检查
- ✅ 站内搜索
- ✅ 按标签/按年份归档
- ✅ 文章目录（toc）、阅读时间、相关文章
- ✅ 自定义域名 qmentropy.com
- ✅ 自定义 favicon 与头像
- ✅ SEO / Sitemap / RSS Feed
