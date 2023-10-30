import type { ReactNode, SyntheticEvent } from "react";

import { Tooltip as MUITooltip, TooltipProps } from "@mui/material";

import styles from "./Tooltip.module.scss";

interface Props {
  message: ReactNode;
  children: TooltipProps["children"];
  open?: boolean;
  placement?: TooltipProps["placement"];
  disableInteractive?: boolean;
  disableHoverListener?: boolean;
  disableTouchListener?: boolean;
  onClose?: (event: SyntheticEvent | Event) => void;
}

function Tooltip({
  children,
  message,
  placement,
  open,
  disableInteractive = true,
  disableHoverListener,
  disableTouchListener,
  onClose,
}: Props) {
  // TODO need fix type onClose methods in MUITooltip
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // noinspection TypeScriptValidateTypes

  return (
    <MUITooltip
      title={<>{message}</>}
      classes={{
        tooltip: styles.root,
        arrow: styles.arrow,
        popper: styles.popper,
      }}
      placement={placement || "bottom"}
      open={!!open}
      arrow
      disableFocusListener // onFocus and onBlur do not work if using a Tooltip with TextField https://github.com/mui-org/material-ui/issues/19883#issuecomment-592980194
      disableInteractive={!!disableInteractive}
      disableHoverListener={!!disableHoverListener}
      disableTouchListener={!!disableTouchListener}
      onClose={onClose}
    >
      {children}
    </MUITooltip>
  );
}

export { Tooltip };
