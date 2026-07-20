import { fireEvent, render, screen } from '@testing-library/react';
import { PreferencesControls } from '../../../src/components/PreferencesControls/PreferencesControls';
import { PreferencesProvider } from '../../../src/hooks/usePreferences';

it('shows a language flag button', () => {
  render(
    <PreferencesProvider>
      <PreferencesControls />
    </PreferencesProvider>
  );
  // The control exposes the active language as a flag (Brazil for PT, USA for EN).
  expect(screen.getByTitle(/English|Portugu/i)).toBeInTheDocument();
});

it('shows the current theme', () => {
  render(
    <PreferencesProvider>
      <PreferencesControls />
    </PreferencesProvider>
  );
  expect(screen.getByTitle(/Light mode|Dark mode/i)).toBeInTheDocument();
});

it('toggles the language flag when clicked', () => {
  render(
    <PreferencesProvider>
      <PreferencesControls />
    </PreferencesProvider>
  );
  const languageButton = screen.getByTitle(/English|Portugu/i);
  const before = languageButton.getAttribute('title');
  fireEvent.click(languageButton);
  const after = screen.getByTitle(/English|Portugu/i).getAttribute('title');
  expect(after).not.toBe(before);
});
