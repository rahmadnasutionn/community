"use client";

function useTheme() {
  const pref = localStorage.getItem('theme');

  if (pref === null) {
    document.documentElement.classList.add('theme-system');
  } else {
    document.documentElement.classList.remove('theme-system');
  }

  if (
    pref === 'dark' ||
    (!pref && window.matchMedia('(prefers-color-schema:dark)').matches)
  ) {
    document.documentElement.classList.add('pause-transition');
    document.documentElement.classList.add('dark');
    document.head
      .querySelector('meta[name=theme-color]')
      ?.setAttribute('content', '#1c1c1c')

      requestAnimationFrame(() => {
        document.documentElement.classList.remove('pause-transitions');
      });

    return 'dark';
  } else {
    document.documentElement.classList.add('pause-transition');
    document.documentElement.classList.remove('dark');
    document.head
      .querySelector('meta[name=theme-color]')
      ?.setAttribute('content', '#fcfcfc')

      requestAnimationFrame(() => {
        document.documentElement.classList.remove('pause-transitions');
      });

    return 'light';
  }
};

export default useTheme;