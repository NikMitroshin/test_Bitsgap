import { InputLabelProps as MUIInputLabelProps } from "@mui/material/InputLabel/InputLabel";
import * as cn from "classnames";
import { QUOTE_CURRENCY } from "features/PlaceOrder/constants";
import { ProfitTargetItem } from "features/PlaceOrder/model";
import { DeleteIcon } from "icons/DeleteIcon/DeleteIcon";
import ButtonOnlyIcon from "shared/components/ButtonOnlyIcon/ButtonOnlyIcon";
import { NumberInput } from "shared/components/NumberInput/NumberInput";

import styles from "./TargetItem.module.scss";
interface Props {
  targetItem: ProfitTargetItem;
  onDelTarget: () => void;
  handleChangeTargetInfo: (item: ProfitTargetItem) => void;
  handleBlurPercentInput: () => void;
  handleBlurProfitAndPrice: (isChangedProfit: boolean) => void;
}

const TargetItem = ({
  targetItem,
  onDelTarget,
  handleChangeTargetInfo,
  handleBlurPercentInput,
  handleBlurProfitAndPrice,
}: Props) => {
  const labelClasses: MUIInputLabelProps["classes"] = {
    root: styles.inputLabel,
  };

  const inputClasses: MUIInputLabelProps["classes"] = {
    root: styles.inputRoot,
    input: styles.input,
  };

  const changeInputPercent = (value) => {
    handleChangeTargetInfo({
      ...targetItem,
      amountPercent: value || 0,
      isUserEdit: true,
    });
  };

  const changeInputProfit = (value) => {
    handleChangeTargetInfo({
      ...targetItem,
      profit: value || 0,
    });
  };

  const handleBlurProfit = () => {
    handleBlurProfitAndPrice(true);
  };

  // const handleBlurTargetPrice = () => {
  //   handleBlurProfitAndPrice(false);
  // };

  return (
    <div className={styles.root}>
      <div className={styles.column}>
        <NumberInput
          value={targetItem.profit}
          max={500}
          onChange={changeInputProfit}
          InputLabelProps={{ classes: labelClasses }}
          InputProps={{ classes: inputClasses }}
          onBlur={handleBlurProfit}
        />
        <div className={styles.label}>%</div>
      </div>

      <div className={styles.column}>
        <div className={styles.price}>{targetItem.targetPrice}</div>
        <div className={styles.label}>{QUOTE_CURRENCY}</div>
      </div>

      <div className={styles.column}>
        <NumberInput
          value={targetItem.amountPercent}
          max={100}
          onChange={changeInputPercent}
          InputLabelProps={{ classes: labelClasses }}
          InputProps={{ classes: inputClasses }}
          onBlur={() => handleBlurPercentInput()}
        />
        <div className={styles.label}>%</div>
      </div>

      <div className={cn(styles.column, styles.delete)}>
        <ButtonOnlyIcon Icon={DeleteIcon} onPress={onDelTarget} />
      </div>
    </div>
  );
};

export default TargetItem;
