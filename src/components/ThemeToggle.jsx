import React from 'react';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;