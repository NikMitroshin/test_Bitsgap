import { OrderSide, ProfitTargetItem } from "features/PlaceOrder/model";
import { dividedBy, minus, multipliedBy, plus } from "libs/bn";

export const calculateTargetPrice = ({
  orderSide,
  profit,
  price,
}: {
  orderSide: OrderSide;
  profit: number;
  price: number;
}) =>
  orderSide === OrderSide.Buy
    ? multipliedBy(price, plus(1, dividedBy(profit, 100))) // targetPrice = price * (1 + profit / 100)
    : multipliedBy(price, minus(1, dividedBy(profit, 100))); // targetPrice = price * (1 - profit / 100)

export const calculateProfit = ({
  orderSide,
  targetPrice,
  price,
}: {
  orderSide: OrderSide;
  targetPrice: number;
  price: number;
}) =>
  orderSide === OrderSide.Buy
    ? price
      ? multipliedBy(minus(dividedBy(targetPrice, price), 1), 100) // profit = (targetPrice / price - 1) * 100
      : 0
    : price
    ? multipliedBy(plus(dividedBy(targetPrice, price), 1), 100) // profit = (targetPrice / price + 1) * 100
    : 0;

export const calculateProjectProfit = ({
  orderSide,
  target,
  targetAmount,
  formPrice,
}: {
  orderSide: OrderSide;
  target: ProfitTargetItem;
  targetAmount: number;
  formPrice: number;
}): number => {
  return orderSide === OrderSide.Buy
    ? dividedBy(
        multipliedBy(
          multipliedBy(targetAmount, minus(target.targetPrice, formPrice)),
          target.amountPercent,
        ),
        100,
      ) // profit = ((targetAmount * (target.targetPrice - formPrice)) * target.amountPercent) / 100
    : dividedBy(
        multipliedBy(
          multipliedBy(targetAmount, minus(formPrice, target.targetPrice)),
          target.amountPercent,
        ),
        100,
      ); // profit = ((targetAmount * (formPrice - target.targetPrice)) * target.amountPercent) / 100
};
