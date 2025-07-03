import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import {
  addRoutine,
  removeRoutine,
  Routine,
  selectCreateSystemRoutines,
} from "@/features/createSystemSlice";
import { darkAlhpa, lightAlhpa } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Text } from "@react-navigation/elements";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  Keyboard,
  ListRenderItem,
  Pressable,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  RadioButton,
  TextInput,
  useTheme,
} from "react-native-paper";
import { z } from "zod";

const RoutineSchema = z.object({
  title: z.string().min(1, "Title is required"),
  cadence: z.enum(["daily", "weekdays", "specific"], {
    required_error: "Please choose how often you want to do this system",
  }),
  startTime: z.date().optional(),
  habits: z
    .array(
      z.object({
        title: z.string().min(1, "Habit title is required"),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof RoutineSchema>;

export default function NewRoutine() {
  const routines = useAppSelector(selectCreateSystemRoutines);
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  const appDispatch = useAppDispatch();
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
  const handleSheetClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderRoutineItem: ListRenderItem<Routine> = useCallback(
    ({ item }) => (
      <View
        style={{
          borderBottomWidth: 1,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomColor: colors.surface,
        }}
        className="flex flex-row justify-between items-center"
      >
        <View>
          <ThemedText
            style={{
              color: colors.onSurfaceVariant,
              fontWeight: "600",
            }}
          >
            {item.title}
          </ThemedText>
          <View className="flex flex-row items-center gap-2 mt-2">
            <View
              style={{
                backgroundColor: colors.outline,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 1,
                width: 50,
              }}
              className="flex items-center justify-center flex-row gap-1"
            >
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: 10,
                  paddingVertical: 2,
                }}
              >
                {item.habits?.length} habit
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.outline,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 1,
                width: 58,
              }}
              className="flex items-center justify-center flex-row gap-1"
            >
              <MaterialCommunityIcons
                name="alarm"
                size={12}
                color={colors.onSurfaceVariant}
              />
              <Text
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: 10,
                  paddingVertical: 2,
                }}
              >
                {item.startTime}
              </Text>
            </View>

            <View
              style={{
                backgroundColor:
                  colorScheme === "dark"
                    ? darkAlhpa.primary
                    : lightAlhpa.primary,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 1,
                width: 55,
              }}
              className="flex items-center justify-center flex-row gap-1"
            >
              <MaterialCommunityIcons
                name="repeat-variant"
                size={12}
                color={colors.primary}
              />
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 10,
                  paddingVertical: 2,
                }}
              >
                {item.cadence === "daily"
                  ? "Every day"
                  : item.cadence === "weekdays"
                    ? "Mon - Fri"
                    : "Custom"}
              </Text>
            </View>
          </View>
        </View>
        <IconButton
          icon="delete"
          size={20}
          iconColor={colors.error}
          onPress={() => {
            appDispatch(removeRoutine(item.title));
          }}
        />
      </View>
    ),
    [colors]
  );

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
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

            <FlatList
              data={routines}
              renderItem={renderRoutineItem}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              ListEmptyComponent={
                <ThemedText
                  style={{
                    textAlign: "center",
                    marginTop: 12,
                    color: colors.onSurfaceVariant,
                  }}
                >
                  No routines added yet.
                </ThemedText>
              }
              keyboardShouldPersistTaps="handled"
            />
          </View>
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
              <BottomSheetScrollView
                style={{
                  flex: 1,
                  padding: 20,
                }}
                contentContainerStyle={{ paddingBottom: 80 }}
                keyboardShouldPersistTaps="handled"
              >
                <CreateRoutine handleSheetClose={handleSheetClose} />
              </BottomSheetScrollView>
            </BottomSheetModal>
          </BottomSheetModalProvider>
          <View className="w-[95%] mx-auto mb-20 flex flex-row justify-between items-center">
            <Button
              mode="outlined"
              //className="py-1"
              onPress={() => {
                router.push("/systems/date-and-reminder");
              }}
            >
              Skip
            </Button>
            <Button
              mode="contained"
              //className="py-1"
              onPress={() => {
                router.push("/systems/date-and-reminder");
              }}
              disabled={routines?.length === 0}
            >
              Save & Continue
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
}

