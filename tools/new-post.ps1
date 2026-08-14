# ============================================================
# 新笔记生成器 — 一条命令创建带模板的文章
# 用法:
#   powershell -NoProfile -ExecutionPolicy Bypass -File new-post.ps1 -Title "笔记标题" [-Tags "物理,光学"] [-Category "Physics"]
# 示例:
#   powershell -NoProfile -ExecutionPolicy Bypass -File new-post.ps1 -Title "量子纠缠入门" -Tags "量子,纠缠"
# ============================================================
param(
  [Parameter(Mandatory = $true)][string]$Title,
  [string]$Tags = "Physics",
  [string]$Category = "Physics"
)

$repoDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$postsDir = Join-Path $repoDir '_posts'
if (-not (Test-Path $postsDir)) {
  Write-Host "[FAIL] 未找到 _posts 目录，请确认脚本放在仓库根目录。"
  exit 1
}

$date = Get-Date -Format 'yyyy-MM-dd'
# 生成文件名（中文标题转拼音风险高，改用日期+序号）
$slug = ($Title -replace '[^\w\u4e00-\u9fa5]', '-' -replace '[-]+', '-').Trim('-')
$safeSlug = if ([string]::IsNullOrWhiteSpace($slug)) { 'post' } else { $slug }
$fileName = "${date}-${safeSlug}.md"
$filePath = Join-Path $postsDir $fileName

if (Test-Path $filePath) {
  Write-Host "[FAIL] 文件已存在: $filePath"
  exit 1
}

$tagList = ($Tags -split '[,，]' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$tagsYaml = ($tagList | ForEach-Object { "  - $_" }) -join "`n"

$front = @"
---
title: "$Title"
date: $date
categories:
  - $Category
tags:
$tagsYaml
toc: true
---

## 概述

<!-- 用一两句话说明本篇笔记的核心内容 -->

## 正文

<!-- 开始写作 -->

## 结论

<!-- 总结要点 -->

## 参考

<!-- 参考资料链接 -->
"@

# 以 UTF-8 带 BOM 写入（兼容 PowerShell 5.1）
[System.IO.File]::WriteAllText($filePath, $front, [System.Text.UTF8Encoding]::new($true))
Write-Host "[OK] 已创建: $filePath"
Write-Host "[提示] 打开文件开始写作；写完后运行 push-to-github.ps1 发布。"
