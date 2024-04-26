import { $, addClass, removeClass } from '@/assets/javascripts';

const root = document.documentElement;

const Header = () => {
  const themeSwitcher = $('.Header-themeSwitcher');
  const darkClass = 'theme:dark';
  const lightClass = 'theme:light';

  const setTheme = theme => {
    const themeStorage = localStorage.getItem('theme');

    if ((themeStorage === 'light' && !theme) || theme === 'dark') {
      addClass(root, darkClass);
      removeClass(root, lightClass);
      localStorage.setItem('theme', 'dark');
    }

    if ((themeStorage === 'dark' && !theme) || theme === 'light') {
      addClass(root, lightClass);
      removeClass(root, darkClass);
      localStorage.setItem('theme', 'light');
    }
  };

  themeSwitcher.addEventListener('click', () => setTheme());

  const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = e => (e.matches ? setTheme('dark') : setTheme('light'));
  matchMediaDark.addEventListener('change', listener);
};

Header();
