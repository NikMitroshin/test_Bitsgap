import * as R from "remeda";

import ElasticInput from "shared/components/ElasticInput/ElasticInput";
import {
  TextInput,
  TextInputProps,
} from "shared/components/TextInput/TextInput";

import { useNumberFormat } from "./useNumberFormat";

type Props = Omit<TextInputProps, "onChange" | "value"> & {
  value: number | null;
  min?: number;
  max?: number;
  decimalScale?: number;
  onChange?(value: number | null): void;
  fontSize?: string;
  isElastic?: boolean;
};

function NumberInput({
  value,
  min,
  max,
  decimalScale,
  onChange,
  onBlur,
  onFocus,
  onMouseUp,
  onKeyUp,
  InputProps,
  fontSize,
  isElastic,
  ...rest
}: Props) {
  const numberInput = R.omit(
    useNumberFormat(
      value,
      { onChange, onBlur, onFocus, onMouseUp, onKeyUp },
      { min, max, decimalScale },
    ),
    ["api"],
  );
  return (
    <ElasticInput
      text={value?.toString()}
      fontSize={fontSize}
      isElastic={isElastic}
    >
      <TextInput {...rest} InputProps={{ ...InputProps, ...numberInput }} />
    </ElasticInput>
  );
}

export { NumberInput };
