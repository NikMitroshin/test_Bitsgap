import { SvgIcon } from "@mui/material";

import styles from "./InfoIcon.module.scss";

function PlusIcon() {
  return (
    <SvgIcon width={21} height={21} className={styles.root} viewBox="0 0 21 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.5 10C0.5 4.48 4.98 0 10.5 0C16.02 0 20.5 4.48 20.5 10C20.5 15.52 16.02 20 10.5 20C4.98 20 0.5 15.52 0.5 10ZM11.5 11H14.5C15.05 11 15.5 10.55 15.5 10C15.5 9.45 15.05 9 14.5 9H11.5V6C11.5 5.45 11.05 5 10.5 5C9.95 5 9.5 5.45 9.5 6V9H6.5C5.95 9 5.5 9.45 5.5 10C5.5 10.55 5.95 11 6.5 11H9.5V14C9.5 14.55 9.95 15 10.5 15C11.05 15 11.5 14.55 11.5 14V11Z"
        fill="#0078FF"
      />
    </SvgIcon>
  );
}

export { PlusIcon };
