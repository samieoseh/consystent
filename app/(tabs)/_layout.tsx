import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { darkTheme, lightTheme } from "@/lib/themes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CommonActions } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import {
  BottomNavigation,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: darkTheme }
      : { ...MD3LightTheme, colors: lightTheme };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          theme={paperTheme.colors}
          navigationState={state}
          activeIndicatorStyle={{
            backgroundColor: paperTheme.colors.colors.primary,
          }}
          safeAreaInsets={insets}
          style={{
            backgroundColor: paperTheme.colors.colors.background,
            borderTopWidth: 0.5,
            borderTopColor: paperTheme.colors.colors.surfaceVariant,
          }}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) =>
            descriptors[route.key].options.tabBarIcon?.({
              focused,
              color: focused ? "#fff" : color,
              size: 24,
            }) || null
          }
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            return typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
                ? options.title
                : route.name;
          }}
        />
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="calendar-today"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="system"
        options={{
          title: "System",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="bullseye-arrow"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="google-analytics"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="routine"
        options={{
          title: "Routine",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="repeat" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="process"
        options={{
          title: "Process",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="progress-check"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
