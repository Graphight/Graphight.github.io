// Copies each footnote beside its marker; CSS shows the copies only on wide screens, and the endnote list stays for everyone else.
(function () {
  var column = document.querySelector(".column");
  if (!column) return;
  var notes = [];
  column.querySelectorAll('sup[role="doc-noteref"] a').forEach(function (ref) {
    var item = document.getElementById(ref.getAttribute("href").slice(1));
    if (!item) return;
    var aside = document.createElement("aside");
    aside.className = "sidenote";
    aside.setAttribute("aria-hidden", "true");
    aside.innerHTML = item.innerHTML;
    aside.querySelectorAll(".reversefootnote").forEach(function (a) { a.remove(); });
    aside.querySelectorAll("a").forEach(function (a) { a.tabIndex = -1; });
    var label = document.createElement("span");
    label.className = "sidenote-label";
    label.textContent = ref.textContent;
    aside.firstElementChild.prepend(label);
    column.appendChild(aside);
    notes.push({ ref: ref, aside: aside });
  });
  if (!notes.length) return;

  function layout() {
    var origin = column.getBoundingClientRect().top, floor = 0;
    notes.forEach(function (n) {
      var top = Math.max(n.ref.getBoundingClientRect().top - origin, floor);
      n.aside.style.top = top + "px";
      floor = top + n.aside.offsetHeight + 12;
    });
  }
  new ResizeObserver(layout).observe(column);
})();
