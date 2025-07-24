import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { MouseEventHandler, ReactElement } from "react";
import { SxProps, useMediaQuery } from "@mui/material";
import { colors, screenSize } from "../constants";

export type ButtonProps = LoadingButtonProps & {
  styles?: SxProps;
  buttonText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  dataTestId?: string;
  priority?: "primary" | "secondary" | "tertiary" | "success";
};

const Button = ({
  styles,
  buttonText,
  disabled = false,
  isLoading = false,
  onClick = () => {},
  startIcon,
  endIcon,
  dataTestId = "SubmitBtn",
  priority = "primary",
  ...props
}: ButtonProps) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const fontSize = isTablet ? "14px" : "16px";
  const borderRadius = 2;
  const defaultPadding = isTablet ? "8px 20px" : "10px 24px";
  const paddingWithEndIcon = isTablet
    ? "8px 14px 8px 20px"
    : "10px 16px 10px 24px";
  const paddingWithStartIcon = isTablet
    ? "8px 20px 8px 14px"
    : "10px 24px 10px 16px";

  return (
    <LoadingButton
      type="submit"
      loading={isLoading}
      disabled={disabled}
      onClick={onClick}
      variant={"contained"}
      startIcon={startIcon}
      endIcon={endIcon}
      data-testid={dataTestId}
      sx={{
        fontSize,
        borderRadius,
        textTransform: "none",
        p: endIcon
          ? paddingWithEndIcon
          : startIcon
          ? paddingWithStartIcon
          : defaultPadding,
        boxShadow: "none",
        bgcolor:
          priority === "primary"
            ? colors.primary
            : priority === "success"
            ? colors.green
            : colors.white,
        color:
          priority === "primary"
            ? colors.white
            : priority === "success"
            ? colors.white
            : colors.primary,
        border:
          priority === "secondary" ? `1px solid ${colors.primary}` : "none",
        "&:hover": {
          bgcolor:
            priority === "primary"
              ? colors.primary
              : priority === "secondary"
              ? colors.lightGrey2
              : priority === "success"
              ? colors.greenHover
              : colors.primary,
          boxShadow: "none",
          color:
            priority === "primary" || priority === "success"
              ? colors.white
              : colors.primary,
        },
        "&:disabled": {
          bgcolor: priority === "primary" ? colors.primary : colors.white,
          color: priority === "primary" ? colors.white : colors.primary,
          opacity: 0.6,
        },
        ...(styles && { ...styles }),
      }}
      {...props}
    >
      {buttonText}
    </LoadingButton>
  );
};

export default Button;
