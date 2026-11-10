---
title: "论文"
permalink: /zh/publications/
layout: page
kicker: "论文"
lead: "论文全文为英文，按 IEEE 格式排版，附 IEEE/APA 引用与 BibTeX。"
toc: false
lang: zh
locale: zh-CN
ref: publications
---

{% for pub in site.data.publications %}
<article class="pub">
  <p class="pub__meta">{{ pub.year }} · {% case pub.type %}{% when "BSc (Hons) Thesis" %}学位论文{% when "Review Article" %}综述{% else %}{{ pub.type }}{% endcase %}</p>
  <h2 class="pub__title"><a href="{{ pub.url | relative_url }}">{{ pub.title }}</a></h2>
  <p class="pub__cite">{{ pub.cite_ieee }}</p>
  <p class="pub__abstract">{{ pub.abstract }}</p>
  <p class="pub__links">
    <a href="{{ pub.url | relative_url }}">阅读全文（英文 HTML）</a>
    {% if pub.pdf and pub.pdf != "" %}<a href="{{ pub.pdf | relative_url }}">PDF</a>{% endif %}
    <a href="{{ pub.url | relative_url }}#cite">引用</a>
    {% if pub.bib %}<a href="{{ pub.bib | relative_url }}" download>.bib</a>{% endif %}
    {% if pub.ris %}<a href="{{ pub.ris | relative_url }}" download>.ris</a>{% endif %}
  </p>
  {% if pub.bibtex %}
  <details class="pub__bibtex">
    <summary>BibTeX</summary>
    <pre>{{ pub.bibtex }}</pre>
  </details>
  {% endif %}
</article>
{% endfor %}
