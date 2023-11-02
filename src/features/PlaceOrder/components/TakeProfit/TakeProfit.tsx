import * as cn from "classnames";
import AddButton from "features/PlaceOrder/components/TakeProfit/components/AddButton/AddButton";
import TargetsList from "features/PlaceOrder/components/TakeProfit/components/TargetsList/TargetsList";
import { useStore } from "features/PlaceOrder/store/context";
import { observer } from "mobx-react";
import { QuestionTooltip } from "shared/components/QuestionTooltip/QuestionTooltip";
import { Switch } from "shared/components/Switch/Switch";

import styles from "./TakeProfit.module.scss";

export const TakeProfit = observer(() => {
  const {
    isTargetsOn,
    targetList,
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
          <AddButton count={targetList.length} onPress={addNewTarget} />
          {/*profit*/}
        </div>
      )}
    </div>
  );
});
