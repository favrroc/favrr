export interface FavStatistics {
  date?: string;
  equity?: number;
  equityDelta?: number;
  equityDeltaPercent?: number;
  price?: number;
  volume?: number;
};

export interface DataPointRaw {
  x: number;
  price: number;
  delta: number;
  deltaPercentage: number;
}

export enum ChartMode {
  PRICE,
  VOLUME,
}

export enum TimeRange {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  TRIMESTER,
  SEMESTER,
  ALL,
}