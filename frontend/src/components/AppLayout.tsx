import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LeftNav } from "../components/LeftNav";
import { colors, ROUTES, screenSize } from "../constants";
import { TopAppBar } from "./TopAppBar";
import { BottomNav } from "./BottomNav";
import { useQuery } from "@apollo/client";
import { GET_USER_SETUP_PROGRESS } from "../graphql/queries";
import { useEffect } from "react";

export const AppLayout = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const isPcAndAbove = useMediaQuery(`(max-width:${screenSize.pc})`);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isCurrentPathNameOnboarding = pathname === ROUTES.ONBOARDING;

  const { data: setupProgressData, loading: isSetupProgressDataLoading } =
    useQuery(GET_USER_SETUP_PROGRESS);

  const isLoading = isSetupProgressDataLoading;
  const hasUserCompletedOnboarding =
    !!setupProgressData?.getUserSetupProgress?.completedAt;

  useEffect(() => {
    if (!hasUserCompletedOnboarding) {
      navigate(ROUTES.ONBOARDING);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  }, [hasUserCompletedOnboarding, navigate]);

  if (isLoading) {
    return (
      <Backdrop sx={{ color: colors.white, zIndex: 9999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        flexDirection: isTablet ? "column" : "row",
      }}
    >
      {!isTablet && <LeftNav />}

      {isTablet && <TopAppBar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.lightGrey1,
          p: isTablet ? 2 : 3,
          height: !isTablet ? "calc(100vh - 120px)" : "100vh",
          overflowY: "auto",
          mb: isTablet ? "56px" : "0px",
        }}
      >
        <Stack
          sx={{
            maxWidth: "1600px",
            ...(isPcAndAbove && { width: "100%" }),
            margin: isTablet ? "0" : "0 auto",
            height: isTablet ? "auto" : "100%",
          }}
        >
          <Outlet />
        </Stack>
      </Box>

      {isTablet && !isCurrentPathNameOnboarding && <BottomNav />}
    </Box>
  );
};
