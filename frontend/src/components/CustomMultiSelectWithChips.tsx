import {
  Box,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import {
  CSSProperties,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { colors } from "../constants";

type Option = {
  id: string;
  name: string;
};

type Props = {
  label?: string;
  placeholder?: string;
  styles?: CSSProperties;
  error?: boolean;
  errorMessage?: string;
  value: string[];
  setValue: (val: string[]) => void;
  options: Option[];
  chipSx?: SxProps;
  onNewItemCreate?: (name: string) => Promise<string>;
};

const CustomMultiSelectWithChips = ({
  label,
  placeholder = "Enter or select",
  value,
  setValue,
  options,
  styles,
  error,
  errorMessage,
  chipSx,
  onNewItemCreate,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const name = inputValue.trim().toLowerCase();
      const existing = options.find((opt) => opt.name.toLowerCase() === name);

      let idToAdd = existing?.id;

      try {
        setIsLoading(true);
        if (!idToAdd && onNewItemCreate) {
          idToAdd = await onNewItemCreate(name);
        }

        if (idToAdd && !value.includes(idToAdd)) {
          setValue([...value, idToAdd]);
        }
      } finally {
        setIsLoading(false);
        setInputValue("");
      }
    }
  };

  const handleSelect = async (selectedName: string) => {
    const name = selectedName.toLowerCase();
    const existing = options.find((opt) => opt.name.toLowerCase() === name);

    let idToAdd = existing?.id;

    try {
      setIsLoading(true);
      if (!idToAdd && onNewItemCreate) {
        idToAdd = await onNewItemCreate(name);
      }

      if (idToAdd && !value.includes(idToAdd)) {
        setValue([...value, idToAdd]);
      }
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setValue(value.filter((item) => item !== id));
  };

  return (
    <Stack ref={wrapperRef} sx={{ position: "relative", ...styles }} gap={1}>
      <TextField
        fullWidth
        variant="filled"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        autoComplete=""
        InputProps={{
          disableUnderline: true,
          endAdornment: isLoading ? (
            <CircularProgress
              size={18}
              sx={{ color: colors.contentTertiary }}
            />
          ) : (
            <ExpandMoreIcon
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                cursor: "pointer",
                color: error ? colors.red : colors.contentTertiary,
              }}
            />
          ),
          style: {
            backgroundColor: error ? colors.lightRed : colors.grey3,
            borderRadius: "16px",
          },
          inputProps: {
            style: {
              padding: "0.75rem 1rem",
              borderRadius: "24px 0 0 24px",
              border: 0,
            },
          },
        }}
        error={error}
      />

      {/* Chips */}
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {value.map((id) => {
          const food = options.find((opt) => opt.id === id);
          return (
            <Chip
              key={id}
              label={food?.name || id}
              onDelete={() => handleDelete(id)}
              deleteIcon={<CloseOutlined style={{ color: colors.primary }} />}
              sx={{ backgroundColor: colors.grey2, ...chipSx }}
            />
          );
        })}
      </Stack>

      {/* Dropdown */}
      {showDropdown && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
            borderRadius: 2,
            mt: 0.5,
            bgcolor: "#F5FAFF",
          }}
        >
          {isLoading ? (
            <MenuItem disabled sx={{ fontStyle: "italic", fontSize: "13px" }}>
              Loading...
            </MenuItem>
          ) : options.filter((opt) => !value.includes(opt.id)).length === 0 ? (
            <MenuItem
              disabled
              sx={{ fontStyle: "italic", fontSize: "13px", color: "#64748b" }}
            >
              {options.length === 0
                ? "No foods available. Please create one."
                : "You have selected all the foods. Create more."}
            </MenuItem>
          ) : (
            options
              .filter((opt) => !value.includes(opt.id))
              .map((opt, index, arr) => (
                <Box key={opt.id}>
                  <MenuItem
                    onClick={() => handleSelect(opt.name)}
                    sx={{ fontSize: "14px" }}
                  >
                    {opt.name}
                  </MenuItem>
                  {index < arr.length - 1 && (
                    <Box
                      sx={{
                        height: "1px",
                        backgroundColor: "#E3E8EF",
                        mx: 2,
                        my: 0.5,
                      }}
                    />
                  )}
                </Box>
              ))
          )}
        </Paper>
      )}

      <Typography
        sx={{
          px: 1,
          color: error ? colors.red : colors.contentSecondary,
          fontSize: "12px",
        }}
      >
        {error ? errorMessage : label}
      </Typography>
    </Stack>
  );
};

export default CustomMultiSelectWithChips;
