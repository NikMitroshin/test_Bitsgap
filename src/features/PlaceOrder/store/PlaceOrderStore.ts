import { PROFIT_AMOUNT_STEP_DEFAULT } from "features/PlaceOrder/constants";
import {
  calculateProfit,
  calculateProjectProfit,
  calculateTargetPrice,
} from "features/PlaceOrder/helpers/calculateHelpers";
import { OrderSide, ProfitTargetItem } from "features/PlaceOrder/model";
import { dividedBy, minus, multipliedBy, plus } from "libs/bn";
import { observable, computed, action, makeObservable, toJS } from "mobx";
import { nanoid } from "nanoid";

export class PlaceOrderStore {
  constructor() {
    makeObservable(this);
  }

  @observable activeOrderSide: OrderSide = OrderSide.Buy;
  @observable price: number = 0;
  @observable amount: number = 0;
  @observable isTargetsOn = false;
  @observable targetList: ProfitTargetItem[] = [];
  @observable projectedProfit: number = 0;

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

    this.calculateProjectedProfit();
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

    let isRemaindersDistributed;

    this.targetList = this.targetList.map((item) => {
      if (!item.isUserEdit) {
        if (!isRemaindersDistributed) {
          isRemaindersDistributed = true;

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

    this.calculateProjectedProfit();
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
    this.calculateProjectedProfit();
  };

  @action
  public setTotal = (total: number) => {
    this.amount = this.price > 0 ? dividedBy(total, this.price) : 0;
    this.calculateProjectedProfit();
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

    this.calculateProjectedProfit();
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

  @action
  public calculateProjectedProfit = () => {
    this.projectedProfit = this.targetList.reduce((accumulator, item) => {
      const profit = calculateProjectProfit({
        orderSide: this.activeOrderSide,
        target: item,
        targetAmount: this.amount,
        formPrice: this.price,
      });

      return plus(accumulator, profit);
    }, 0);
  };

  @action
  public validateForm = () => {
    // price > 0 (Общая)
    if (this.price <= 0) {
      console.log("price > 0 (Общая)");
      // error
      return false;
    }

    if (!this.isTargetsOn) {
      return true;
    }

    // cумма profit <= 500 (Общая)
    const profitSum = this.targetList.reduce((accumulator, item) => {
      return plus(accumulator, item.profit);
    }, 0);
    if (profitSum > 500) {
      console.log("cумма profit <= 500 (Общая)");
      // error
      return false;
    }

    // profit > 0.01 (ПО ИНПУТУ)
    const targetWithSmallProfit = this.targetList.find(
      (item) => item.profit < 0.01,
    );
    if (targetWithSmallProfit) {
      console.log("profit > 0.01 (ПО ИНПУТУ)", toJS(targetWithSmallProfit));
      // error targetWithSmallProfit
      return false;
    }

    // profit значение каждого больше предыдущего (ПО ИНПУТУ)
    const targetSmallerThanPrev = this.targetList.find(
      (item, index) =>
        this.targetList[index - 1] &&
        item.profit <= this.targetList[index - 1].profit,
    );
    if (targetSmallerThanPrev) {
      console.log(
        "profit значение каждого больше предыдущего (ПО ИНПУТУ)",
        toJS(targetSmallerThanPrev),
      );
      // error targetWithSmallProfit
      return false;
    }

    // сумма всех процентов > 100 (Общая)
    const percentSum = this.targetList.reduce((accumulator, item) => {
      return plus(accumulator, item.amountPercent);
    }, 0);

    if (percentSum > 100) {
      console.log("сумма всех процентов > 100 (Общая)");
      // error
      return false;
    }

    // сумма всех процентов < 100  (Общая)
    if (percentSum < 100) {
      console.log("сумма всех процентов < 100  (Общая)");
      // error
      return false;
    }

    return true;
  };
}
