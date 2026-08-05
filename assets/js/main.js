const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
	toggle.addEventListener('click', () => {
		const open = nav.classList.toggle('open');
		toggle.setAttribute('aria-expanded', String(open));
	});
}

const revealTargets = Array.from(
	document.querySelectorAll(
		'main .reveal, main h1, main h2, main h3, main .lead, main p:not(.eyebrow):not(.quote), main img'
	)
);

revealTargets.forEach((element, index) => {
	element.classList.add('reveal');
	element.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
	element.dataset.revealIndex = String(index);
});

const revealObserver = new IntersectionObserver(
	(entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.12 }
);

revealTargets.forEach((element) => revealObserver.observe(element));

document.querySelectorAll('main ul, main ol').forEach((list) => {
	Array.from(list.children).forEach((item, index) => {
		item.classList.add('reveal', 'reveal--left');
		item.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
		revealObserver.observe(item);
	});
});

const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
	const toggleBackToTop = () => {
		backToTop.classList.toggle('visible', window.scrollY > 480);
	};
	toggleBackToTop();
	window.addEventListener('scroll', toggleBackToTop, { passive: true });
	backToTop.addEventListener('click', () => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
	});
}

document.querySelectorAll('form[data-demo]').forEach((form) => {
	form.setAttribute('action', '#');
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const output = form.querySelector('[role=status]');
		if (output) {
			output.textContent = 'Este formulario es una maqueta y todavía no envía información.';
		}
	});
});
