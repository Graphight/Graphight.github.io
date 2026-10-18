---
layout: page
title: Colours
---

# Colours

Based on [Warm Burnout](https://warmburnout.com/), retuned for this site.

{% assign bg = site.data.palette | where: "name", "bg" | first -%}
{% assign mute = site.data.palette | where: "name", "mute" | first -%}
<ul class="palette">
  {%- for c in site.data.palette %}
  <li>
    <span class="role"><span class="token">--{{ c.name }}</span>{{ c.use }}</span>
    {%- for mode in (1..2) %}
    {%- if mode == 1 %}{% assign hex = c.light %}{% assign back = bg.light %}{% assign note = mute.light %}{% else %}{% assign hex = c.dark %}{% assign back = bg.dark %}{% assign note = mute.dark %}{% endif %}
    <span class="chip" style="background: {{ back }}; color: {{ note }}">
      <span class="dot" style="background: {{ hex }}"></span>
      <b style="color: {{ hex }}">Aa</b>
      {{ hex }} · <span data-fg="{{ hex }}" data-bg="{{ back }}"></span>
    </span>
    {%- endfor %}
  </li>
  {%- endfor %}
</ul>

<script>
  const lum = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    .reduce((y, c, i) => y + c * [0.2126, 0.7152, 0.0722][i], 0);
  document.querySelectorAll("[data-fg]").forEach(el => {
    const [a, b] = [lum(el.dataset.fg), lum(el.dataset.bg)].sort();
    el.textContent = ((b + 0.05) / (a + 0.05)).toFixed(1) + ":1";
  });
</script>
