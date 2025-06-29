import * as Notifications from "expo-notifications";
export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export type NotificationContent = {
  title: string;
  body: string;
  data: {
    type: string;
  };
};

export async function scheduleDailyLocalNotification(
  content: NotificationContent,
  hour: number,
  minute: number
) {
  await Notifications.scheduleNotificationAsync({
    content: content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hour,
      minute: minute,
    },
  });
}

export async function scheduleLocalNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}
