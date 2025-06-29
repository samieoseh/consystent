import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import { darkAlhpa, lightAlhpa } from "@/lib/constants";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import {
  Button,
  Modal,
  Portal,
  RadioButton,
  TextInput,
  useTheme,
} from "react-native-paper";
import { z } from "zod";

const RoutineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cadence: z.enum(["daily", "weekdays", "specific", "flexible"], {
    required_error: "Please choose how often you want to do this system",
  }),
  startTime: z.date().optional(),
  repeatOn: z.array(z.string()).optional(),
  habits: z
    .array(
      z.object({
        title: z.string().min(1, "Habit title is required"),
        duration: z.number().min(1, "Duration must be at least 1 minute"),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof RoutineSchema>;

export default function NewRoutine() {
  const colorScheme = useColorScheme();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    Keyboard.dismiss();
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    console.log("Presenting Bottom Sheet Modal");
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const { control, watch, handleSubmit, setValue, formState, getValues } =
    useForm<FormValues>({
      defaultValues: {
        title: "",
        description: "",
        cadence: "daily",
        startTime: new Date(),
        repeatOn: [],
        habits: [],
      },
      resolver: zodResolver(RoutineSchema),
    });

  const toggleDay = (index: number) => {
    setSelectedDays((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const { isValid, isDirty } = formState;

  console.log("Form Values", getValues());

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}>
            <View>
              <Header title="Create routine" enableArrowBack />
              <Button
                icon={"plus"}
                mode="outlined"
                onPress={handlePresentModalPress}
                style={{
                  margin: 20,
                }}
              >
                Add a routine
              </Button>
            </View>
          </ScrollView>
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              onChange={handleSheetChanges}
              snapPoints={[60, "30%", "100%"]}
              index={1}
              containerStyle={{
                zIndex: 1000,
              }}
              backgroundStyle={{
                backgroundColor: colors.surface,
              }}
              handleIndicatorStyle={{
                backgroundColor: colors.onSurfaceVariant,
              }}
              keyboardBehavior="interactive"
              keyboardBlurBehavior="restore"
            >
              <BottomSheetView
                style={{
                  flex: 1,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                }}
              >
                <View className="flex flex-col gap-6">
                  <View className="flex flex-col gap-2">
                    <ThemedText style={{ fontWeight: 600 }}>
                      Routine Title *
                    </ThemedText>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field: { onChange, value } }) => (
                        <BottomSheetTextInput
                          placeholder="e.g. Morning routine"
                          onChangeText={onChange}
                          selectionColor={colors.primary}
                          placeholderTextColor={colors.outlineVariant}
                          autoFocus
                          style={{
                            height: 48,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            fontSize: 16,
                            borderWidth: isFocused ? 2 : 1,
                            borderColor: isFocused
                              ? colors.primary
                              : colors.outline,
                            borderRadius: 4,
                            backgroundColor: colors.surfaceVariant,
                            color: colors.onSurface,
                          }}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                      )}
                    />
                  </View>

                  <Controller
                    control={control}
                    name="startTime"
                    render={({ field: { value } }) => (
                      <View className="flex flex-row items-center justify-between">
                        <ThemedText style={{ fontWeight: 600 }}>
                          Start Time
                        </ThemedText>
                        <Pressable
                          className="px-4 rounded-md"
                          style={{
                            backgroundColor:
                              colorScheme === "dark"
                                ? darkAlhpa.primary
                                : lightAlhpa.primary,
                          }}
                          onPress={() => setShowTimePicker(true)}
                        >
                          <ThemedText
                            style={{
                              fontSize: 13,
                            }}
                            darkColor={colors.primary}
                            lightColor={colors.primary}
                          >
                            {value?.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </ThemedText>
                        </Pressable>
                      </View>
                    )}
                  />

                  <View className="flex flex-col gap-2">
                    <ThemedText style={{ fontWeight: 600 }}>
                      Frequency
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
                        </View>
                      )}
                    />
                  </View>
                  <View className="flex flex-row items-center justify-between">
                    <ThemedText style={{ fontWeight: 600 }}>Habits</ThemedText>
                    <Button icon={"plus"} mode="outlined" onPress={showModal}>
                      Add Habit
                    </Button>
                  </View>
                  <Portal>
                    <Modal
                      visible={visible}
                      onDismiss={hideModal}
                      contentContainerStyle={{
                        backgroundColor: colors.surface,
                        padding: 20,
                        borderRadius: 8,
                        marginHorizontal: 20,
                      }}
                    >
                      <View className="flex flex-col gap-4">
                        <View>
                          <View className="flex flex-col gap-2">
                            <ThemedText style={{ fontWeight: 600 }}>
                              Habit Title *
                            </ThemedText>
                            <Controller
                              control={control}
                              name="title"
                              render={({ field: { onChange, value } }) => (
                                <TextInput
                                  mode="outlined"
                                  placeholder="e.g Drink water"
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
                        </View>
                        <Button mode="contained">Add Habit</Button>
                      </View>
                    </Modal>
                  </Portal>
                </View>

                <Button mode="contained">Create Routine</Button>
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetModalProvider>
          <View className="w-[95%] mx-auto mb-20 flex flex-row justify-between items-center">
            <Button
              mode="outlined"
              //className="py-1"
              onPress={() => {
                console.log("Create System Pressed!");
              }}
            >
              Skip
            </Button>
            <Button
              mode="contained"
              //className="py-1"
              onPress={() => {
                //router.push("/systems/new-routine");
              }}
            >
              Save & Continue
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
}
