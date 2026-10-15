---
layout: page
---

# Writing

## Articles

{% assign articles = site.pages | where: "layout", "article" | sort: "date" | reverse %}
{%- for a in articles %}
**{{ a.date | date: "%Y-%m-%d" }}** - [{{ a.title }}]({{ a.url | relative_url }})

{% endfor %}

## Publications

1. [Robust changes to the wettest and driest days of the year are hidden within annual rainfall projections: a New Zealand case study](https://iopscience.iop.org/article/10.1088/1748-9326/ad585a)\
Luke J Harringon, Suzanne M Rosier, **Tom I Marsh**, and Dave J Frame, 2024, *Environmental Research Letters*, 19, 074057

&nbsp;
