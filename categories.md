---
title: "Categories"
permalink: /categories/
layout: archive
author_profile: true
lang: en
ref: categories
sitemap: false
---

{% assign categories = site.categories | sort %}
{% for category in categories %}
## {{ category[0] }} <span class="taxonomy__count">{{ category[1].size }}</span> {#{{ category[0] | slugify }}}

<ul>
  {% for post in category[1] %}
  {% unless post.hidden %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <small>{{ post.date | date: "%Y-%m-%d" }}</small></li>
  {% endunless %}
  {% endfor %}
</ul>
{% endfor %}
