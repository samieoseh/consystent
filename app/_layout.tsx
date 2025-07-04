import { useColorScheme } from "@/hooks/useColorScheme";
import { db } from "@/lib/db";
import { darkTheme, lightTheme } from "@/lib/themes";
import { store } from "@/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import migrations from "../drizzle/migrations";
import "../global.css";

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  const themeColors = colorScheme === "dark" ? darkTheme : lightTheme;

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: themeColors }
      : { ...MD3LightTheme, colors: themeColors };

  SystemUI.setBackgroundColorAsync(paperTheme.colors.colors.background);

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <PaperProvider theme={paperTheme.colors}>
              <StatusBar style={"auto"} translucent />

              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="systems" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </PaperProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
