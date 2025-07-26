import { Stack, Typography } from "@mui/material";
import { CheckOutlined, WarningOutlined } from "@mui/icons-material";
import { GiMedicines } from "react-icons/gi";
import { BiSolidInjection } from "react-icons/bi";
import { Medication, MedicationType, ReadingTiming } from "../../types";
import { medicationColors } from "../../constants";
import { useMemo } from "react";

type Props = {
  med: Medication;
  type: "taken" | "missed";
  readingTime?: ReadingTiming;
};

const MedicationChip = ({ med, type, readingTime }: Props) => {
  const { name, dosage, dosageType, dosagePerReadingTime, type: medType } = med;

  const isTablet = medType === MedicationType.tablet;
  const colors = medicationColors[type];

  const dosageLabel = useMemo(() => {
    if (isTablet) return `${dosage}${dosageType}`;
    if (dosagePerReadingTime && readingTime) {
      const dose = dosagePerReadingTime[readingTime];
      return dose ? `${dose} ${dosageType}` : "";
    }
    return "";
  }, [isTablet, dosage, dosageType, dosagePerReadingTime, readingTime]);

  const IconComponent = isTablet ? GiMedicines : BiSolidInjection;
  const StatusIcon = type === "taken" ? CheckOutlined : WarningOutlined;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      py={0.5}
      borderRadius={1.5}
      bgcolor={colors.bg}
      border={`1px solid ${colors.border}`}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <IconComponent style={{ fontSize: 14, color: colors.icon }} />
        <Typography fontSize={12} color={colors.text}>
          {name} {dosageLabel}
        </Typography>
      </Stack>
      <StatusIcon style={{ fontSize: 14, color: colors.icon }} />
    </Stack>
  );
};

export default MedicationChip;
