import { useState } from 'react';

export const ModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded bg-gray-200 p-2 transition-colors dark:bg-gray-800"
      aria-label="Toggle theme"
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};
