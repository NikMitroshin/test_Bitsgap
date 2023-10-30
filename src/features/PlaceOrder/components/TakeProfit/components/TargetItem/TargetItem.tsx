import { ProfitTargetItem } from "features/PlaceOrder/model";

import styles from "./TargetItem.module.scss";
interface Props {
  targetItem: ProfitTargetItem;
}

const TargetItem = ({ targetItem }: Props) => {
  return <div className={styles.root}></div>;
};

export default TargetItem;
