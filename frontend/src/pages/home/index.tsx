import { Box, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import {
  DirectionsRunRounded,
  LocalDiningRounded,
  MedicationRounded,
  MonitorHeartRounded,
} from "@mui/icons-material";
import { Outlet, useLocation } from "react-router-dom";
import { APP_NAME, colors, ROUTES, screenSize } from "../../constants";

const features = [
  {
    icon: MonitorHeartRounded,
    title: "Blood glucose tracking",
    description:
      "Log before and after-meal readings and see your daily trends.",
  },
  {
    icon: LocalDiningRounded,
    title: "Meal insights",
    description: "Connect what you eat with changes in your glucose levels.",
  },
  {
    icon: MedicationRounded,
    title: "Medication reminders",
    description: "Keep your medication schedule organized and easy to follow.",
  },
  {
    icon: DirectionsRunRounded,
    title: "Activity overview",
    description: "Understand how exercise supports your metabolic health.",
  },
];

const DiaLogIllustration = ({ compact = false }: { compact?: boolean }) => (
  <Box
    component="svg"
    viewBox="0 0 520 340"
    role="img"
    aria-label="DiaLog blood glucose and wellness dashboard"
    sx={{
      width: compact ? "min(100%, 300px)" : "min(100%, 520px)",
      height: "auto",
      display: "block",
      overflow: "visible",
    }}
  >
    <defs>
      <linearGradient id="dialog-card" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#EAF4FF" />
      </linearGradient>
      <linearGradient id="dialog-drop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF8A7A" />
        <stop offset="100%" stopColor="#FF5C68" />
      </linearGradient>
      <filter id="dialog-shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow
          dx="0"
          dy="12"
          stdDeviation="14"
          floodColor="#244B74"
          floodOpacity=".14"
        />
      </filter>
    </defs>

    <circle cx="260" cy="170" r="151" fill="#EAF4FF" />
    <circle cx="85" cy="86" r="11" fill="#FFB84D" opacity=".75" />
    <circle cx="446" cy="230" r="15" fill="#67C27C" opacity=".45" />
    <path
      d="M52 242c22 0 22-22 44-22s22 22 44 22"
      fill="none"
      stroke="#9DCCFF"
      strokeWidth="6"
      strokeLinecap="round"
    />

    <g filter="url(#dialog-shadow)">
      <rect
        x="96"
        y="48"
        width="328"
        height="244"
        rx="28"
        fill="url(#dialog-card)"
      />
    </g>
    <rect x="120" y="72" width="280" height="38" rx="12" fill="#F5F9FD" />
    <circle cx="142" cy="91" r="8" fill="#67C27C" />
    <text
      x="159"
      y="97"
      fill="#2D3747"
      fontFamily="Arial, sans-serif"
      fontSize="16"
      fontWeight="700"
    >
      Today’s health snapshot
    </text>

    <g transform="translate(120 126)">
      <rect width="120" height="148" rx="18" fill="#FFF1F1" />
      <path
        d="M58 20c-7 15-25 32-25 51a26 26 0 0 0 52 0c0-19-19-36-27-51Z"
        fill="url(#dialog-drop)"
      />
      <path
        d="M48 75c4 8 15 10 22 4"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".9"
      />
      <text
        x="60"
        y="120"
        textAnchor="middle"
        fill="#2D3747"
        fontFamily="Arial, sans-serif"
        fontSize="19"
        fontWeight="700"
      >
        108
      </text>
      <text
        x="60"
        y="139"
        textAnchor="middle"
        fill="#6B7A90"
        fontFamily="Arial, sans-serif"
        fontSize="10.5"
      >
        mg/dL · in range
      </text>
    </g>

    <g transform="translate(254 126)">
      <rect width="140" height="70" rx="18" fill="#F1F8F1" />
      <text
        x="16"
        y="23"
        fill="#5C6C89"
        fontFamily="Arial, sans-serif"
        fontSize="11.5"
        fontWeight="600"
      >
        DAILY TREND
      </text>
      <path
        d="M16 50 37 42 57 46 79 29 99 36 118 22"
        fill="none"
        stroke="#67C27C"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="118" cy="22" r="5" fill="#67C27C" />
    </g>

    <g transform="translate(254 210)">
      <rect width="66" height="48" rx="14" fill="#FFF8EF" />
      <path
        d="M19 13v18M14 13v8c0 5 10 5 10 0v-8M43 13v18M43 13c8 4 8 12 0 13"
        fill="none"
        stroke="#FFB84D"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="74" width="66" height="48" rx="14" fill="#EEF5FF" />
      <g transform="translate(75 2)">
        <path
          d="m18 29 17-17a8 8 0 0 1 11 11L29 40a8 8 0 0 1-11-11Z"
          fill="none"
          stroke="#4A90E2"
          strokeWidth="3"
        />
        <path d="m27 20 11 11" stroke="#4A90E2" strokeWidth="3" />
      </g>
    </g>

    <g transform="translate(390 46)">
      <circle
        cx="30"
        cy="30"
        r="30"
        fill="#FFFFFF"
        filter="url(#dialog-shadow)"
      />
      <path
        d="M14 31h9l5-11 7 21 5-10h7"
        fill="none"
        stroke="#4A90E2"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </Box>
);

const Features = () => (
  <Grid container spacing={3}>
    {features.map(({ icon: Icon, title, description }) => (
      <Grid item xs={12} sm={6} key={title}>
        <Box display="flex" gap={1.5}>
          <Box
            width={42}
            height={42}
            borderRadius={2.5}
            bgcolor={colors.primaryBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Icon sx={{ color: colors.primary, fontSize: 23 }} />
          </Box>
          <Box>
            <Typography fontWeight={700} fontSize={15} color={colors.black}>
              {title}
            </Typography>
            <Typography
              fontSize={13}
              lineHeight={1.5}
              color={colors.contentSecondary}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
);

const Home = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { pathname } = useLocation();
  const isCurrentPathLogin = pathname === ROUTES.LOGIN;

  return (
    <Stack direction={"row"} height={"100%"} mb={isTablet ? 10 : 0}>
      {!isTablet && (
        <Stack width={"65%"} px={6} py={3} bgcolor={colors.lightGrey2}>
          <Stack gap={4}>
            <Stack gap={1} justifyContent={"center"} alignItems={"center"}>
              <DiaLogIllustration />
              <Stack gap={0.5} textAlign={"center"}>
                <Typography
                  fontWeight={600}
                  fontSize={"28px"}
                  color={colors.primary}
                >
                  {isCurrentPathLogin
                    ? `Welcome to ${APP_NAME}`
                    : `Join ${APP_NAME} today`}
                </Typography>
                <Typography fontSize={"16px"} color={colors.contentSecondary}>
                  {isCurrentPathLogin
                    ? "Your everyday companion for smarter diabetes care"
                    : "Build a clearer picture of your metabolic health"}
                </Typography>
              </Stack>
            </Stack>
            <Features />
          </Stack>
        </Stack>
      )}
      <Stack
        width={isTablet ? "100%" : "50%"}
        height={"100%"}
        pl={isTablet ? 3 : 10}
        pr={isTablet ? 3 : 20}
        display={"flex"}
        justifyContent={isTablet ? "flex-start" : "center"}
      >
        <Stack py={isTablet ? 0 : 7.5} maxWidth={"768px"}>
          {isTablet && (
            <Stack
              mt={4}
              justifyContent={"center"}
              display={"flex"}
              alignItems={"center"}
            >
              <DiaLogIllustration compact />
            </Stack>
          )}
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
