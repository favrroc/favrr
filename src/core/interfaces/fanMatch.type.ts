export type IFanMatchStats = {
  numberOfInvestors?: number,
  numberOfFans?: number,
  pps?: number,
  marketCap?: number,
  delta?: number,
  shareVolume?: number,
  usdcVolume?: number,
  equity?: number,
  todaysReturn?: number,
  totalReturn?: number
}

export type IFanMatchStatsData = {
  first: IFanMatchStats,
  second: IFanMatchStats
}

export type IUserMatchStatus = {
  started: boolean,
  step: number
}