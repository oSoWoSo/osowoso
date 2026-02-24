document.addEventListener('DOMContentLoaded', function() {
    var hamburger = document.querySelector('.nav-hamburger');
    var navLeft   = document.querySelector('.nav-left');
    if (!hamburger || !navLeft) return;

    hamburger.addEventListener('click', function () {
        var isOpen = navLeft.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        hamburger.querySelector('.hamburger-icon').textContent = isOpen ? '✕' : '☰';
    });

    /* Close menu when clicking outside */
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navLeft.contains(e.target)) {
            navLeft.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.querySelector('.hamburger-icon').textContent = '☰';
        }
    });

    /* Close menu when a nav link is clicked */
    navLeft.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            navLeft.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.querySelector('.hamburger-icon').textContent = '☰';
        }
    });
});
