import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import DayChip from "@/components/ui/DayChip";
import Header from "@/components/ui/Header";
import { darkAlhpa, DAY_LABELS, lightAlhpa } from "@/lib/constants";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { Button, Switch, TextInput, useTheme } from "react-native-paper";

export default function NewSystem() {
  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}>
            <View>
              <Header title="Create a new system" enableArrowBack />
              <View>
                <SystemCard />
              </View>
            </View>
          </ScrollView>
          <View className="w-[95%] mx-auto mb-20">
            <Button
              mode="contained"
              className="py-1"
              onPress={() => {
                console.log("Create System Pressed");
              }}
            >
              Create System
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
}

const SystemCard = () => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [reminders, setReminders] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [showTimePicker, setShowTimePicker] = useState<
    "start" | "end" | "reminder" | null
  >(null);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const frequencyColor =
    colorScheme === "dark" ? darkAlhpa.primary : lightAlhpa.primary;

  const onChangeTime = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (showTimePicker === "start") {
        setStartDate(selectedDate);
      }
      if (showTimePicker === "reminder") {
        setReminders((prev) => [...prev, selectedDate]);
      }
    }
    setShowTimePicker(null);
  };

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <View className="py-4">
      <View className="flex flex-col gap-6 py-4 px-4 mb-4">
        <View className="flex flex-col gap-2">
          <ThemedText style={{ fontWeight: 600 }}>System Title *</ThemedText>
          <TextInput
            mode="outlined"
            placeholder="e.g Morning Runs"
            theme={{
              colors: {
                background: colors.surfaceVariant,
                onSurfaceVariant: colors.outlineVariant,
              },
            }}
            style={{
              height: 40,
            }}
            autoFocus
          />
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: colors.outline,
            width: "100%",
          }}
        />

        <View className="flex flex-row items-center justify-between">
          <ThemedText style={{ fontWeight: 600 }}>Starts</ThemedText>
          <Pressable
            className="px-4 rounded-md"
            style={{
              backgroundColor:
                colorScheme === "dark" ? darkAlhpa.primary : lightAlhpa.primary,
            }}
            onPress={() => setShowTimePicker("start")}
          >
            <ThemedText
              style={{
                fontSize: 13,
              }}
              darkColor={colors.primary}
              lightColor={colors.primary}
            >
              {startDate.toDateString()}
            </ThemedText>
          </Pressable>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: colors.outline,
            width: "100%",
          }}
        />
        <View className="flex flex-col gap-2 justify-between">
          <ThemedText style={{ fontWeight: 600 }}>Frequency</ThemedText>
          <View className="flex flex-row items-center gap-2 w-full">
            <Button
              mode="outlined"
              style={{ width: 100, borderWidth: frequency === "daily" ? 0 : 1 }}
              onPress={() => {
                setFrequency("daily");
              }}
              className="flex-1"
              buttonColor={
                frequency === "daily" ? frequencyColor : "transparent"
              }
              textColor={colors.primary}
            >
              Daily
            </Button>
            <Button
              mode="outlined"
              style={{
                width: 100,
                borderWidth: frequency === "weekly" ? 0 : 1,
              }}
              onPress={() => {
                setFrequency("weekly");
              }}
              className="flex-1"
              textColor={colors.primary}
              buttonColor={
                frequency === "weekly" ? frequencyColor : "transparent"
              }
            >
              Weekly
            </Button>
          </View>
          {frequency === "weekly" && (
            <View className="flex-row justify-between py-4 ">
              {DAY_LABELS.map((day, index) => (
                <View key={index} style={{ flex: 1, paddingHorizontal: 2 }}>
                  <DayChip
                    label={day}
                    selected={selectedDays.includes(index)}
                    onPress={() => toggleDay(index)}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: colors.outline,
            width: "100%",
          }}
        />

        <View className="flex flex-col gap-2">
          <View className="flex flex-row items-center justify-between">
            <ThemedText style={{ fontWeight: 600 }}>
              Reminders (Optional)
            </ThemedText>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
          </View>

          {isSwitchOn && (
            <>
              <ThemedText
                style={{ fontSize: 12, color: colors.onSurfaceVariant }}
              >
                Set reminders to help you stay on track with your system.
              </ThemedText>

              <Button
                mode="outlined"
                icon="plus"
                onPress={() => setShowTimePicker("reminder")}
                className="w-fit self-start"
              >
                Add Reminder
              </Button>

              {/* Display reminders */}
              <View className="flex-row flex-wrap gap-2 mt-2">
                {reminders.map((reminder, index) => (
                  <Pressable
                    key={index}
                    onLongPress={() =>
                      setReminders((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      <ThemedText style={{ fontSize: 12 }}>
                        {reminder.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </ThemedText>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>

        {showTimePicker && (
          <RNDateTimePicker
            mode={showTimePicker === "reminder" ? "time" : "date"}
            value={startDate}
            is24Hour={true}
            maximumDate={new Date(2030, 10, 20)}
            minimumDate={new Date(1950, 0, 1)}
            onChange={onChangeTime}
          />
        )}
      </View>
    </View>
  );
};
