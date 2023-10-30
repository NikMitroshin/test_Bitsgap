import { ProfitTargetItem } from "features/PlaceOrder/model";

interface Props {
  targetItem: ProfitTargetItem;
}

const TargetItem = ({ targetItem }: Props) => {
  return <div>{targetItem.amountPercent}</div>;
};

export default TargetItem;
