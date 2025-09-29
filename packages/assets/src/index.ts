// packages/assets/index.ts
export const SCREENSHOTS = {
  dark: "./screenshots/worksight-dark.png",
  light: "./screenshots/worksight-light.png"
} as const;

export const BRANDING = {
  png: "./logos/logo.png",
  svg: "./logos/logo.svg",
} as const;

export type ScreenshotKey = keyof typeof SCREENSHOTS;
export type BrandingKey = keyof typeof BRANDING;

export const getScreenshotPath = (key: ScreenshotKey): string =>
  SCREENSHOTS[key];

export const getBrandingPath = (key: BrandingKey): string =>
  BRANDING[key];
