import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors, ROUTES, screenSize } from "../../constants";
import { IAddReadingFormValueTypes, InitAddReadingFormValues } from "./helper";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_FOOD, ADD_READING } from "../../graphql/mutations";
import {
  GET_ALL_FOODS,
  GET_ALL_MEDICATIONS,
  GET_TODAYS_OR_LATEST_READINGS,
} from "../../graphql/queries";
import { AddOutlined, CloseOutlined } from "@mui/icons-material";
import ErrorBox from "../../components/ErrorBox";
import Button from "../../components/CustomButton";
import dayjs from "dayjs";
import CustomDateTimePicker from "../../components/CustomDateTimePicker";
import CustomSelect from "../../components/CustomSelect";
import {
  Food,
  Medication,
  MedicationViewType,
  ReadingTiming,
} from "../../types";
import {
  readingTimesRequiringFoodInput,
  readingTimingLabels,
  Windows1252Regex,
} from "../../utils";
import { CustomInputField } from "../../components/CustomInputField";
import CustomMultiSelectWithChips from "../../components/CustomMultiSelectWithChips";
import MedicationList from "../../components/MedicationList";

const AddReading = () => {
  const [open, setOpen] = useState(true);
  const [foodItems, setFoodItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedicationIds, setSelectedMedicationIds] = useState<string[]>(
    []
  );

  const navigate = useNavigate();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { control, formState, handleSubmit, reset, watch } = useForm({
    defaultValues: { ...InitAddReadingFormValues },
    mode: "onChange",
  });

  const selectedReadingTime = watch("readingTime");

  const [addReading, { loading: isAddReadingLoading }] =
    useMutation(ADD_READING);
  const [addFood] = useMutation(ADD_FOOD);
  const { data: foodsData, loading: isFoodsDataLoading } =
    useQuery(GET_ALL_FOODS);

  const { data: medicationsData, loading: isMedicationsDataLoading } =
    useQuery(GET_ALL_MEDICATIONS);

  if (isFoodsDataLoading || isMedicationsDataLoading) return <p>Loading...</p>;

  const foods: Food[] = foodsData?.getAllFoods || [];
  const medications: Medication[] = medicationsData?.getAllMedications || [];

  const { errors } = formState;
  const COMMON_PROPS = { control, errors };

  const handleOnClose = () => {
    reset({ ...InitAddReadingFormValues });
    setOpen(false);
    navigate(ROUTES.DASHBOARD);
  };

  const onSubmitHandler = async (formValues: IAddReadingFormValueTypes) => {
    setIsLoading(true);
    const formInput = {
      ...formValues,
      foods: foodItems,
      medications: selectedMedicationIds,
      glucoseLevel: Number(formValues.glucoseLevel),
    };

    try {
      const { data } = await addReading({
        variables: { input: formInput },
        refetchQueries: [{ query: GET_TODAYS_OR_LATEST_READINGS }],
      });
      if (data?.addReading?._id) handleOnClose();
    } catch (error) {
      console.error("Error while adding reading: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const matchingMedsWithSelectedReadingTime =
    selectedReadingTime &&
    medications?.filter((med: Medication) =>
      med.readingTime.includes(selectedReadingTime)
    );

  return (
    <Dialog
      fullScreen={isTablet}
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleOnClose}
      PaperProps={{ style: { borderRadius: !isTablet ? "32px" : "0" } }}
      sx={{ marginTop: isTablet ? "56px" : 0 }}
    >
      <Stack
        component="form"
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
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize={isTablet ? 24 : 28} fontWeight={700}>
                Add New Reading
              </Typography>
              <IconButton onClick={handleOnClose}>
                <CloseOutlined />
              </IconButton>
            </Stack>
          </DialogTitle>

          <Stack gap={2.5}>
            <Stack gap={1}>
              <Typography fontSize={16} fontWeight={500} pl={0.5}>
                Date & time of entry
              </Typography>
              <Controller
                name="dateTime"
                control={control}
                rules={{ required: "Reading date & time is required" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <CustomDateTimePicker
                    value={value ? dayjs(value) : null}
                    onChange={onChange}
                    error={!!error}
                    label={error?.message}
                    styles={{ width: "100%" }}
                    placeholder="Select date and time"
                  />
                )}
              />
            </Stack>

            <Stack gap={1}>
              <Typography fontSize={16} fontWeight={500} pl={0.5}>
                Entry type
              </Typography>
              <Controller
                name="readingTime"
                {...COMMON_PROPS}
                rules={{ required: "Reading entry type is required." }}
                render={({ field, fieldState: { error } }) => (
                  <CustomSelect
                    {...field}
                    error={!!error}
                    styles={{ width: "100%" }}
                    placeholder="Select entry type"
                    defaultValue={field.value}
                    onChange={(e: SelectChangeEvent<unknown>) =>
                      field.onChange(e.target.value)
                    }
                    label={error?.message}
                  >
                    {Object.values(ReadingTiming).map((readingTime) => (
                      <MenuItem key={readingTime} value={readingTime}>
                        {readingTimingLabels[readingTime]}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                )}
              />
            </Stack>

            <Stack bgcolor={colors.lightGrey1} padding={2} borderRadius={2}>
              <Typography fontSize={18} fontWeight={500} pl={0.5} mb={1.25}>
                {selectedReadingTime
                  ? readingTimingLabels[selectedReadingTime]
                  : "Blood glucose"}{" "}
                reading
              </Typography>

              <Typography fontSize={16} fontWeight={500} pl={0.5} mb={0.5}>
                Blood Glucose (mg/dL)
              </Typography>
              <Controller
                name="glucoseLevel"
                {...COMMON_PROPS}
                rules={{
                  required: "Blood glucose level is required",
                  min: {
                    value: 50,
                    message: "Blood glucose level must be greater than 50",
                  },
                  max: {
                    value: 600,
                    message: "Blood glucose level must be lesser than 600",
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Only whole numbers are allowed",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <CustomInputField
                    {...field}
                    type="number"
                    onChange={(e) => {
                      let inputValue = e.target.value
                        .replace(/\D/g, "")
                        .replace(/^0+(?!$)/, "");
                      const numericValue = Number(inputValue);
                      if (numericValue > 600 || numericValue < 0) return;
                      field.onChange(inputValue);
                    }}
                    sx={{ width: "100%" }}
                    label={error?.message}
                    error={!!error}
                  />
                )}
              />

              <Typography
                fontSize={16}
                fontWeight={500}
                pl={0.5}
                mb={0.5}
                mt={2.5}
              >
                Notes (optional)
              </Typography>
              <Controller
                name="notes"
                {...COMMON_PROPS}
                rules={{
                  pattern: {
                    value: Windows1252Regex,
                    message: "Invalid characters",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <CustomInputField
                    {...field}
                    multiline
                    rows={4}
                    placeholder="Add any relevant notes here..."
                    error={!!error}
                    styles={{ width: "100%" }}
                  />
                )}
              />
            </Stack>

            {selectedReadingTime &&
              readingTimesRequiringFoodInput.includes(selectedReadingTime) && (
                <Stack gap={0.5}>
                  <Typography fontSize={16} fontWeight={500} pl={0.5}>
                    What did you have for{" "}
                    {readingTimingLabels[selectedReadingTime].split(" ")[1]}?
                  </Typography>
                  <CustomMultiSelectWithChips
                    value={foodItems}
                    setValue={setFoodItems}
                    placeholder="Enter or select food(s)"
                    options={foods.map((food) => ({
                      id: food._id,
                      name: food.name,
                    }))}
                    onNewItemCreate={async (newFoodName) => {
                      try {
                        const { data } = await addFood({
                          variables: { input: { name: newFoodName } },
                          refetchQueries: [{ query: GET_ALL_FOODS }],
                        });
                        return data?.addFood?._id;
                      } catch (error) {
                        console.error("Failed to create food:", error);
                        return "";
                      }
                    }}
                    chipSx={{
                      bgcolor: colors.primaryBg,
                      color: colors.primary,
                    }}
                  />
                </Stack>
              )}

            {/* Add Exercise details later */}

            {selectedReadingTime &&
              matchingMedsWithSelectedReadingTime.length > 0 && (
                <Stack gap={2}>
                  <Stack gap={0.5}>
                    <Typography fontSize={18} fontWeight={"500"}>
                      Select medications taken
                    </Typography>
                    <Typography fontSize={14} color={colors.contentSecondary}>
                      Choose which medications you've taken for this entry
                    </Typography>
                  </Stack>
                  <MedicationList
                    medListViewType={MedicationViewType.ADD_READING}
                    onSelectionChange={setSelectedMedicationIds}
                    selectedMedicationIds={selectedMedicationIds}
                    selectedReadingType={selectedReadingTime}
                  />
                </Stack>
              )}

            <ErrorBox formState={formState} style={{ mb: 2 }} />
          </Stack>
        </DialogContent>

        <Box sx={{ py: isTablet ? 0 : 2, px: isTablet ? 2 : 5, pb: 5 }}>
          <Button
            startIcon={<AddOutlined />}
            buttonText="Add Reading"
            isLoading={isLoading || isAddReadingLoading}
            onClick={() => handleSubmit(onSubmitHandler)()}
          />
        </Box>
      </Stack>
    </Dialog>
  );
};

export default AddReading;
