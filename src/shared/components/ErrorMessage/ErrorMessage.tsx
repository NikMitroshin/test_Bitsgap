import styles from "./ErrorMessage.module.scss";

type Props = {
  text: string;
};

const ErrorMessage = ({ text }: Props) => {
  return <div className={styles.root}>{text}</div>;
};

export default ErrorMessage;
