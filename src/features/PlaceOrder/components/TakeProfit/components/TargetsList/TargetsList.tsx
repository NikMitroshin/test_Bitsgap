import { useCallback } from "react";

import TargetItem from "features/PlaceOrder/components/TakeProfit/components/TargetItem/TargetItem";
import { ProfitTargetItem } from "features/PlaceOrder/model";

import styles from "./TargetsList.module.scss";
interface Props {
  targetList: ProfitTargetItem[];
  delNewTarget: (item: ProfitTargetItem) => void;
  setTargetItemInfo: (item: ProfitTargetItem) => void;
  distributePercentsInputs: () => void;
  setTargetProfitAndPriceDependency: ({
    item,
    isChangedProfit,
  }: {
    item: ProfitTargetItem;
    isChangedProfit: boolean;
  }) => void;
}

const TargetsList = ({
  targetList,
  delNewTarget,
  setTargetItemInfo,
  distributePercentsInputs,
  setTargetProfitAndPriceDependency,
}: Props) => {
  const handleDelTarget = useCallback(
    (item: ProfitTargetItem) => {
      delNewTarget(item);
    },
    [delNewTarget],
  );

  const handleChangeTargetInfo = useCallback(
    (item: ProfitTargetItem) => {
      setTargetItemInfo(item);
    },
    [setTargetItemInfo],
  );

  const handleBlurPercentInput = useCallback(() => {
    distributePercentsInputs();
  }, [distributePercentsInputs]);

  const handleBlurProfitAndPrice = useCallback(
    (item: ProfitTargetItem, isChangedProfit: boolean) => {
      setTargetProfitAndPriceDependency({ item, isChangedProfit });
    },
    [setTargetProfitAndPriceDependency],
  );

  const renderTargetsList = () =>
    targetList.map((item) => (
      <TargetItem
        key={item.id}
        targetItem={item}
        onDelTarget={handleDelTarget}
        handleChangeTargetInfo={handleChangeTargetInfo}
        handleBlurPercentInput={handleBlurPercentInput}
        handleBlurProfitAndPrice={handleBlurProfitAndPrice}
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
