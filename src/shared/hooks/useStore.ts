import { createStore } from "../store/store"
import { API_URL } from '../constants'

export const useStore = createStore(API_URL || '')
