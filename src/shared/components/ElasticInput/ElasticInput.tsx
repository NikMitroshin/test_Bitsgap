import { ReactNode, useEffect, useState } from "react";

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
    return <div>{children}</div>;
  }

  return (
    <div style={{ fontSize: fontSize ? fontSize : "inherit", width }}>
      {children}
    </div>
  );
};

export default ElasticInput;
