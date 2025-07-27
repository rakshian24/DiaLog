import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import React from "react";
import { ReportDateEntry } from "../../types";

const readingOrder = [
  "BEFORE_BREAKFAST",
  "AFTER_BREAKFAST",
  "BEFORE_LUNCH",
  "AFTER_LUNCH",
  "BEFORE_DINNER",
  "AFTER_DINNER",
] as const;

const readingLabels: Record<(typeof readingOrder)[number], string> = {
  BEFORE_BREAKFAST: "Before Breakfast",
  AFTER_BREAKFAST: "After Breakfast",
  BEFORE_LUNCH: "Before Lunch",
  AFTER_LUNCH: "After Lunch",
  BEFORE_DINNER: "Before Dinner",
  AFTER_DINNER: "After Dinner",
};

type Props = { reports: ReportDateEntry[] };

const ReportTable = ({ reports }: Props) => {
  return (
    <Box sx={{ overflowX: "auto", width: "100%" }}>
      <TableContainer
        sx={{
          minWidth: 1300,
          overflow: "unset",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  backgroundColor: "#fff5f5",
                  borderRight: "1px solid #e0e0e0",
                  borderBottom: "1px solid #e0e0e0",
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  width: 100,
                  textAlign: "center",
                  backgroundClip: "padding-box",
                  padding: "8px",
                }}
              >
                Date
              </TableCell>

              {readingOrder.map((slot) => (
                <React.Fragment key={slot}>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#fff5f5",
                      borderRight: "1px solid #e0e0e0",
                      borderBottom: "1px solid #e0e0e0",
                      minWidth: 120,
                      whiteSpace: "nowrap",
                      padding: "8px",
                    }}
                  >
                    {readingLabels[slot]}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      backgroundColor: "#fff5f5",
                      borderRight: "1px solid #e0e0e0",
                      borderBottom: "1px solid #e0e0e0",
                      minWidth: 150,
                      whiteSpace: "nowrap",
                      padding: "8px",
                    }}
                  >
                    Meals
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.date}>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    backgroundColor: "#ffffff",
                    borderRight: "1px solid #e0e0e0",
                    whiteSpace: "nowrap",
                    padding: "8px",
                  }}
                >
                  {r.date}
                </TableCell>

                {readingOrder.map((slot) => {
                  const reading = r.readings[slot];
                  return (
                    <React.Fragment key={slot}>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: "1px solid #e0e0e0",
                          whiteSpace: "nowrap",
                          padding: "8px",
                        }}
                      >
                        {reading ? (
                          <>
                            <Typography fontWeight={600}>
                              {reading.glucoseLevel}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                              {reading.time}
                            </Typography>
                          </>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderRight: "1px solid #e0e0e0",
                          whiteSpace: "nowrap",
                          padding: "8px",
                        }}
                      >
                        {reading && reading.meals.length > 0
                          ? reading.meals.join(", ")
                          : "-"}
                      </TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportTable;
