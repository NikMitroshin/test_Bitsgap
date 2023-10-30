import TargetItem from "features/PlaceOrder/components/TakeProfit/components/TargetItem/TargetItem";
import { ProfitTargetItem } from "features/PlaceOrder/model";

import styles from "./TargetsList.module.scss";
interface Props {
  targetList: ProfitTargetItem[];
}

const TargetsList = ({ targetList }: Props) => {
  const renderTargetsList = () =>
    targetList.map((item) => (
      <TargetItem
        key={`${item.profit}_${item.targetPrice}`}
        targetItem={item}
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
