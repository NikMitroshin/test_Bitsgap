import * as cn from "classnames";
import AddButton from "features/PlaceOrder/components/TakeProfit/components/AddButton/AddButton";
import ProfitBox from "features/PlaceOrder/components/TakeProfit/components/ProfitBox/ProfitBox";
import TargetsList from "features/PlaceOrder/components/TakeProfit/components/TargetsList/TargetsList";
import { useStore } from "features/PlaceOrder/store/context";
import { observer } from "mobx-react";
import ErrorMessage from "shared/components/ErrorMessage/ErrorMessage";
import { QuestionTooltip } from "shared/components/QuestionTooltip/QuestionTooltip";
import { Switch } from "shared/components/Switch/Switch";

import styles from "./TakeProfit.module.scss";

export const TakeProfit = observer(() => {
  const {
    isTargetsOn,
    targetList,
    projectedProfit,
    formErrorMessage,
    setIsTargetsOn,
    addNewTarget,
    delNewTarget,
    setTargetItemInfo,
    distributePercentsInputs,
    setTargetProfitAndPriceDependency,
  } = useStore();

  return (
    <div className={cn(styles.root)}>
      <div className={styles.head}>
        <QuestionTooltip message="Take Profit description" />
        <div className={styles.label}>Take Profit</div>
        <Switch
          checked={isTargetsOn}
          onChange={(value) => setIsTargetsOn(value)}
        />
      </div>
      {isTargetsOn && (
        <div className={styles.open}>
          {!!targetList.length && (
            <TargetsList
              targetList={targetList}
              delNewTarget={delNewTarget}
              setTargetItemInfo={setTargetItemInfo}
              distributePercentsInputs={distributePercentsInputs}
              setTargetProfitAndPriceDependency={
                setTargetProfitAndPriceDependency
              }
            />
          )}
          {!!formErrorMessage && <ErrorMessage text={formErrorMessage} />}
          <AddButton count={targetList.length} onPress={addNewTarget} />
          <ProfitBox profit={projectedProfit} />
        </div>
      )}
    </div>
  );
});
