---
title: "Publications"
permalink: /publications/
layout: page
kicker: "Publications"
lead: "Full texts are typeset as IEEE-style papers, each with a printable PDF, an IEEE and APA citation, and a BibTeX entry."
toc: false
lang: en
ref: publications
---

{% for pub in site.data.publications %}
<article class="pub">
  <p class="pub__meta">{{ pub.type }} · {{ pub.year }}</p>
  <h2 class="pub__title"><a href="{{ pub.url | relative_url }}">{{ pub.title }}</a></h2>
  <p class="pub__cite">{{ pub.cite_ieee }}</p>
  <p class="pub__abstract">{{ pub.abstract }}</p>
  <p class="pub__links">
    <a href="{{ pub.url | relative_url }}">Full text (HTML)</a>
    <a href="{{ pub.url | relative_url }}#cite">Cite</a>
  </p>
  {% if pub.bibtex %}
  <details class="pub__bibtex">
    <summary>BibTeX</summary>
    <pre>{{ pub.bibtex }}</pre>
  </details>
  {% endif %}
</article>
{% endfor %}
