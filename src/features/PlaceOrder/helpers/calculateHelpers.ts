import { OrderSide } from "features/PlaceOrder/model";
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
    ? multipliedBy(price, plus(1, dividedBy(profit, 100)))
    : multipliedBy(price, minus(1, dividedBy(profit, 100)));

// targetPrice = price * (1 + profit / 100)
// (targetPrice / price - 1) * 100 = profit

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
      ? multipliedBy(minus(dividedBy(targetPrice, price), 1), 100)
      : 0
    : price
    ? multipliedBy(plus(dividedBy(targetPrice, price), 1), 100)
    : 0;
