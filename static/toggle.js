/* toggle.js – oSoWoSo theme switcher
 *
 * Expects this button in the nav:
 *   <button class="theme-toggle" aria-label="Toggle theme">
 *     <span class="icon light-icon active">☀️</span>
 *     <span class="icon dark-icon">🌙</span>
 *   </button>
 *
 * Toggles html.light-theme and persists the choice to localStorage.
 * The anti-flash one-liner in <head> also uses documentElement:
 *   <script>if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light-theme');</script>
 */

(function () {
    var STORAGE_KEY = 'theme';
    var LIGHT_CLASS  = 'light-theme';
    var root = document.documentElement;

    /* Apply saved preference – runs immediately, before DOMContentLoaded */
    if (localStorage.getItem(STORAGE_KEY) === 'light') {
        root.classList.add(LIGHT_CLASS);
    }

    function syncIcons(btn, isLight) {
        var lightIcon = btn.querySelector('.light-icon');
        var darkIcon  = btn.querySelector('.dark-icon');
        if (!lightIcon || !darkIcon) return;

        if (isLight) {
            /* light mode active → show dark-icon so user can switch back to dark */
            lightIcon.classList.remove('active');
            darkIcon.classList.add('active');
        } else {
            /* dark mode active → show light-icon so user can switch to light */
            lightIcon.classList.add('active');
            darkIcon.classList.remove('active');
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.querySelector('button.theme-toggle');
        if (btn) {
            /* Sync icons with current state on load */
            syncIcons(btn, root.classList.contains(LIGHT_CLASS));

            btn.addEventListener('click', function () {
                var isLight = root.classList.toggle(LIGHT_CLASS);
                localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
                syncIcons(btn, isLight);
            });
        }

        /* Hamburger menu */
        var hamburger = document.querySelector('.nav-hamburger');
        var navLeft   = document.querySelector('.nav-left');
        if (hamburger && navLeft) {
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
        }
    });
})();