// storage.native.js
import * as SecureStore from 'expo-secure-store'

export async function getStorageItem(key: string) {
  return SecureStore.getItemAsync(key)
}

export async function setStorageItem(key: string, value: string) {
  return SecureStore.setItemAsync(key, value)
}

export async function clearStorageItem(key: string) {
  return SecureStore.deleteItemAsync(key)
}
