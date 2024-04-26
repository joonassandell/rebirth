const root = document.documentElement;

root.classList.remove('no-js');
root.classList.add('has-js');

const theme = localStorage.getItem('theme');
const darkClass = 'theme:dark';
const lightClass = 'theme:light';

if (theme === 'dark') {
  root.classList.add(darkClass);
} else if (theme === 'light') {
  root.classList.add(lightClass);
} else {
  const matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (matchMediaDark.matches) {
    root.classList.add(darkClass);
    localStorage.setItem('theme', 'dark');
  } else {
    root.classList.add(lightClass);
    localStorage.setItem('theme', 'light');
  }
}
