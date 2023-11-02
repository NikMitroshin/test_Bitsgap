import { memo } from "react";

import { InputLabelProps as MUIInputLabelProps } from "@mui/material/InputLabel/InputLabel";
import * as cn from "classnames";
import { QUOTE_CURRENCY } from "features/PlaceOrder/constants";
import { ProfitTargetItem } from "features/PlaceOrder/model";
import { DeleteIcon } from "icons/DeleteIcon/DeleteIcon";
import { isEqual } from "lodash";
import ButtonOnlyIcon from "shared/components/ButtonOnlyIcon/ButtonOnlyIcon";
import { NumberInput } from "shared/components/NumberInput/NumberInput";

import styles from "./TargetItem.module.scss";
interface Props {
  targetItem: ProfitTargetItem;
  onDelTarget: (item: ProfitTargetItem) => void;
  handleChangeTargetInfo: (item: ProfitTargetItem) => void;
  handleBlurPercentInput: () => void;
  handleBlurProfitAndPrice: (
    item: ProfitTargetItem,
    isChangedProfit: boolean,
  ) => void;
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

  const changeInputTargetPrice = (value) => {
    handleChangeTargetInfo({
      ...targetItem,
      targetPrice: value || 0,
    });
  };

  const handleBlurProfit = () => {
    handleBlurProfitAndPrice(targetItem, true);
  };

  const handleBlurTargetPrice = () => {
    handleBlurProfitAndPrice(targetItem, false);
  };
  //TODO fix values / make 1 000 000
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
        <NumberInput
          value={targetItem.targetPrice}
          onChange={changeInputTargetPrice}
          InputLabelProps={{ classes: labelClasses }}
          InputProps={{ classes: inputClasses }}
          onBlur={handleBlurTargetPrice}
          isElastic
          fontSize={"12px"}
        />
        <div className={cn(styles.label, styles.mark)}>{QUOTE_CURRENCY}</div>
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
        <ButtonOnlyIcon
          Icon={DeleteIcon}
          onPress={() => onDelTarget(targetItem)}
        />
      </div>
    </div>
  );
};

export default memo(TargetItem, (prev, next) => isEqual(prev, next));
