import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { colors, screenSize } from "../../constants";
import { Controller, useForm } from "react-hook-form";
import {
  IAddMedicationFormValueTypes,
  InitAddMedicationFormValues,
} from "./helper";
import { ADD_MEDICATION } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { AddOutlined, CloseOutlined } from "@mui/icons-material";
import ErrorBox from "../../components/ErrorBox";
import Button from "../../components/CustomButton";
import {
  medicationTypeLabels,
  readingTimingLabels,
  textInputRegex,
} from "../../utils";
import CustomInput from "../../components/CustomInput";
import {
  MedicationDosageType,
  MedicationType,
  ReadingTiming,
} from "../../types";
import { GiMedicines } from "react-icons/gi";
import { BiSolidInjection } from "react-icons/bi";
import {
  GET_ALL_MEDICATIONS,
  GET_ALL_MEDICATIONS_BY_MEAL_TYPE,
} from "../../graphql/queries";
import CustomMultiSelect from "../../components/CustomMultiSelect";

type Props = {
  handleClose: () => void;
  open: boolean;
};

const AddMedicationMobile = ({ open, handleClose }: Props) => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { control, formState, handleSubmit, reset, watch } = useForm({
    defaultValues: { ...InitAddMedicationFormValues },
    mode: "onChange",
  });

  const selectedMedicationType = watch("type");

  const isSelectedMedicationTypeTablet =
    selectedMedicationType === MedicationType.tablet;

  const [addMedication, { loading: isAddMedicationLoading }] =
    useMutation(ADD_MEDICATION);

  const { errors } = formState;
  const COMMON_PROPS = { control: control, errors: errors };
  const isFormDisabled = !formState.isValid;

  const handleOnClose = () => {
    reset({ ...InitAddMedicationFormValues });
    handleClose();
  };

  const onSubmitHandler = async (formValues: IAddMedicationFormValueTypes) => {
    setIsLoading(true);

    try {
      const { data } = await addMedication({
        variables: {
          input: {
            ...formValues,
            dosageType: isSelectedMedicationTypeTablet
              ? MedicationDosageType.mg
              : MedicationDosageType.units,
          },
        },
        refetchQueries: [
          {
            query: GET_ALL_MEDICATIONS,
          },
          {
            query: GET_ALL_MEDICATIONS_BY_MEAL_TYPE, 
          },
        ],
      });

      if (data?.addMedication?._id) {
        handleOnClose();
      }
    } catch (error) {
      console.error("Error while adding medication: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      fullScreen={isTablet}
      fullWidth
      maxWidth={"sm"}
      PaperProps={{
        style: {
          borderRadius: !isTablet ? "32px" : "0",
        },
      }}
      open={open}
      onClose={handleOnClose}
      sx={{ marginTop: isTablet ? "56px" : 0 }}
    >
      <Stack
        component={"form"}
        noValidate
        onSubmit={handleSubmit(onSubmitHandler)}
        gap={isTablet ? 2 : 0}
      >
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 5,
            pb: 1,
            ...(isTablet && { px: 2, pt: 3 }),
            gap: 4,
            borderBottom: "none",
          }}
        >
          <DialogTitle sx={{ p: 0 }}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography fontSize={isTablet ? 24 : 28} fontWeight={700}>
                Add New Medication
              </Typography>
              <IconButton onClick={handleOnClose} sx={{ ml: "auto" }}>
                <CloseOutlined />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Stack gap={2.5}>
            <Controller
              name="type"
              {...COMMON_PROPS}
              rules={{
                required: true,
              }}
              render={({ field, fieldState: { error } }) => (
                <Stack gap={1}>
                  <Stack direction="row" gap={2}>
                    {Object.values(MedicationType).map((type) => {
                      const isSelected = field.value === type;

                      return (
                        <Box
                          key={type}
                          onClick={() => field.onChange(type)}
                          sx={{
                            flex: 1,
                            px: 2,
                            py: 2,
                            borderRadius: 4,
                            textAlign: "center",
                            border: `2px solid ${
                              isSelected ? colors.primary : "#E0E0E0"
                            }`,
                            backgroundColor: isSelected
                              ? colors.primaryBg
                              : "#FFF",
                            color: isSelected ? colors.primary : "#757575",
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <Box mb={0.5}>
                            {type === MedicationType.tablet ? (
                              <GiMedicines style={{ fontSize: "28px" }} />
                            ) : (
                              <BiSolidInjection style={{ fontSize: "28px" }} />
                            )}
                          </Box>
                          <Typography fontWeight={600}>
                            {medicationTypeLabels[type]}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                  <Typography
                    sx={{
                      px: 2,
                      color: error ? colors.red : colors.contentSecondary,
                      fontSize: "12px",
                    }}
                  >
                    Medication type
                  </Typography>
                </Stack>
              )}
            />

            <Controller
              name="name"
              {...COMMON_PROPS}
              rules={{
                required: true,
                pattern: {
                  value: textInputRegex,
                  message: "Invalid characters",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  error={error !== undefined}
                  styles={{ width: "100%" }}
                  placeholder="Enter medication name"
                  label="Medication name"
                />
              )}
            />

            <Controller
              name="readingTime"
              {...COMMON_PROPS}
              rules={{
                required: true,
                validate: (val) =>
                  (Array.isArray(val) && val.length > 0) ||
                  "Select at least one option",
              }}
              render={({ field, fieldState: { error } }) => {
                const value = Array.isArray(field.value) ? field.value : [];

                return (
                  <CustomMultiSelect
                    {...field}
                    value={value ?? []}
                    error={error !== undefined}
                    styles={{ width: "100%" }}
                    placeholder="When do you take this medication?"
                    label="Consumption time"
                    labelMap={readingTimingLabels}
                    onChange={(e) => {
                      const selected =
                        typeof e.target.value === "string"
                          ? e.target.value.split(",")
                          : e.target.value;

                      field.onChange(selected);
                    }}
                  >
                    {Object.values(ReadingTiming).map((readingTime) => (
                      <MenuItem key={readingTime} value={readingTime}>
                        {readingTimingLabels[readingTime]}
                      </MenuItem>
                    ))}
                  </CustomMultiSelect>
                );
              }}
            />

            {isSelectedMedicationTypeTablet ? (
              <Controller
                name="dosage"
                {...COMMON_PROPS}
                rules={{
                  required: isSelectedMedicationTypeTablet ? true : false,
                  pattern: {
                    value: textInputRegex,
                    message: "Invalid characters",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <CustomInput
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                    error={!!error}
                    styles={{ width: "100%" }}
                    placeholder="Enter medication dosage in mg"
                    label="Medication dosage"
                  />
                )}
              />
            ) : (
              <Controller
                name="dosagePerReadingTime"
                {...COMMON_PROPS}
                rules={{
                  validate: (val) =>
                    (val &&
                      typeof val === "object" &&
                      Object.keys(val).length > 0 &&
                      Object.values(val).every((v) => v && v.trim() !== "")) ||
                    "Please enter dosage for each selected time",
                }}
                render={({ field, fieldState: { error } }) => {
                  const selectedReadings = watch("readingTime") || [];

                  return (
                    <Stack gap={2}>
                      {selectedReadings.map((rt) => (
                        <CustomInput
                          key={rt}
                          label={`Dosage for ${readingTimingLabels[rt]}`}
                          placeholder={`Enter insulin units`}
                          value={
                            (field.value as Record<ReadingTiming, string>)?.[
                              rt
                            ] || ""
                          }
                          onChange={(e) => {
                            field.onChange({
                              ...(field.value as Record<ReadingTiming, string>),
                              [rt]: e.target.value,
                            });
                          }}
                          error={error !== undefined}
                        />
                      ))}
                    </Stack>
                  );
                }}
              />
            )}

            <ErrorBox formState={formState} style={{ mb: 2 }} />
          </Stack>
        </DialogContent>
        <Box
          sx={{
            py: isTablet ? 0 : 2,
            px: isTablet ? 2 : 5,
            pb: 5,
          }}
        >
          <Button
            startIcon={<AddOutlined />}
            buttonText={"Add Medication"}
            isLoading={isLoading || isAddMedicationLoading}
            disabled={isFormDisabled}
            onClick={() => onSubmitHandler}
          />
        </Box>
      </Stack>
    </Dialog>
  );
};

export default AddMedicationMobile;
