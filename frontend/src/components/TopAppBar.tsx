import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  useMediaQuery,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { screenSize, colors, APP_NAME } from "../constants";
import logo from "../assets/pngs/logo.png";
import useMenuItemsList from "../hooks/useMenuItems";
import ProfileAvatar from "./ProfileAvatar";
import { useTopToolbarContent } from "../hooks/useTopToolbarContent";

export const TopAppBar = () => {
  const menuItems = useMenuItemsList();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const navigate = useNavigate();
  const location = useLocation();

  const { leftContent, centerContent, rightContent } = useTopToolbarContent({
    onMenuClick: () => setDrawerOpen(true),
    onFilterClick: () => console.log("Filter clicked"),
    onSearchClick: () => console.log("Search clicked"),
  });

  const currentPath = location.pathname;

  if (!isTablet) return null;

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: colors.white,
          color: colors.black,
          boxShadow: "0 1px 0px rgba(0, 0, 0, 0.1)",
          zIndex: 100000,
          borderBottom: `1px solid ${colors.grey1Bg}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {leftContent}
          {centerContent}
          {rightContent ?? <ProfileAvatar />}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <img src={logo} alt="logo" width={28} />
              <Typography
                fontWeight="500"
                color={colors.primary}
                fontSize={"20px"}
              >
                {APP_NAME}
              </Typography>
            </Box>
          </List>
          <List>
            {menuItems.map((item) => {
              const isSelected = currentPath === item.path;
              return (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    bgcolor: isSelected ? "#2AAC75" : "transparent",
                    color: isSelected ? "#fff" : "inherit",
                    "& .MuiListItemIcon-root": {
                      color: isSelected ? "#fff" : "inherit",
                    },
                    "&:hover": {
                      bgcolor: isSelected ? "#2AAC75" : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
