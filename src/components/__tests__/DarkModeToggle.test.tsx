import { vi } from 'vitest'; // Import vi from vitest
import { render, screen, fireEvent, act } from '@testing-library/react';
import DarkModeToggle from '../DarkModeToggle';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.matchMedia
let mockSystemPrefersDark = false; // Default to system preferring light theme
const mockMatchMediaEventListeners: Array<(event: Partial<MediaQueryListEvent>) => void> = [];

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({ // Use vi.fn()
    matches: query === '(prefers-color-scheme: dark)' ? mockSystemPrefersDark : false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated // Use vi.fn()
    removeListener: vi.fn(), // deprecated // Use vi.fn()
    addEventListener: vi.fn((event, listener) => { // Use vi.fn()
      if (event === 'change') {
        mockMatchMediaEventListeners.push(listener);
      }
    }),
    removeEventListener: vi.fn((event, listener) => { // Use vi.fn()
      if (event === 'change') {
        const index = mockMatchMediaEventListeners.indexOf(listener);
        if (index > -1) {
          mockMatchMediaEventListeners.splice(index, 1);
        }
      }
    }),
    dispatchEvent: vi.fn(),
  })),
});

// Helper to simulate system theme change
const simulateSystemThemeChange = (prefersDark: boolean) => {
  mockSystemPrefersDark = prefersDark;
  const mockEvent: Partial<MediaQueryListEvent> = {
    matches: prefersDark,
    media: '(prefers-color-scheme: dark)',
  };
  // Use act to wrap state updates triggered by the event
  act(() => {
    mockMatchMediaEventListeners.forEach(listener => listener(mockEvent));
  });
};

describe('DarkModeToggle', () => {
  beforeEach(() => {
    // Reset mocks and DOM before each test
    localStorageMock.clear();
    document.documentElement.classList.remove('dark');
    mockSystemPrefersDark = false; // Default system to light
    mockMatchMediaEventListeners.length = 0; // Clear listeners
    // Ensure window.matchMedia mock is reset for calls if needed, though changing mockSystemPrefersDark should suffice
    // (window.matchMedia as jest.Mock).mockClear(); // Comment out or replace if not using Jest's mock type
  });

  test('renders with light theme if html class is not dark', () => {
    render(<DarkModeToggle />);
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  test('renders with dark theme if html class is dark', () => {
    document.documentElement.classList.add('dark');
    render(<DarkModeToggle />);
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  test('toggles theme, updates localStorage, and html class on button click', () => {
    render(<DarkModeToggle />);
    const toggleButton = screen.getByRole('button');

    // Initial: Light
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByText('🌙')).toBeInTheDocument();

    // Toggle to Dark
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorageMock.getItem('theme')).toBe('dark');
    expect(screen.getByText('☀️')).toBeInTheDocument();

    // Toggle back to Light
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorageMock.getItem('theme')).toBe('light');
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  test('system theme change clears localStorage preference and adopts system theme', () => {
    mockSystemPrefersDark = false; // System initially prefers light
    render(<DarkModeToggle />);
    const toggleButton = screen.getByRole('button');

    // User sets preference to dark
    fireEvent.click(toggleButton);
    expect(localStorageMock.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByText('☀️')).toBeInTheDocument();

    // System theme changes to light (matching current user preference, but should still clear)
    // According to current logic: system change -> if(localStorage) remove localStorage -> setIsDark(systemPref)
    simulateSystemThemeChange(false); // System changes to light
    expect(document.documentElement.classList.contains('dark')).toBe(false); // Adopts system light
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(localStorageMock.getItem('theme')).toBeNull(); // User preference cleared

    // Set user preference to light again
    fireEvent.click(toggleButton); // Sets theme to dark (current is light)
    fireEvent.click(toggleButton); // Sets theme to light
    expect(localStorageMock.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // System theme changes to dark
    simulateSystemThemeChange(true); // System changes to dark
    expect(document.documentElement.classList.contains('dark')).toBe(true); // Adopts system dark
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(localStorageMock.getItem('theme')).toBeNull(); // User preference cleared
  });
  
  test('adopts system theme if no user preference is set in localStorage and system changes', () => {
    mockSystemPrefersDark = false; // Initial system: light
    render(<DarkModeToggle />);
    expect(document.documentElement.classList.contains('dark')).toBe(false); // Starts light

    // System changes to dark
    simulateSystemThemeChange(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(localStorageMock.getItem('theme')).toBeNull(); // No user preference was set

    // System changes back to light
    simulateSystemThemeChange(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(localStorageMock.getItem('theme')).toBeNull();
  });
});
