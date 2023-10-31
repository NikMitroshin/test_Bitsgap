export enum OrderSide {
  Buy = "buy",
  Sell = "sell",
}

export type ProfitTargetItem = {
  profit: number;
  targetPrice: number;
  amountPercent: number;
};
