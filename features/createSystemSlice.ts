import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateSystemState {
  title: string;
  description?: string;
  cadence: "daily" | "weekdays" | "specific" | "manual";
  specificDays: string[];
  routines?: Routine[];
  startDate: string;
  endDate: string | null;
  reminder: string | null;
}

export type Routine = {
  title: string;
  cadence: "daily" | "weekdays" | "specific";
  startTime?: string;
  habits?: Habit[];
};

export type Habit = {
  title: string;
};

const initialState: CreateSystemState = {
  title: "",
  description: undefined,
  cadence: "daily",
  specificDays: [],
  routines: [],
  reminder: null,
  endDate: null,
  startDate: new Date().toDateString(),
};

const createSystemSlice = createSlice({
  name: "systemCreate",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string | undefined>) => {
      state.description = action.payload;
    },
    setCadence: (
      state,
      action: PayloadAction<CreateSystemState["cadence"]>
    ) => {
      state.cadence = action.payload;
    },

    setSpecificDays: (
      state,
      action: PayloadAction<CreateSystemState["specificDays"]>
    ) => {
      state.specificDays = action.payload;
    },
    setRoutines: (
      state,
      action: PayloadAction<CreateSystemState["routines"]>
    ) => {
      state.routines = action.payload;
    },

    addRoutine: (state, action: PayloadAction<Routine>) => {
      if (!state.routines) {
        state.routines = [];
      }
      state.routines.push(action.payload);
    },

    removeRoutine: (state, action: PayloadAction<string>) => {
      const newRoutines = state?.routines?.filter(
        (routine) => routine.title !== action.payload
      );
      state.routines = newRoutines;
    },

    setStartDate: (
      state,
      action: PayloadAction<CreateSystemState["startDate"]>
    ) => {
      state.startDate = action.payload;
    },

    setEndDate: (
      state,
      action: PayloadAction<CreateSystemState["endDate"]>
    ) => {
      state.endDate = action.payload;
    },

    setReminder: (
      state,
      action: PayloadAction<CreateSystemState["reminder"]>
    ) => {
      state.reminder = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setTitle,
  setDescription,
  setCadence,
  setSpecificDays,
  addRoutine,
  removeRoutine,
  setEndDate,
  setStartDate,
  setRoutines,
  setReminder,
  reset,
} = createSystemSlice.actions;

export const selectCreateSystemTitle = (state: {
  systemCreate: CreateSystemState;
}) => state.systemCreate.title;

export const selectCreateSystemDescription = (state: {
  systemCreate: CreateSystemState;
}) => state.systemCreate.description;

export const selectCreateSystemCadence = (state: {
  systemCreate: CreateSystemState;
}) => state.systemCreate.cadence;

export const selectCreateSystemRoutines = (state: {
  systemCreate: CreateSystemState;
}) => state.systemCreate.routines;

export const selectCreateSystemStartDate = (state: {
  systemCreate: CreateSystemState;
}) => state.systemCreate.startDate;

export const selectCreateSystemEndDate = (state: {
  systemCreate: CreateSystemState;
}) => state.systemCreate.endDate;

export const selectCreateSystemReminder = (state: {
  systemCreate: CreateSystemState;
}) => state.systemCreate.reminder;

export const selectCreateSystemSpecificDays = (state: {
  systemCreate: CreateSystemState;
}) => state.systemCreate.specificDays;
export default createSystemSlice.reducer;
