import { useCallback } from "react";

import TargetItem from "features/PlaceOrder/components/TakeProfit/components/TargetItem/TargetItem";
import { ProfitTargetItem } from "features/PlaceOrder/model";

import styles from "./TargetsList.module.scss";
interface Props {
  targetList: ProfitTargetItem[];
  delNewTarget: (item: ProfitTargetItem) => void;
  setTargetItemInfo: (item: ProfitTargetItem) => void;
  distributePercentsInputs: () => void;
}

const TargetsList = ({
  targetList,
  delNewTarget,
  setTargetItemInfo,
  distributePercentsInputs,
}: Props) => {
  const handleDelTarget = useCallback(
    (item: ProfitTargetItem) => () => {
      delNewTarget(item);
    },
    [delNewTarget],
  );

  const handleChangeInput = useCallback(
    (item: ProfitTargetItem) => {
      setTargetItemInfo(item);
    },
    [setTargetItemInfo],
  );

  const handleBlurPercentInput = useCallback(() => {
    distributePercentsInputs();
  }, [distributePercentsInputs]);

  const renderTargetsList = () =>
    targetList.map((item) => (
      <TargetItem
        key={item.id}
        targetItem={item}
        onDelTarget={handleDelTarget(item)}
        handleChangeInput={handleChangeInput}
        handleBlurPercentInput={handleBlurPercentInput}
      />
    ));

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.label}>Profit</div>
        <div className={styles.label}>Target price</div>
        <div className={styles.label}>Amount to sell</div>
      </div>
      {renderTargetsList()}
    </div>
  );
};

export default TargetsList;
