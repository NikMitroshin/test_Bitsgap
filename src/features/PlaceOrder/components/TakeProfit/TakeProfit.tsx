import * as cn from "classnames";
import AddButton from "features/PlaceOrder/components/TakeProfit/components/AddButton/AddButton";
import TargetItem from "features/PlaceOrder/components/TakeProfit/components/TargetItem/TargetItem";
import styles from "features/PlaceOrder/components/TakeProfit/TakeProfit.module.scss";
import { useStore } from "features/PlaceOrder/store/context";
import { observer } from "mobx-react";
import { QuestionTooltip } from "shared/components/QuestionTooltip/QuestionTooltip";
import { Switch } from "shared/components/Switch/Switch";

export const TakeProfit = observer(() => {
  const { isTargetsOn, targetList, setIsTargetsOn, addNewTarget } = useStore();

  const renderTargetsList = () =>
    targetList.map((item) => (
      <TargetItem
        key={`${item.profit}_${item.targetPrice}`}
        targetItem={item}
      />
    ));

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
        <div className={styles.targetsBox}>
          {renderTargetsList()}
          <AddButton count={targetList.length} onPress={addNewTarget} />
          {/*profit*/}
        </div>
      )}
    </div>
  );
});