const CreateRoutine = ({
  handleSheetClose,
}: {
  handleSheetClose: () => void;
}) => {
  const [habitTitle, setHabitTitle] = useState("");

  const appDispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      cadence: "daily",
      startTime: new Date(),
      habits: [],
    },
    resolver: zodResolver(RoutineSchema),
  });

  const { isValid, isDirty } = formState;

  const [showTimePicker, setShowTimePicker] = useState(false);
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const colorScheme = useColorScheme();

  const showModal = () => {
    Keyboard.dismiss();
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  const handleHabitAdd = () => {
    if (habitTitle.trim()) {
      const currentHabits = getValues("habits") ?? [];
      const newHabits = [...currentHabits, { title: habitTitle.trim() }];
      setValue("habits", newHabits, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setHabitTitle("");
      setVisible(false);
    }
  };

  const onChangeTime = (e: any, selectedDate?: Date) => {
    if (e.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }

    if (selectedDate) {
      setValue("startTime", selectedDate);
      setShowTimePicker(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      startTime: data.startTime?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    appDispatch(addRoutine(payload));
    reset({
      title: "",
      cadence: "daily",
      startTime: new Date(),
      habits: [],
    });
    handleSheetClose();
  };

  const habits = watch("habits");

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <View className="flex flex-col gap-6">
        <View className="flex flex-col gap-2">
          <ThemedText
            style={{
              fontWeight: 600,
              color: colors.onSurfaceVariant,
              fontSize: 14,
            }}
          >
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
                  borderColor: isFocused ? colors.primary : colors.outline,
                  borderRadius: 4,
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                }}
                value={value}
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
              <ThemedText
                style={{
                  fontWeight: 600,
                  color: colors.onSurfaceVariant,
                  fontSize: 14,
                }}
              >
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
                  })}
                </ThemedText>
              </Pressable>

              {showTimePicker && (
                <RNDateTimePicker
                  mode={"time"}
                  value={value ?? new Date()}
                  is24Hour={true}
                  maximumDate={new Date(2030, 10, 20)}
                  minimumDate={new Date(1950, 0, 1)}
                  onChange={onChangeTime}
                />
              )}
            </View>
          )}
        />

        <View className="flex flex-col gap-2">
          <ThemedText
            style={{
              fontWeight: 600,
              color: colors.onSurfaceVariant,
              fontSize: 14,
            }}
          >
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
                    status={value === "daily" ? "checked" : "unchecked"}
                    onPress={() => onChange("daily")}
                  />
                  <ThemedText>Every day</ThemedText>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <RadioButton
                    value="weekdays"
                    status={value === "weekdays" ? "checked" : "unchecked"}
                    onPress={() => onChange("weekdays")}
                  />
                  <ThemedText>Weekdays only (Mon - Fri)</ThemedText>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <RadioButton
                    value="specific"
                    status={value === "specific" ? "checked" : "unchecked"}
                    onPress={() => onChange("specific")}
                  />
                  <ThemedText>Specific days</ThemedText>
                </View>
              </View>
            )}
          />
        </View>
        <View className="flex flex-col gap-2">
          <View className="flex flex-row items-center justify-between">
            <ThemedText
              style={{
                fontWeight: 600,
                color: colors.onSurfaceVariant,
                fontSize: 14,
              }}
            >
              Habits
            </ThemedText>
            <Button icon={"plus"} mode="outlined" onPress={showModal}>
              Add Habit
            </Button>
          </View>
          <ThemedText style={{ color: colors.onSurfaceVariant, fontSize: 11 }}>
            You can add habits to this routine. These are the actions you want
            to perform regularly as part of this routine.
          </ThemedText>
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

                  <TextInput
                    mode="outlined"
                    placeholder="e.g Drink water"
                    theme={{
                      colors: {
                        background: colors.surfaceVariant,
                        onSurfaceVariant: colors.outlineVariant,
                      },
                    }}
                    value={habitTitle}
                    onChangeText={setHabitTitle}
                    style={{
                      height: 40,
                    }}
                    autoFocus
                  />
                </View>
              </View>
              <Button mode="contained" onPress={handleHabitAdd}>
                Add Habit
              </Button>
            </View>
          </Modal>
        </Portal>
        <View
          style={{
            flexDirection: "column",
            paddingBottom: 20,
          }}
        >
          {habits?.map((item, index) => (
            <View
              key={index}
              className="flex flex-row items-center justify-between"
              style={{ padding: 0 }}
            >
              <ThemedText style={{ padding: 0 }}>{item.title}</ThemedText>
              <IconButton
                icon="delete"
                size={16}
                iconColor={colors.error}
                onPress={() => {
                  const updated = habits.filter((h) => h.title !== item.title);
                  setValue("habits", updated, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            </View>
          ))}
        </View>
      </View>

      <Button
        mode="contained"
        disabled={!isValid || !isDirty}
        onPress={handleSubmit(onSubmit)}
      >
        Create a new Routine
      </Button>
    </View>
  );
};
