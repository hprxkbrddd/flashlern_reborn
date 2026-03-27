declare module 'next-themes' {
  export type Theme = 'light' | 'dark' | 'system' | string;

  export function useTheme(): {
    theme?: Theme;
    setTheme?: (theme: Theme) => void;
    resolvedTheme?: Theme;
    systemTheme?: Theme | undefined;
  };

  export const ThemeProvider: import('react').FC<{
    children?: React.ReactNode;
    attribute?: string;
    defaultTheme?: Theme;
    enableSystem?: boolean;
  }>;

  export default ThemeProvider;
}
