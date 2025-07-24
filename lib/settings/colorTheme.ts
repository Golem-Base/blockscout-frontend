import type { ColorThemeId } from 'types/settings';

import { getEnvValue } from 'configs/app/utils';
import type { ColorMode } from 'toolkit/chakra/color-mode';

export interface ColorTheme {
  id: ColorThemeId;
  label: string;
  colorMode: ColorMode;
  hex: string;
  sampleBg: string;
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
