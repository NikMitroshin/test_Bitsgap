import { FormEvent } from "react";

import { observer } from "mobx-react";

import styles from "features/PlaceOrder/components/PlaceOrderForm/PlaceOrderForm.module.scss";
import { PlaceOrderTypeSwitch } from "features/PlaceOrder/components/PlaceOrderTypeSwitch/PlaceOrderTypeSwitch";
import { TakeProfit } from "features/PlaceOrder/components/TakeProfit/TakeProfit";
import { BASE_CURRENCY, QUOTE_CURRENCY } from "features/PlaceOrder/constants";
import { OrderSide } from "features/PlaceOrder/model";
import { useStore } from "features/PlaceOrder/store/context";
import { Button } from "shared/components/Button/Button";
import ErrorMessage from "shared/components/ErrorMessage/ErrorMessage";
import { NumberInput } from "shared/components/NumberInput/NumberInput";
import { QuestionTooltip } from "shared/components/QuestionTooltip/QuestionTooltip";

export const PlaceOrderForm = observer(() => {
  const {
    activeOrderSide,
    price,
    total,
    amount,
    formErrorMessage,
    isTargetsOn,
    setPrice,
    setAmount,
    setTotal,
    setOrderSide,
    validateForm,
  } = useStore();

  const handleValidateForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("nevernaya forma");
      return;
    }

    console.log("yspex");
  };

  return (
    <form className={styles.root} onSubmit={(e) => handleValidateForm(e)}>
      <div className={styles.label}>
        Market direction{" "}
        <QuestionTooltip message="Market direction description" />
      </div>
      <div className={styles.content}>
        <PlaceOrderTypeSwitch
          activeOrderSide={activeOrderSide}
          onChange={setOrderSide}
        />
        <NumberInput
          label={`Price, ${QUOTE_CURRENCY}`}
          value={price}
          onChange={(value) => setPrice(Number(value))}
          min={0}
        />
        <NumberInput
          value={amount}
          label={`Amount, ${BASE_CURRENCY}`}
          onChange={(value) => setAmount(Number(value))}
          min={0}
        />
        <NumberInput
          value={total}
          label={`Total, ${QUOTE_CURRENCY}`}
          onChange={(value) => setTotal(Number(value))}
          min={0}
        />
        <TakeProfit />
        {!!formErrorMessage && !isTargetsOn && (
          <ErrorMessage text={formErrorMessage} />
        )}
        <div className={styles.submit}>
          <Button
            color={activeOrderSide === OrderSide.Buy ? "green" : "red"}
            type="submit"
            fullWidth
          >
            {activeOrderSide === OrderSide.Buy
              ? `Buy ${BASE_CURRENCY}`
              : `Sell ${QUOTE_CURRENCY}`}
          </Button>
        </div>
      </div>
    </form>
  );
});
