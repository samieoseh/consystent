import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { TextInput, useTheme } from "react-native-paper";

export default function NewGoal() {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showTimePicker, setShowTimePicker] = useState<"start" | "end" | null>(
    null
  );

  const onChangeTime = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (showTimePicker === "start") {
        setStartDate(selectedDate);
      } else if (showTimePicker === "end") {
        setEndDate(selectedDate);
      }
    }
    setShowTimePicker(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <Container>
          <Header title="New Goal" enableArrowBack />

          <View className="py-4">
            {/* Section 1: Basic Info */}
            <View
              style={{
                backgroundColor: colors.surfaceVariant,
                borderRadius: 12,
              }}
              className="flex flex-col gap-3 py-4 px-4 mb-4"
            >
              <TextInput
                mode="outlined"
                label="Goal Title"
                placeholder="Goal Title e.g Run 40km in 3 months"
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
              <TextInput
                mode="outlined"
                label="Description"
                placeholder="Enter more details about the goal"
                multiline
                numberOfLines={4}
                style={{ minHeight: 100 }}
                theme={{
                  colors: {
                    background: colors.surfaceVariant,
                    onSurfaceVariant: colors.outlineVariant,
                  },
                }}
              />
            </View>

            {/* Section 2: Time & Settings */}
            <View
              style={{
                backgroundColor: colors.surfaceVariant,
                borderRadius: 12,
              }}
              className="flex flex-col gap-3 py-4 px-4 mb-4"
            >
              <View className="flex flex-row items-center justify-between">
                <ThemedText>Starts</ThemedText>
                <Pressable
                  className="px-4 rounded-md"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? "rgba(255, 140, 95, 0.16)" // softer but visible in dark
                        : "rgba(220, 75, 0, 0.12)",
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

              {/* Horizontal Line */}
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.outline,
                  width: "100%",
                }}
              />

              <View className="flex flex-row items-center justify-between">
                <ThemedText>Ends</ThemedText>
                <Pressable
                  className="px-4 rounded-md"
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? "rgba(255, 140, 95, 0.16)" // softer but visible in dark
                        : "rgba(220, 75, 0, 0.12)",
                  }}
                  onPress={() => setShowTimePicker("end")}
                >
                  <ThemedText
                    style={{
                      fontSize: 13,
                    }}
                    darkColor={colors.primary}
                    lightColor={colors.primary}
                  >
                    {endDate.toDateString()}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
            {showTimePicker && (
              <RNDateTimePicker
                mode="date"
                value={startDate}
                is24Hour={true}
                maximumDate={new Date(2030, 10, 20)}
                minimumDate={new Date(1950, 0, 1)}
                onChange={onChangeTime}
              />
            )}
          </View>
        </Container>
      </View>
    </TouchableWithoutFeedback>
  );
}
