import { initializeTheme } from '../themeInitializer';
import { vi } from 'vitest';

describe('themeInitializer', () => {
  const mockClassList = {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock document.documentElement.classList
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: mockClassList,
      },
      writable: true,
      configurable: true,
    });

    // Mock localStorage
    const localStorageMock = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: vi.fn((key: string) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; }),
        get length() { return Object.keys(store).length; },
        key: vi.fn((index: number) => Object.keys(store)[index] || null),
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true, configurable: true });

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockReturnValue({ matches: false, media: '(prefers-color-scheme: dark)' }),
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original document.documentElement if necessary, or ensure it's clean for other tests
    // For simplicity, we're relying on beforeEach to reset for these specific tests.
    // If document.documentElement was globally mocked and needs restoration:
    // delete (document as any).documentElement;
  });

  test('should add "dark" class if localStorage theme is "dark"', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('dark');
    initializeTheme();
    expect(mockClassList.add).toHaveBeenCalledWith('dark');
  });

  test('should remove "dark" class if localStorage theme is "light"', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('light');
    initializeTheme();
    expect(mockClassList.add).not.toHaveBeenCalled();
  });

  test('should add "dark" class if no localStorage theme and system prefers dark', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({ matches: true, media: '(prefers-color-scheme: dark)' });
    initializeTheme();
    expect(mockClassList.add).toHaveBeenCalledWith('dark');
  });

  test('should remove "dark" class if no localStorage theme and system prefers light', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({ matches: false, media: '(prefers-color-scheme: dark)' });
    initializeTheme();
    expect(mockClassList.add).not.toHaveBeenCalled();
  });

  test('should remove "dark" class if localStorage is empty and system prefers light (default matchMedia mock)', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    // Relies on default beforeEach mock for matchMedia (matches: false)
    initializeTheme();
    expect(mockClassList.add).not.toHaveBeenCalled();
  });

  test('should not throw if localStorage access fails', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => { throw new Error('Access denied'); });
    expect(() => initializeTheme()).not.toThrow();
    // Check it falls back to system preference (or default light if matchMedia also fails or is default)
    expect(mockClassList.add).not.toHaveBeenCalled();
  });

  test('should add "dark" class if localStorage access fails and system prefers dark', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => { throw new Error('Access denied'); });
    (window.matchMedia as ReturnType<typeof vi.fn>).mockReturnValue({ matches: true, media: '(prefers-color-scheme: dark)' });
    initializeTheme();
    expect(mockClassList.add).toHaveBeenCalledWith('dark');
  });

  test('should not throw if matchMedia access fails', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(() => { throw new Error('Not available'); });
    expect(() => initializeTheme()).not.toThrow();
    // Should default to not adding dark if all else fails
    expect(mockClassList.add).not.toHaveBeenCalled();
  });
});
