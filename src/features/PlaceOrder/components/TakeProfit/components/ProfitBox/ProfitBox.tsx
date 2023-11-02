import { QUOTE_CURRENCY } from "features/PlaceOrder/constants";

import styles from "./ProfitBox.module.scss";

type Props = {
  profit: number;
};

const ProfitBox = ({ profit }: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.label}>Projected profit</div>

      <div className={styles.divider} />

      <div className={styles.value}>
        <div className={styles.amount}>{profit}</div>
        <div className={styles.currency}>{QUOTE_CURRENCY}</div>
      </div>
    </div>
  );
};

export default ProfitBox;
