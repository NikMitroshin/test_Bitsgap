import { PROFIT_AMOUNT_STEP_DEFAULT } from "features/PlaceOrder/constants";
import { calculateTargetPrice } from "features/PlaceOrder/helpers/calculateHelpers";
import { OrderSide, ProfitTargetItem } from "features/PlaceOrder/model";
import { observable, computed, action, makeObservable } from "mobx";

export class PlaceOrderStore {
  constructor() {
    makeObservable(this);
  }

  @observable activeOrderSide: OrderSide = OrderSide.Buy;
  @observable price = 0;
  @observable amount = 0;
  @observable isTargetsOn = false;
  @observable targetList: ProfitTargetItem[] = [];

  @computed get total(): number {
    return this.price * this.amount;
  }

  @action
  distributePercentsInputs = (list: ProfitTargetItem[]) => {
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
  distributePriceInputs = () => {
    this.targetList = this.targetList.map((item) => {
      return {
        ...item,
        targetPrice: calculateTargetPrice({
          orderSide: this.activeOrderSide,
          price: this.price,
          profit: item.profit,
        }),
      };
    });
  };

  @action
  public setOrderSide = (side: OrderSide) => {
    this.setIsTargetsOn(false);
    this.activeOrderSide = side;
  };

  @action
  public setPrice = (price: number) => {
    this.price = price;
    this.distributePriceInputs();
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
    if (value) {
      this.addNewTarget();
    } else {
      this.targetList = [];
    }
    this.isTargetsOn = value;
  };

  @action
  public addNewTarget = () => {
    const list = this.targetList;
    const lastElem = list[list.length - 1];

    const profit = (lastElem?.profit || 0) + PROFIT_AMOUNT_STEP_DEFAULT;
    const targetPrice = calculateTargetPrice({
      orderSide: this.activeOrderSide,
      price: this.price,
      profit,
    });

    const amountPercent = 0;

    list.push({
      profit,
      targetPrice,
      amountPercent,
    });

    this.distributePercentsInputs(list);
  };
}
