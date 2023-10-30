import { PROFIT_AMOUNT_STEP_DEFAULT } from "features/PlaceOrder/constants";
import type { OrderSide } from "features/PlaceOrder/model";
import { ProfitTargetItem } from "features/PlaceOrder/model";
import { observable, computed, action, makeObservable } from "mobx";

export class PlaceOrderStore {
  constructor() {
    makeObservable(this);
  }

  @observable activeOrderSide: OrderSide = "buy";
  @observable price = 0;
  @observable amount = 0;
  @observable isTargetsOn = false;
  @observable targetList: ProfitTargetItem[] = [];

  @computed get total(): number {
    return this.price * this.amount;
  }

  @action
  distributePercentsEqually = (list: ProfitTargetItem[]) => {
    const percentEqually = Math.floor(100 / this.targetList.length);

    const percentLast = 100 - percentEqually * (this.targetList.length - 1);

    this.targetList = list.map((item, index) => {
      return {
        ...item,
        amountPercent: index === list.length - 1 ? percentLast : percentEqually,
      };
    });
  };

  @action
  public setOrderSide = (side: OrderSide) => {
    this.activeOrderSide = side;
  };

  @action
  public setPrice = (price: number) => {
    this.price = price;
  };

  @action
  public setAmount = (amount: number) => {
    this.amount = amount;
  };

  @action
  public setTotal = (total: number) => {
    this.amount = this.price > 0 ? total / this.price : 0;
  };

  @action
  public setIsTargetsOn = (value: boolean) => {
    this.isTargetsOn = value;
  };

  @action
  public addNewTarget = () => {
    const list = this.targetList;
    const lastElem = list[list.length - 1];

    const profit = (lastElem?.profit || 0) + PROFIT_AMOUNT_STEP_DEFAULT;
    const targetPrice =
      this.activeOrderSide === "buy"
        ? this.price * 1 + profit / 100
        : this.price * 1 - profit / 100;

    const amountPercent = 0;

    list.push({
      profit,
      targetPrice,
      amountPercent,
    });

    this.distributePercentsEqually(list);
  };
}
