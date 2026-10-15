---
layout: default
---

<section class="hero">
  <canvas class="hero-canvas" aria-hidden="true"></canvas>
  <button class="hero-caption" type="button" hidden></button>
  <script src="{{ '/assets/js/hero.js' | relative_url }}" defer></script>
  <div class="wrap">
    <p class="kicker">Machine learning · Physics · Games</p>
    <h1>{{ site.title }}</h1>
    <p class="lede">Kia ora, welcome. I am a Machine Learning Engineer with a physics background and 8 years of experience building production systems at TB/PB scale. Originally from Christchurch, New Zealand, I am now a green card holder based near Boston, Massachusetts.</p>
  </div>
</section>

<section class="wrap stats-section">
  <p class="kicker">What my work delivered</p>
  <dl class="stats">
    <div><dt>€15M+</dt><dd>yearly revenue added for Ströer by faster ad rendering</dd></div>
    <div><dt>$200K+</dt><dd>cut from Ströer's yearly cloud egress costs</dd></div>
    <div><dt>0 → 1</dt><dd>Pyper Vision's ML platform, built as its sole ML engineer</dd></div>
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
      <li><span class="when">2026-02-18</span><a href="{{ '/pages/projects' | relative_url }}">Space Probe</a>A small strategy game built in Godot Engine while between jobs.</li>
    </ul>
    <a href="{{ '/pages/projects' | relative_url }}">All projects →</a>
  </section>
</div>
