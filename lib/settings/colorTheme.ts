import type { ColorThemeId } from 'types/settings';

import config from 'configs/app';
import { getEnvValue } from 'configs/app/utils';
import type { ColorMode } from 'toolkit/chakra/color-mode';

export interface ColorTheme {
  id: ColorThemeId;
  label: string;
  colorMode: ColorMode;
  hex: string;
  sampleBg: string;
}

const getNestedValue = (obj: Record<string, unknown>, property: string) => {
  const keys = property.split('.');
  let current = obj;
  for (const key of keys) {
    const value = current[key];
    if (value === undefined) {
      return undefined;
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      current = value as Record<string, unknown>;
    } else {
      return value;
    }
  }
};

export function getThemeHexWithOverrides(colorThemeId: ColorThemeId) {
  const defaultHex = COLOR_THEMES.find((theme) => theme.id === colorThemeId)?.hex;

  if (!defaultHex) {
    return;
  }

  const overrides = config.UI.colorTheme.overrides;
  if (colorThemeId === 'light') {
    const value = getNestedValue(overrides, 'bg.primary._light.value');
    return typeof value === 'string' ? value : defaultHex;
  }

  if (colorThemeId === 'dark') {
    const value = getNestedValue(overrides, 'bg.primary._dark.value');
    return typeof value === 'string' ? value : defaultHex;
  }

  return defaultHex;
};

export function getDefaultColorTheme(colorMode: ColorMode) {
  const colorTheme = COLOR_THEMES.filter((theme) => theme.colorMode === colorMode).slice(-1)[0];

  return colorTheme.id;
}

export const COLOR_THEMES: Array<ColorTheme> = [
  {
    id: 'light',
    label: 'Light',
    colorMode: 'light',
    hex: getEnvValue('NEXT_PUBLIC_COLOR_THEME_LIGHT_HEX') || '#FFFFFF',
    sampleBg: getEnvValue('NEXT_PUBLIC_COLOR_THEME_LIGHT_SAMPLE_BG') || 'linear-gradient(154deg, #EFEFEF 50%, rgba(255, 255, 255, 0.00) 330.86%)',
  },
  {
    id: 'dark',
    label: 'Dark',
    colorMode: 'dark',
    hex: getEnvValue('NEXT_PUBLIC_COLOR_THEME_DARK_HEX') || '#101112',
    sampleBg: getEnvValue('NEXT_PUBLIC_COLOR_THEME_DARK_SAMPLE_BG') || 'linear-gradient(161deg, #000 9.37%, #383838 92.52%)',
  },
];
