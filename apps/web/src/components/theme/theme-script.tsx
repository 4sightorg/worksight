// Prevents Flash of Incorrect Theme
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var storageKey = 'worksight-theme';
              var defaultTheme = 'light';
              var theme = localStorage.getItem(storageKey) || defaultTheme;
              
              // If no stored theme and system preference is dark, use dark
              if (!localStorage.getItem(storageKey) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark';
              }
              
              var root = document.documentElement;
              var themeColorMeta = document.querySelector('meta[name="theme-color"]');
              
              if (theme === 'dark') {
                root.classList.add('dark');
                if (themeColorMeta) themeColorMeta.setAttribute('content', '#0F0F0F');
              } else {
                root.classList.remove('dark');
                if (themeColorMeta) themeColorMeta.setAttribute('content', '#ffffff');
              }
              
              // Store the resolved theme
              localStorage.setItem(storageKey, theme);
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}
