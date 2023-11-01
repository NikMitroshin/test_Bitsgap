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
