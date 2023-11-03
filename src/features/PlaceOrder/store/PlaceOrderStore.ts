import { PROFIT_AMOUNT_STEP_DEFAULT } from "features/PlaceOrder/constants";
import {
  calculateProfit,
  calculateProjectProfit,
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
  @observable price: number = 0;
  @observable amount: number = 0;
  @observable isTargetsOn = false;
  @observable targetList: ProfitTargetItem[] = [];
  @observable projectedProfit: number = 0;
  @observable formErrorMessage: string = "";

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
    this.resetFormError();
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
    this.resetFormError();
  };

  @action
  public setPrice = (price: number) => {
    this.price = price;
    this.distributePriceInputs();
  };

  @action
  public setAmount = (amount: number) => {
    this.amount = amount;
    this.resetFormError();
    this.calculateProjectedProfit();
  };

  @action
  public setTotal = (total: number) => {
    this.amount = this.price > 0 ? dividedBy(total, this.price) : 0;
    this.resetFormError();
    this.calculateProjectedProfit();
  };

  @action
  public resetFormError = () => {
    this.formErrorMessage = "";
    this.targetList = this.targetList.map((item) => {
      return { ...item, isError: false };
    });
  };

  @action
  public setIsTargetsOn = (value: boolean) => {
    if (value) {
      this.addNewTarget();
    } else {
      this.resetFormError();
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
      isError: false,
    });

    this.distributePercentsInputs();
  };

  @action
  public delNewTarget = (item: ProfitTargetItem) => {
    this.targetList = this.targetList.filter((elem) => elem.id !== item.id);

    this.distributePercentsInputs();
  };

  @action
  public setTargetItemInfo = (
    newItem: ProfitTargetItem,
    isWithoutResetError?: boolean,
  ) => {
    if (!isWithoutResetError) {
      this.resetFormError();
    }

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
    this.resetFormError();
    // price <= 0
    if (this.price <= 0) {
      this.formErrorMessage = "Price must be greater than 0";
      return false;
    }

    // amount <= 0
    if (this.amount <= 0) {
      this.formErrorMessage = "Amount must be greater than 0";
      return false;
    }

    if (!this.isTargetsOn) {
      return true;
    }

    // cумма profit > 500
    const profitSum = this.targetList.reduce((accumulator, item) => {
      return plus(accumulator, item.profit);
    }, 0);
    if (profitSum > 500) {
      this.formErrorMessage = "Maximum profit sum is 500%";
      return false;
    }

    // profit < 0.01
    const targetWithSmallProfit = this.targetList.find(
      (item) => item.profit < 0.01,
    );
    if (targetWithSmallProfit) {
      this.setTargetItemInfo({ ...targetWithSmallProfit, isError: true }, true);
      this.formErrorMessage = "Minimum value is 0.01";
      return false;
    }

    // profit значение каждого больше предыдущего
    const targetSmallerThanPrev = this.targetList.find(
      (item, index) =>
        this.targetList[index - 1] &&
        item.profit <= this.targetList[index - 1].profit,
    );
    if (targetSmallerThanPrev) {
      this.setTargetItemInfo({ ...targetSmallerThanPrev, isError: true }, true);
      this.formErrorMessage =
        "Each target's profit should be greater than the previous one";
      return false;
    }

    // сумма всех процентов >/< 100
    const percentSum = this.targetList.reduce((accumulator, item) => {
      return plus(accumulator, item.amountPercent);
    }, 0);
    if (percentSum > 100) {
      this.formErrorMessage = `${percentSum} out of 100% selected. Please decrease by ${minus(
        percentSum,
        100,
      )}`;
      return false;
    }
    if (percentSum < 100) {
      this.formErrorMessage = `${percentSum} out of 100% selected. Please increase by ${minus(
        100,
        percentSum,
      )}`;
      return false;
    }

    return true;
  };
}
