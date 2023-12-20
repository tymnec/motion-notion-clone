"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * Creates a theme provider component that wraps the given children.
 *
 * @param {ThemeProviderProps} children - The children components to be wrapped.
 * @param {Object} props - Additional props to be passed to the NextThemesProvider component.
 * @return {JSX.Element} The wrapped NextThemesProvider component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
