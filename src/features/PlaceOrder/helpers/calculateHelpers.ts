import { OrderSide } from "features/PlaceOrder/model";

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
    ? price * (1 + profit / 100)
    : price * (1 - profit / 100);
