import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import {
  selectCreateSystemCadence,
  selectCreateSystemDescription,
  selectCreateSystemTitle,
  setCadence,
  setDescription,
  setSpecificDays,
  setTitle,
} from "@/features/createSystemSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  Checkbox,
  RadioButton,
  TextInput,
  useTheme,
} from "react-native-paper";
import { z } from "zod";

const SystemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cadence: z.enum(["daily", "weekdays", "specific", "manual"], {
    required_error: "Please choose how often you want to do this system",
  }),
  specificDays: z.array(z.string()),
});

type FormValues = z.infer<typeof SystemSchema>;

/**
 * React Native component for creating a new system with a validated form.
 *
 * Presents a form for entering a system title, optional description, and selecting a cadence (frequency), including the option to specify particular days of the week. Form state is managed with react-hook-form and validated using a Zod schema. On successful submission, updates the global state with the form values and navigates to the next step in the system creation flow.
 *
 * The UI dynamically displays checkboxes for day selection when "Specific days" cadence is chosen.
 */
export default function NewSystem() {
  const { colors } = useTheme();
  const appDispatch = useAppDispatch();

  const title = useAppSelector(selectCreateSystemTitle);
  const description = useAppSelector(selectCreateSystemDescription);
  const cadence = useAppSelector(selectCreateSystemCadence);

  const { control, formState, getValues, watch, setValue } =
    useForm<FormValues>({
      defaultValues: {
        title: title || "",
        description: description || "",
        cadence: cadence || "daily",
        specificDays: [],
      },
      resolver: zodResolver(SystemSchema),
    });

  const { isValid, isDirty } = formState;
  const selectedCadence = watch("cadence");
  const specificDays = watch("specificDays");

  const onSaveContinue = () => {
    if (!isValid || !isDirty) {
      console.log("Form is not valid or dirty, cannot save.");
      return;
    }

    const values = getValues();
    appDispatch(setTitle(values.title));
    appDispatch(setDescription(values.description));
    appDispatch(setCadence(values.cadence));
    appDispatch(setSpecificDays(values.specificDays));

    router.push("/systems/new-routine");
  };

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}>
            <View>
              <Header title="Create a new system" enableArrowBack />
              <View>
                <View className="py-4">
                  <View className="flex flex-col gap-6 py-4 px-4 mb-4">
                    {/* Title Input */}
                    <View className="flex flex-col gap-2">
                      <ThemedText
                        style={{
                          fontWeight: 600,
                          color: colors.onSurfaceVariant,
                          fontSize: 14,
                        }}
                      >
                        System Title *
                      </ThemedText>
                      <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            mode="outlined"
                            placeholder="e.g Morning Runs"
                            theme={{
                              colors: {
                                background: colors.surfaceVariant,
                                onSurfaceVariant: colors.outlineVariant,
                              },
                            }}
                            onChangeText={onChange}
                            style={{
                              height: 40,
                            }}
                            autoFocus
                          />
                        )}
                      />
                    </View>

                    {/* Description Input */}
                    <View className="flex flex-col gap-2">
                      <ThemedText
                        style={{
                          fontWeight: 600,
                          color: colors.onSurfaceVariant,
                          fontSize: 14,
                        }}
                      >
                        System Description
                      </ThemedText>
                      <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            mode="outlined"
                            placeholder="Why is this system important to you?"
                            theme={{
                              colors: {
                                background: colors.surfaceVariant,
                                onSurfaceVariant: colors.outlineVariant,
                              },
                            }}
                            multiline
                            numberOfLines={4}
                            onChangeText={onChange}
                            value={value}
                            textAlignVertical="center"
                            style={{
                              minHeight: 100,
                              //maxHeight: 200,
                              paddingVertical: 10,
                            }}
                          />
                        )}
                      />
                    </View>

                    {/* Candence Input */}
                    <View className="flex flex-col gap-2">
                      <ThemedText
                        style={{
                          fontWeight: 600,
                          color: colors.onSurfaceVariant,
                          fontSize: 14,
                        }}
                      >
                        How often do you want to do this system?
                      </ThemedText>
                      <Controller
                        control={control}
                        name="cadence"
                        render={({ field: { value, onChange } }) => (
                          <View className="gap-1">
                            <View className="flex flex-row items-center gap-2">
                              <RadioButton
                                value="daily"
                                status={
                                  value === "daily" ? "checked" : "unchecked"
                                }
                                onPress={() => onChange("daily")}
                              />
                              <ThemedText>Every day</ThemedText>
                            </View>
                            <View className="flex flex-row items-center gap-2">
                              <RadioButton
                                value="weekdays"
                                status={
                                  value === "weekdays" ? "checked" : "unchecked"
                                }
                                onPress={() => onChange("weekdays")}
                              />
                              <ThemedText>Weekdays only (Mon - Fri)</ThemedText>
                            </View>
                            <View className="flex flex-row items-center gap-2">
                              <RadioButton
                                value="specific"
                                status={
                                  value === "specific" ? "checked" : "unchecked"
                                }
                                onPress={() => onChange("specific")}
                              />
                              <ThemedText>Specific days</ThemedText>
                            </View>
                            {selectedCadence === "specific" && (
                              <View className="flex flex-row flex-wrap items-center px-2">
                                {[
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                  "Sunday",
                                ].map((day) => (
                                  <View
                                    key={day}
                                    className="flex flex-row items-center gap-2"
                                  >
                                    <Checkbox
                                      status={
                                        specificDays.includes(day)
                                          ? "checked"
                                          : "unchecked"
                                      }
                                      onPress={() => {
                                        const updatedDays =
                                          specificDays.includes(day)
                                            ? specificDays.filter(
                                                (d) => d !== day
                                              )
                                            : [...specificDays, day];
                                        setValue("specificDays", updatedDays);
                                      }}
                                      color={colors.primary}
                                    />
                                    <ThemedText
                                      style={{
                                        color: colors.outlineVariant,
                                        fontSize: 14,
                                      }}
                                    >
                                      {day}
                                    </ThemedText>
                                  </View>
                                ))}
                              </View>
                            )}
                            <View className="flex flex-row items-center gap-2">
                              <RadioButton
                                value="manual"
                                status={
                                  value === "manual" ? "checked" : "unchecked"
                                }
                                onPress={() => onChange("manual")}
                              />
                              <ThemedText>
                                Just when I choose to do it
                              </ThemedText>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View className="w-[95%] mx-auto mb-20 flex flex-row justify-between items-center">
            <Button
              mode="outlined"
              //className="py-1"
              onPress={() => {}}
              disabled={!isValid || !isDirty}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              //className="py-1"
              onPress={onSaveContinue}
              disabled={!isValid || !isDirty}
            >
              Save & Continue
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
}
