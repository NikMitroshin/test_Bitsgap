export enum OrderSide {
  Buy = "buy",
  Sell = "sell",
}

export type ProfitTargetItem = {
  id: string;
  profit: number;
  targetPrice: number;
  amountPercent: number;
  isUserEdit: boolean;
};
