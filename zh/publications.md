---
title: "论文"
permalink: /zh/publications/
layout: page
kicker: "论文"
lead: "论文全文为英文，按 IEEE 格式排版；这里保留中文信息与入口。"
toc: false
lang: zh
locale: zh-CN
ref: publications
---

论文全文为英文，按 IEEE 格式排版：摘要、Index Terms、编号章节、[n] 引用与参考文献、BibTeX，以及可打印为 PDF 的版式。中文站点保留论文信息与入口，正文以英文为准。

{% for pub in site.data.publications %}
<article class="pub">
  <p class="pub__meta">{{ pub.year }} · {% case pub.type %}{% when "BSc (Hons) Thesis" %}学位论文{% when "Review Article" %}综述{% else %}{{ pub.type }}{% endcase %}</p>
  <h2 class="pub__title"><a href="{{ pub.url | relative_url }}">{{ pub.title }}</a></h2>
  <p class="pub__cite">{{ pub.cite_ieee }}</p>
  <p class="pub__abstract">{{ pub.abstract }}</p>
  <p class="pub__links">
    <a href="{{ pub.url | relative_url }}">阅读全文（英文 HTML）</a>
    <a href="{{ pub.url | relative_url }}#cite">引用</a>
  </p>
  {% if pub.bibtex %}
  <details class="pub__bibtex">
    <summary>BibTeX</summary>
    <pre>{{ pub.bibtex }}</pre>
  </details>
  {% endif %}
</article>
{% endfor %}

## 期刊论文

目前尚无正式发表的期刊论文。硕士阶段的工作开始后，这里会按年份更新。

## 项目

**Morse 透镜射线追踪器** —— 把 GRIN 剖面映射为旋转曲面，在曲面上积分测地线方程，并与原介质中的光线路径对比。技术栈：Python · NumPy · Matplotlib。

**变换光学文献索引** —— 1961–2022 年间的 37 篇经典论文，按“度规等价—坐标变换—隐形衣—实验实现”四条线索整理。

**单光子干涉实验** —— 量子光学课程实验；衰减激光单光子源、分束器、符合计数。
