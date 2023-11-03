import { ReactNode, useEffect, useState } from "react";

import styles from "./ElasticInput.module.scss";
type Props = {
  isElastic: boolean | undefined;
  children: ReactNode;
  text?: string;
  fontSize?: string | undefined;
};

const ElasticInput = ({ isElastic, fontSize, text, children }: Props) => {
  const [width, setWidth] = useState("1ch");

  useEffect(() => {
    setWidth(`${text?.length || 1}ch`);
  }, [text]);

  if (!isElastic) {
    return <div className={styles.root}>{children}</div>;
  }

  return (
    <div
      className={styles.root}
      style={{
        fontSize: fontSize ? fontSize : "inherit",
        width,
      }}
    >
      {children}
    </div>
  );
};

export default ElasticInput;
