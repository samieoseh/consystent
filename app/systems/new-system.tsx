import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import React from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";

export default function NewSystem() {
  const { colors } = useTheme();
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
              style={{ height: 48 }}
              className="flex items-center justify-center"
              onPress={() => {}}
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
  const [frequency, setFrequency] = React.useState<"daily" | "weekly">("daily");
  const [startTime, setStartTime] = React.useState(new Date());
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const frequencyColor =
    colorScheme === "dark"
      ? "rgba(100, 170, 255, 0.16)"
      : "rgba(30, 110, 255, 0.12)";
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
          <ThemedText style={{ fontWeight: 600 }}>Start Time</ThemedText>

          <Pressable
            className="px-4 rounded-md"
            style={{
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(100, 170, 255, 0.16)" // softer but visible in dark
                  : "rgba(30, 110, 255, 0.12)",
            }}
            onPress={() => setShowTimePicker(true)}
          >
            <ThemedText
              style={{
                fontSize: 13,
              }}
              darkColor={colors.secondary}
              lightColor={colors.secondary}
            >
              {startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
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
              style={{ width: 100, borderWidth: 0 }}
              onPress={() => {}}
              className="flex-1"
              buttonColor={
                frequency === "daily" ? frequencyColor : "transparent"
              }
              textColor={colors.secondary}
            >
              Daily
            </Button>
            <Button
              mode="outlined"
              style={{ width: 100 }}
              onPress={() => {}}
              className="flex-1"
              textColor={colors.secondary}
            >
              Weekly
            </Button>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: colors.outline,
            width: "100%",
          }}
        />

        <View className="flex flex-row items-center justify-between">
          <ThemedText style={{ fontWeight: 600 }}>
            Reminders (Optional)
          </ThemedText>
          <View>
            <Button icon={"plus"}>Add Reminder</Button>
          </View>
        </View>
      </View>
    </View>
  );
};
