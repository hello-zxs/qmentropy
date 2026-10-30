---
title: "笔记"
permalink: /zh/notes/
layout: archive
author_profile: true
lang: zh
locale: zh-CN
ref: notes
---

按主题浏览全部中文笔记：变换光学、测地线透镜、量子光学，以及实验室记录。

{% assign posts = site.zh_posts | where_exp: "post", "post.hidden != true" | sort: "date" | reverse %}
<div class="entries-list">
  {% for post in posts %}
    {% include archive-single.html locale="zh-CN" %}
  {% endfor %}
</div>
