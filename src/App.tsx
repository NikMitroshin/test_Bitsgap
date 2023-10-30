import { PlaceOrder } from "features/PlaceOrder";

import styles from "./App.module.scss";

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.form}>
        <PlaceOrder />
      </div>
    </div>
  );
}
