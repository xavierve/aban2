// Menú principal (igual que assets/js/main.js)
(function () {
	var toggle = document.querySelector('.nav-toggle');
	var menu = document.querySelector('.site-nav');
	if (!toggle || !menu) return;
	toggle.addEventListener('click', function () {
		var open = menu.classList.toggle('open');
		toggle.setAttribute('aria-expanded', String(open));
	});
})();

(function () {
	var btn = document.querySelector('.arriba');
	var nav = document.querySelector('.indice');
	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	// En escritorio el índice está siempre a la vista (lateral fijo): el botón sube al principio.
	// En móvil el índice está al inicio del texto: el botón lleva al índice.
	function lateral() { return getComputedStyle(nav).position === 'sticky'; }
	function headerH() { return document.querySelector('.site-header').offsetHeight; }
	function navTop() { return nav.getBoundingClientRect().top + window.scrollY - headerH() - 12; }
	function onScroll() {
		var umbral = lateral() ? 600 : navTop() + nav.offsetHeight;
		btn.classList.toggle('visible', window.scrollY > umbral);
		btn.setAttribute('aria-label', lateral() ? 'Volver arriba' : 'Ir al índice');
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	onScroll();
	btn.addEventListener('click', function () {
		window.scrollTo({ top: lateral() ? 0 : navTop(), behavior: reduce ? 'auto' : 'smooth' });
		history.replaceState(null, '', location.pathname + location.search);
	});

	var links = {};
	nav.querySelectorAll('a[href^="#a"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
	var heads = Array.prototype.slice.call(document.querySelectorAll('.art h3[id]'));
	var current = null;
	function setCurrent(id) {
		if (id === current) return;
		if (current && links[current]) links[current].removeAttribute('aria-current');
		current = id;
		var a = links[id];
		if (!a) return;
		a.setAttribute('aria-current', 'true');
		if (getComputedStyle(nav).position === 'sticky') {
			var top = a.offsetTop - nav.offsetTop, h = nav.clientHeight;
			if (top < nav.scrollTop + 40 || top > nav.scrollTop + h - 60) nav.scrollTop = top - h / 3;
		}
	}
	function update() {
		var line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 4) * 16 + 140;
		var id = heads.length ? heads[0].id : null;
		for (var i = 0; i < heads.length; i++) {
			if (heads[i].getBoundingClientRect().top - line <= 0) id = heads[i].id; else break;
		}
		setCurrent(id);
	}
	var ticking = false;
	window.addEventListener('scroll', function () {
		if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); }
	}, { passive: true });
	window.addEventListener('resize', update);
	update();
})();
