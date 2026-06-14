export const getTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('xeno-theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  }
  return 'light'; // Light theme is default
};

export const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const setTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem('xeno-theme', theme);
  applyTheme(theme);
};
