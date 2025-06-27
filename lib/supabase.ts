import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as aesjs from "aes-js";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1)
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey)
    );

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) {
      return encryptionKeyHex;
    }

    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1)
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) {
      return encrypted;
    }

    return await this._decrypt(key, encrypted);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value);

    await AsyncStorage.setItem(key, encrypted);
  }
}

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  {
    auth: {
      storage: new LargeSecureStore(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const supabaseInsert = async <T = any>(
  table: string,
  values: any
): Promise<T> => {
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from(table)
    .insert({
      ...values,
      user_id: user.data.user?.id,
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data as T;
};

export const supabaseUpsert = async <T = any>(
  table: string,
  values: any[]
): Promise<T> => {
  // Get the currently authenticated user
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id;

  // Prepare rows that already have an ID — these are considered for upsert (update or insert)
  const rowsWithId = values
    .filter((row) => !!row.id) // Only keep rows with an ID
    .map((row) => ({
      ...row,
      user_id,
    }));

  // Prepare rows without an ID — these are treated as new inserts
  const rowsWithoutId = values
    .filter((row) => !row.id) // Only keep rows without an ID
    .map((row) => ({
      ...row,
      user_id,
    }));

  let data: any[] = [];

  // Upsert existing rows
  if (rowsWithId.length) {
    const { data: upserted, error } = await supabase
      .from(table)
      .upsert(rowsWithId, { onConflict: "id" })
      .select();

    if (error) throw new Error(error.message);
    data = data.concat(upserted);
  }

  // Insert new rows — Supabase will generate IDs
  if (rowsWithoutId.length) {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(rowsWithoutId)
      .select();

    if (error) throw new Error(error.message);
    data = data.concat(inserted);
  }

  return data as T;
};

export const supabaseDelete = async <T = any>(
  table: string,
  values: any[]
): Promise<T> => {
  const user = await supabase.auth.getUser();

  // Extract IDs from the values to delete
  const ids = values.map((row) => row.id);

  const { data, error } = await supabase
    .from(table)
    .delete()
    .in("local_id", ids);
  if (error) {
    throw new Error(error.message ?? "Failed to delete data");
  }

  return data as T;
};

export default supabase;
