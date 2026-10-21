/* Magistral IT — shared behaviour: draw scenes on scroll, reveal copy, remember language. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var paths = document.querySelectorAll('.d');
  for (var i = 0; i < paths.length; i++) paths[i].setAttribute('pathLength', '1');

  function watch(list, cls, threshold) {
    if (reduce || !list.length) return;
    if (!('IntersectionObserver' in window)) {
      for (var k = 0; k < list.length; k++) list[k].classList.add(cls);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); }
      });
    }, { threshold: threshold });
    for (var j = 0; j < list.length; j++) io.observe(list[j]);
  }
  watch(document.querySelectorAll('.scene'), 'play', 0.3);
  watch(document.querySelectorAll('.rv'), 'in', 0.15);

  // Remember the chosen language for the root page.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-lang]');
    if (!a) return;
    try { localStorage.setItem('mit-lang', a.getAttribute('data-lang')); } catch (err) {}
  });

  // Copy-to-clipboard buttons: <button data-copy="text">
  var btns = document.querySelectorAll('[data-copy]');
  Array.prototype.forEach.call(btns, function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      function done() {
        btn.textContent = btn.getAttribute('data-done') || '✓';
        setTimeout(function () { btn.textContent = label; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  });
})();
