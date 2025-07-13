import { useLocation, useNavigate } from "react-router-dom";
import { Typography, IconButton, Box, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { APP_NAME, colors, ROUTES } from "../constants";
import logo from "../assets/pngs/logo.png";

interface ToolbarContentOptions {
  onMenuClick: () => void;
  onFilterClick?: () => void;
  onSearchClick?: () => void;
}

export const useTopToolbarContent = ({
  onMenuClick,
  onFilterClick,
  onSearchClick,
}: ToolbarContentOptions) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  if (currentPath === ROUTES.ONBOARDING) {
    return {
      centerContent: (
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <img src={logo} alt="logo" width={28} />
          <Stack>
            <Typography
              fontWeight={600}
              sx={{ color: colors.primary, fontSize: "18px" }}
            >
              {APP_NAME}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "11px",
                color: colors.contentSecondary,
                fontWeight: "500",
              }}
            >
              Setup Your Preferences
            </Typography>
          </Stack>
        </Stack>
      ),
    };
  }

  if (currentPath === ROUTES.READING_HISTORY) {
    return {
      leftContent: (
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon sx={{ color: colors.primary }} />
        </IconButton>
      ),
      centerContent: (
        <Box textAlign="center" flexGrow={1}>
          <Typography
            fontWeight={600}
            sx={{ color: colors.black, fontSize: "16px" }}
          >
            History
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "11px", color: colors.contentSecondary }}
          >
            All Records
          </Typography>
        </Box>
      ),
      rightContent: (
        <Box>
          <IconButton onClick={onFilterClick}>
            <FilterListIcon sx={{ color: colors.primary }} />
          </IconButton>
          <IconButton onClick={onSearchClick}>
            <SearchIcon sx={{ color: colors.primary }} />
          </IconButton>
        </Box>
      ),
    };
  }

  // default toolbar
  return {
    leftContent: (
      <IconButton onClick={onMenuClick}>
        <MenuIcon sx={{ color: colors.primary }} />
      </IconButton>
    ),
    centerContent: (
      <Typography fontWeight={600} sx={{ color: colors.primary }}>
        {currentPath.split("/").pop()?.replace("-", " ") || "Home"}
      </Typography>
    ),
  };
};
