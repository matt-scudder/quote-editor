export function initializeTheme(): void {
  let theme: string | null = null
  try {
    theme = localStorage.getItem('theme');
  } catch (e) {
    console.warn('Error initializing theme:', e);
  } 
  try {
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch (e) {
    console.warn('Error initializing theme:', e);
  } 
  if (theme === 'dark'){
    document.documentElement.classList.add(theme);
  }
}
