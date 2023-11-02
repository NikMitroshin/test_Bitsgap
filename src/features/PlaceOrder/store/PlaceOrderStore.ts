import { PROFIT_AMOUNT_STEP_DEFAULT } from "features/PlaceOrder/constants";
import {
  calculateProfit,
  calculateTargetPrice,
} from "features/PlaceOrder/helpers/calculateHelpers";
import { OrderSide, ProfitTargetItem } from "features/PlaceOrder/model";
import { dividedBy, minus, multipliedBy, plus } from "libs/bn";
import { observable, computed, action, makeObservable } from "mobx";
import { nanoid } from "nanoid";

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
    return multipliedBy(this.price, this.amount);
  }

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

  /**
   * Distribute the remaining interest among untouched inputs
   */
  @action
  public distributePercentsInputs = () => {
    let untouchedInputsCount = this.targetList.length;

    const distributedPercentsByUser = this.targetList.reduce(
      (accumulator, item) => {
        if (item.isUserEdit) {
          untouchedInputsCount--;
          return plus(accumulator, item.amountPercent);
        }
        return accumulator;
      },
      0,
    );

    const percentForDistribute =
      distributedPercentsByUser < 100
        ? minus(100, distributedPercentsByUser)
        : 0;

    const percentEqually = Math.floor(
      dividedBy(percentForDistribute, untouchedInputsCount),
    );

    const percentForFirst = minus(
      percentForDistribute,
      multipliedBy(percentEqually, minus(untouchedInputsCount, 1)),
    );

    let isRemaindersDistribute;

    this.targetList = this.targetList.map((item) => {
      if (!item.isUserEdit) {
        if (!isRemaindersDistribute) {
          isRemaindersDistribute = true;

          return {
            ...item,
            amountPercent: percentForFirst,
          };
        }
        return {
          ...item,
          amountPercent: percentEqually,
        };
      }

      return item;
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
    this.amount = this.price > 0 ? dividedBy(total, this.price) : 0;
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

    const profit = plus(lastElem?.profit || 0, PROFIT_AMOUNT_STEP_DEFAULT);
    const targetPrice = calculateTargetPrice({
      orderSide: this.activeOrderSide,
      price: this.price,
      profit,
    });

    const amountPercent = 0;

    list.push({
      id: nanoid(),
      profit,
      targetPrice,
      amountPercent,
      isUserEdit: false,
    });

    this.distributePercentsInputs();
  };

  @action
  public delNewTarget = (item: ProfitTargetItem) => {
    this.targetList = this.targetList.filter((elem) => elem.id !== item.id);

    this.distributePercentsInputs();
  };

  @action
  public setTargetItemInfo = (newItem: ProfitTargetItem) => {
    this.targetList = this.targetList.map((item) =>
      item.id === newItem.id ? newItem : item,
    );
  };

  @action
  public setTargetProfitAndPriceDependency = ({
    item,
    isChangedProfit,
  }: {
    item: ProfitTargetItem;
    isChangedProfit: boolean;
  }) => {
    this.setTargetItemInfo({
      ...item,
      targetPrice: isChangedProfit
        ? calculateTargetPrice({
            orderSide: this.activeOrderSide,
            price: this.price,
            profit: item.profit,
          })
        : item.targetPrice,
      profit: isChangedProfit
        ? item.profit
        : calculateProfit({
            orderSide: this.activeOrderSide,
            price: this.price,
            targetPrice: item.targetPrice,
          }),
    });
  };
}
