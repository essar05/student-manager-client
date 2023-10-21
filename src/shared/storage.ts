import AsyncStorage from '@react-native-async-storage/async-storage'

export async function getStorageItem(key: string) {
  return AsyncStorage.getItem(key)
}

export async function setStorageItem(key: string, value: string) {
  return AsyncStorage.setItem(key, value)
}

export async function clearStorageItem(key: string) {
  return AsyncStorage.removeItem(key)
}
