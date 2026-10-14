---
layout: default
---

<section class="hero">
  <div class="wrap">
    <p class="kicker">Machine learning · Physics · Games</p>
    <h1>{{ site.title }}</h1>
    <p class="lede">Kia ora, welcome. I am a Machine Learning Engineer with a physics background and 8 years of experience building production systems at TB/PB scale. Originally from Christchurch, New Zealand, I am now a green card holder based near Boston, Massachusetts.</p>
    <p class="actions">
      <a class="button primary" href="#work">See my work</a>
      <a class="button" href="{{ '/resources/Tom_Marsh_Resume.pdf' | relative_url }}">Resume (PDF)</a>
    </p>
  </div>
</section>

<section class="wrap">
  <dl class="stats">
    <div><dt>€15M+</dt><dd>added annual revenue</dd></div>
    <div><dt>$200K+</dt><dd>yearly egress savings</dd></div>
    <div><dt>0 → 1</dt><dd>for Pyper Vision</dd></div>
  </dl>
</section>

<section class="wrap home-section" id="work">
  <h2>Work</h2>
  {% include timeline.html %}
</section>

<div class="wrap home-section pair">
  <section>
    <h2>Writing</h2>
    <ul class="entries">
      {%- assign articles = site.pages | where: "layout", "article" | sort: "date" | reverse %}
      {%- for a in articles %}
      <li><span class="when">{{ a.date | date: "%Y-%m-%d" }}</span><a href="{{ a.url | relative_url }}">{{ a.title | escape }}</a></li>
      {%- endfor %}
      <li><span class="when">2024 · Environmental Research Letters</span><a href="https://iopscience.iop.org/article/10.1088/1748-9326/ad585a">Robust changes to the wettest and driest days of the year are hidden within annual rainfall projections: a New Zealand case study</a></li>
    </ul>
    <a href="{{ '/pages/writing' | relative_url }}">All writing →</a>
  </section>
  <section>
    <h2>Projects</h2>
    <ul class="entries">
      <li><span class="when">2026-02-18 · Godot</span><a href="{{ '/pages/projects' | relative_url }}">Space Probe</a>A small strategy game built in Godot Engine while between jobs.</li>
    </ul>
    <a href="{{ '/pages/projects' | relative_url }}">All projects →</a>
  </section>
</div>
