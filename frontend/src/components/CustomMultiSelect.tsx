import React, { CSSProperties, ReactNode, RefCallback } from "react";
import {
  Select,
  SelectProps,
  Stack,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { colors } from "../constants";

type Props = SelectProps<string[]> & {
  styles?: CSSProperties;
  selectStyles?: CSSProperties;
  placeholder?: string;
  showPlaceholderAsOption?: boolean;
  dataTestId?: string;
  children: ReactNode;
  label?: string;
  labelMap?: Record<string, string>;
};

const CustomMultiSelect = React.forwardRef<HTMLElement, Props>(
  function CustomMultiSelect(
    {
      styles,
      selectStyles,
      dataTestId,
      placeholder = "",
      label,
      children,
      error,
      value,
      labelMap,
      ...props
    },
    ref
  ) {
    return (
      <Stack
        sx={{
          ...(styles && { ...styles }),
          overflow: "hidden",
        }}
        gap={"4px"}
      >
        <Select
          {...props}
          multiple
          value={value || []}
          inputRef={ref as RefCallback<HTMLTextAreaElement | HTMLInputElement>}
          variant="filled"
          displayEmpty
          disableUnderline
          IconComponent={ExpandMoreIcon}
          data-testid={dataTestId}
          renderValue={(selected) =>
            !selected || selected.length === 0 ? (
              <Typography
                sx={{
                  color: colors.contentTertiary,
                  pl: 1,
                }}
              >
                {placeholder}
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  alignItems: "center",
                  pl: 0.5,
                }}
              >
                {(selected as string[]).map((val) => (
                  <Chip
                    key={val}
                    label={labelMap?.[val] || val}
                    size="small"
                    sx={{ backgroundColor: colors.grey2 }}
                  />
                ))}
              </Box>
            )
          }
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                maxWidth: 600,
                marginTop: 0.5,
                borderRadius: "16px",
              },
            },
          }}
          sx={{
            fontSize: "1rem",
            borderRadius: 4,
            border: 0,
            backgroundColor: error ? colors.lightRed : colors.grey3,
            ...(error && { color: colors.red }),
            "& .MuiSelect-select": {
              padding: "0.75rem 1rem",
              border: 0,
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              "&:focus": {
                borderRadius: 6,
                backgroundColor: "transparent",
              },
            },
            "& .MuiSelect-icon": {
              color: colors.contentTertiary,
            },
            ...(selectStyles && { ...selectStyles }),
          }}
        >
          {children}
        </Select>

        <Typography
          sx={{
            px: 2,
            color: error ? colors.red : colors.contentSecondary,
            fontSize: "12px",
          }}
        >
          {label}
        </Typography>
      </Stack>
    );
  }
);

export default CustomMultiSelect;
