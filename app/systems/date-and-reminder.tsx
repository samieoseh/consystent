import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import {
  reset,
  selectCreateSystemCadence,
  selectCreateSystemDescription,
  selectCreateSystemEndDate,
  selectCreateSystemRoutines,
  selectCreateSystemSpecificDays,
  selectCreateSystemStartDate,
  selectCreateSystemTitle,
  setEndDate,
  setReminder,
  setStartDate,
} from "@/features/createSystemSlice";
import { darkAlhpa, lightAlhpa } from "@/lib/constants";
import { useHabitsMutation } from "@/lib/mutations/habits";
import { useRoutinesMutation } from "@/lib/mutations/routines";
import { useSystemsMutations } from "@/lib/mutations/systems";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { Button, Switch, TextInput, useTheme } from "react-native-paper";

/**
 * React Native component for configuring start date, end date, and reminder settings during system creation.
 *
 * Allows users to select a start date, optionally set an end date with a days offset, and enable or disable daily reminders. Handles user input, updates Redux state, and manages the creation of a system with associated routines and habits upon completion.
 *
 * @returns The rendered date and reminder settings UI for the system creation flow.
 */
export default function DateReminder() {
  const { createSystemMutation } = useSystemsMutations();
  const { createRoutineMutation } = useRoutinesMutation();
  const { createHabitMutation } = useHabitsMutation();

  const appDispatch = useAppDispatch();

  const today = new Date();
  const plus60Days = new Date(today);
  plus60Days.setDate(today.getDate() + 60);
  today.setHours(7, 0, 0, 0);

  const title = useAppSelector(selectCreateSystemTitle);
  const description = useAppSelector(selectCreateSystemDescription);
  const cadence = useAppSelector(selectCreateSystemCadence);
  const specificDays = useAppSelector(selectCreateSystemSpecificDays);

  const routines = useAppSelector(selectCreateSystemRoutines);

  const startDate = useAppSelector(selectCreateSystemStartDate);
  const endDate = useAppSelector(selectCreateSystemEndDate);

  const [reminderTime, setReminderTime] = useState<Date | null>(today);

  const [showTimePicker, setShowTimePicker] = useState<
    "start" | "end" | "reminder" | null
  >(null);
  const [daysOffset, setDaysOffset] = useState("60");

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [isReminderSwitchOn, setIsReminderSwitchOn] = React.useState(false);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    setDaysOffset("60");
  };

  const onToggleReminderSwitch = () => {
    setIsReminderSwitchOn(!isReminderSwitchOn);
  };

  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  const onChangeTime = (e: any, selectedDate?: Date) => {
    if (e.type === "dismissed") {
      setShowTimePicker(null);
      return;
    }

    if (selectedDate) {
      if (showTimePicker === "start") {
        appDispatch(setStartDate(selectedDate.toDateString()));
      }
      if (showTimePicker === "end") {
        //setReminders((prev) => [...prev, selectedDate]);
        handleDateChange(selectedDate);
      }

      if (showTimePicker === "reminder" && selectedDate instanceof Date) {
        setReminderTime(selectedDate);

        appDispatch(
          setReminder(
            selectedDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          )
        );
      }
      setShowTimePicker(null);
    }
  };

  const handleDateChange = (selectedDate?: Date) => {
    if (selectedDate) {
      appDispatch(setEndDate(selectedDate.toDateString()));
      const today = new Date();
      const diffTime = selectedDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      setDaysOffset(diffDays.toString());
    }
  };

  const handleDaysInputChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, "");
    setDaysOffset(sanitized);

    const days = parseInt(sanitized || "0", 10);
    const today = new Date();
    const newDate = new Date(today.setDate(today.getDate() + days));
    appDispatch(setEndDate(newDate.toDateString()));
  };

  const handleCreateSystem = async () => {
    try {
      // 1. Create the system
      const system = await createSystemMutation.mutateAsync({
        title,
        description,
        startDate,
        endDate,
        cadence,
        specificDays: JSON.stringify(specificDays),
        isActive: 1,
      });

      const systemId = system[0].id;

      if (routines) {
        // For each routine
        for (const routine of routines) {
          const { habits, ...routineData } = routine;

          // Create routine with the systemId
          const createdRoutine = await createRoutineMutation.mutateAsync({
            ...routineData,
            startTime: routineData.startTime ?? "",
            systemId,
          });

          const routineId = createdRoutine.lastInsertRowId;

          // 3. Create habits for this routine
          for (const habit of habits || []) {
            await createHabitMutation.mutateAsync({
              title: habit.title,
              routineId,
            });
          }
        }
      }

      console.log("System with routines and habits created successfully.");
      appDispatch(reset());
    } catch (err) {
      console.error("Error creating system:", err);
    }
  };

  useEffect(() => {
    if (isSwitchOn) {
      appDispatch(setEndDate(plus60Days.toDateString()));
    } else {
      appDispatch(setEndDate(null));
    }
  }, [isSwitchOn]);

  useEffect(() => {
    if (isReminderSwitchOn) {
      appDispatch(
        setReminder(
          today.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        )
      );
    } else {
      appDispatch(setReminder(null));
    }
  }, [isReminderSwitchOn]);

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingBottom: 0, flexGrow: 1 }}>
            <Header title="Date and reminder settings" enableArrowBack />

            <View className="py-6 flex flex-col">
              <View
                className="flex flex-row items-center justify-between border-b py-4"
                style={{
                  borderBlockColor: colors.surfaceVariant,
                  borderBottomWidth: 1,
                }}
              >
                <ThemedText
                  style={{
                    fontWeight: 600,
                    color: colors.onSurfaceVariant,
                    fontSize: 14,
                  }}
                >
                  Start Date
                </ThemedText>
                <Pressable
                  className="px-6 rounded-md py-2"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? darkAlhpa.primary
                        : lightAlhpa.primary,
                  }}
                  onPress={() => setShowTimePicker("start")}
                >
                  <ThemedText
                    style={{ fontSize: 13 }}
                    darkColor={colors.primary}
                    lightColor={colors.primary}
                  >
                    {new Date(startDate)?.toDateString() ===
                    new Date().toDateString()
                      ? "Today"
                      : new Date(startDate)?.toDateString()}
                  </ThemedText>
                </Pressable>
              </View>

              <View
                className="flex flex-col py-4"
                style={{
                  borderBlockColor: colors.surfaceVariant,
                  borderBottomWidth: 1,
                }}
              >
                <View className="flex flex-row items-center justify-between">
                  <ThemedText
                    style={{
                      fontWeight: 600,
                      color: colors.onSurfaceVariant,
                      fontSize: 14,
                    }}
                  >
                    End Date
                  </ThemedText>
                  <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                </View>

                {isSwitchOn && (
                  <View className="flex flex-row items-center justify-center gap-8 ">
                    <Pressable
                      className="px-6 rounded-md py-2"
                      style={{
                        backgroundColor:
                          colorScheme === "dark"
                            ? darkAlhpa.primary
                            : lightAlhpa.primary,
                      }}
                      onPress={() => setShowTimePicker("end")}
                    >
                      <ThemedText
                        style={{ fontSize: 13 }}
                        darkColor={colors.primary}
                        lightColor={colors.primary}
                      >
                        {endDate &&
                        new Date(endDate)?.toDateString() ===
                          new Date().toDateString()
                          ? "Today"
                          : endDate && new Date(endDate)?.toDateString()}
                      </ThemedText>
                    </Pressable>
                    <View className="flex flex-row items-center gap-4">
                      <TextInput
                        mode="outlined"
                        style={{ height: 24 }}
                        keyboardType="phone-pad"
                        value={daysOffset}
                        onChangeText={handleDaysInputChange}
                      />
                      <ThemedText>days</ThemedText>
                    </View>
                  </View>
                )}
              </View>

              <View
                className="flex flex-col py-4"
                style={{
                  borderBlockColor: colors.surfaceVariant,
                  borderBottomWidth: 1,
                }}
              >
                <View className="flex flex-row items-center justify-between">
                  <ThemedText
                    style={{
                      fontWeight: 600,
                      color: colors.onSurfaceVariant,
                      fontSize: 14,
                    }}
                  >
                    Reminder
                  </ThemedText>
                  <Switch
                    value={isReminderSwitchOn}
                    onValueChange={onToggleReminderSwitch}
                  />
                </View>

                {isReminderSwitchOn && (
                  <View className="flex flex-row items-center justify-center gap-8 ">
                    <Pressable
                      className="px-6 rounded-md py-2"
                      style={{
                        backgroundColor:
                          colorScheme === "dark"
                            ? darkAlhpa.primary
                            : lightAlhpa.primary,
                      }}
                      onPress={() => setShowTimePicker("reminder")}
                    >
                      <ThemedText
                        style={{ fontSize: 13 }}
                        darkColor={colors.primary}
                        lightColor={colors.primary}
                      >
                        {reminderTime?.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </ThemedText>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            {showTimePicker && (
              <RNDateTimePicker
                mode={showTimePicker === "reminder" ? "time" : "date"}
                value={new Date()}
                is24Hour={true}
                maximumDate={new Date(2030, 10, 20)}
                minimumDate={new Date(1950, 0, 1)}
                onChange={onChangeTime}
              />
            )}
          </View>

          <View className="w-[95%] mx-auto mb-20  items-center">
            <Button
              mode="contained"
              style={{ width: "100%" }}
              loading={createSystemMutation.isPending}
              onPress={
                // await requestPermissions();
                // await scheduleDailyLocalNotification(
                //   {
                //     title: "Daily Reminder",
                //     body: "A notification was sent to you",
                //     data: { type: "Routine" },
                //   },
                //   11,
                //   38
                // );
                handleCreateSystem
              }
            >
              Finish setup
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
}
