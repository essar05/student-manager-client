import { API_URL } from '../constants'
import { createAPIClient } from '../store/api'
import { createStore } from '../store/store'

export const api = createAPIClient(API_URL || '')
export const useStore = createStore(api)
