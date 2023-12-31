import { MAX_TARGETS_LENGTH } from "features/PlaceOrder/constants";
import { PlusIcon } from "icons/PlusIcon/InfoIcon";

import styles from "./AddButton.module.scss";

interface Props {
  count: number;
  onPress: () => void;
}

const AddButton = ({ count, onPress }: Props) => {
  if (count >= MAX_TARGETS_LENGTH) {
    return null;
  }

  return (
    <div className={styles.root} onClick={onPress}>
      <PlusIcon />
      <div
        className={styles.label}
      >{`Add profit target ${count}/${MAX_TARGETS_LENGTH}`}</div>
    </div>
  );
};

export default AddButton;
