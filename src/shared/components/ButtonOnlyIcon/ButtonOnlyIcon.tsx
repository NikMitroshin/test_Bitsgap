import styles from "./ButtonOnlyIcon.module.scss";

type Props = {
  Icon: any;
  onPress: () => void;
};

const ButtonOnlyIcon = ({ Icon, onPress }: Props) => {
  return (
    <div className={styles.root} onClick={onPress}>
      <Icon />
    </div>
  );
};

export default ButtonOnlyIcon;
