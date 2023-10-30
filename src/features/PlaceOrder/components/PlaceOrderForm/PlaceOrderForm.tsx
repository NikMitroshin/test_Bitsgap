import styles from "features/PlaceOrder/components/PlaceOrderForm/PlaceOrderForm.module.scss";
import { PlaceOrderTypeSwitch } from "features/PlaceOrder/components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch";
import { TakeProfit } from "features/PlaceOrder/components/TakeProfit/TakeProfit";
import { BASE_CURRENCY, QUOTE_CURRENCY } from "features/PlaceOrder/constants";
import { useStore } from "features/PlaceOrder/store/context";
import { observer } from "mobx-react";
import { Button } from "shared/components/Button/Button";
import { NumberInput } from "shared/components/NumberInput/NumberInput";
import { QuestionTooltip } from "shared/components/QuestionTooltip/QuestionTooltip";

export const PlaceOrderForm = observer(() => {
  const {
    activeOrderSide,
    price,
    total,
    amount,
    setPrice,
    setAmount,
    setTotal,
    setOrderSide,
  } = useStore();

  return (
    <form className={styles.root}>
      <div className={styles.label}>
        Market direction{" "}
        <QuestionTooltip message="Market direction description" />
      </div>
      <div className={styles.content}>
        <div className={styles.typeSwitch}>
          <PlaceOrderTypeSwitch
            activeOrderSide={activeOrderSide}
            onChange={setOrderSide}
          />
        </div>
        <NumberInput
          label={`Price, ${QUOTE_CURRENCY}`}
          value={price}
          onChange={(value) => setPrice(Number(value))}
        />
        <NumberInput
          value={amount}
          label={`Amount, ${BASE_CURRENCY}`}
          onChange={(value) => setAmount(Number(value))}
        />
        <NumberInput
          value={total}
          label={`Total, ${QUOTE_CURRENCY}`}
          onChange={(value) => setTotal(Number(value))}
        />
        <TakeProfit />
        <div className={styles.submit}>
          <Button
            color={activeOrderSide === "buy" ? "green" : "red"}
            type="submit"
            fullWidth
          >
            {activeOrderSide === "buy"
              ? `Buy ${BASE_CURRENCY}`
              : `Sell ${QUOTE_CURRENCY}`}
          </Button>
        </div>
      </div>
    </form>
  );
});