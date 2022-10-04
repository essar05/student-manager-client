import create from "zustand";
import { Class } from "../models/class";
import axios from "axios";
import produce from 'immer';

export interface ClassStore {
  classes: Class[];
  isLoading: boolean;
  isInitialized: boolean;
  fetch: () => void;
}

export const useClassStore = create<ClassStore>((set) => ({
  classes: [],
  isLoading: false,
  isInitialized: false,
  fetch: async () => {
    set(() => ({ isLoading: true }));

    try {
      const response = await axios.get("http://192.168.1.109:3000/classes");
      response.data;
      set(produce((state) => {
        state.classes = response.data;
        state.isInitialized = true;
        state.isLoading = false;
      }));
    } catch (e) {
      console.error("Error fetching classes", e);
      set(() => ({ isLoading: false }));
    }
  }
}));