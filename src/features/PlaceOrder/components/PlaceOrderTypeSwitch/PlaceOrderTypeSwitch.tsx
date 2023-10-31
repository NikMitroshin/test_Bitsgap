import styles from "features/PlaceOrder/components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch.module.scss";
import { OrderSide } from "features/PlaceOrder/model";
import { Button } from "shared/components/Button/Button";

interface Props {
  activeOrderSide: OrderSide;
  onChange(orderSide: OrderSide): void;
}

const PlaceOrderTypeSwitch = ({ activeOrderSide, onChange }: Props) => {
  const handleToggle = (orderType: OrderSide) => {
    onChange(orderType);
  };

  return (
    <div className={styles.root}>
      <Button
        color="green"
        fullWidth
        size="small"
        inactive={activeOrderSide !== OrderSide.Buy}
        onClick={() => handleToggle(OrderSide.Buy)}
      >
        Buy
      </Button>
      <Button
        color="red"
        size="small"
        fullWidth
        inactive={activeOrderSide === OrderSide.Buy}
        onClick={() => handleToggle(OrderSide.Sell)}
      >
        Sell
      </Button>
    </div>
  );
};

export { PlaceOrderTypeSwitch };
