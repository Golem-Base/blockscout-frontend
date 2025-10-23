import type { SelectValueChangeDetails } from '@chakra-ui/react';

export interface TimeChartItemRaw {
  date: Date;
  dateLabel?: string;
  value: number | string | null;
}

export interface TimeChartItem {
  date: Date;
  date_to?: Date;
  dateLabel?: string;
  value: number;
  isApproximate?: boolean;
}

export interface SimpleChartItem {
  x: number;
  y: number;
}

export interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface ChartOffset {
  x?: number;
  y?: number;
}

export interface TimeChartDataItem {
  items: Array<TimeChartItem>;
  name: string;
  units?: string;
  color?: string;
  valueFormatter?: (value: number) => string;
  filters?: Array<ChartFilter>;
}

export interface SimpleChartDataItem {
  items: Array<SimpleChartItem>;
  name: string;
  units?: string;
  color?: string;
  valueFormatter?: (value: number) => string;
  filters?: Array<ChartFilter>;
}

export type TimeChartData = Array<TimeChartDataItem>;

export type SimpleChartData = Array<SimpleChartDataItem>;

export interface AxisConfig {
  ticks?: number;
  nice?: boolean;
  noLabel?: boolean;
}

export interface AxesConfig {
  x?: AxisConfig;
  y?: AxisConfig;
}

export type OnFilterChange = (name: string) => ((details: SelectValueChangeDetails<string>) => void);

export interface ChartFilter {
  type: 'select';
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: OnFilterChange;
};
