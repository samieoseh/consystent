import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateSystemState {
  title: string;
  description?: string;
  cadence: "daily" | "weekdays" | "specific" | "manual";
  routines?: Routine[];
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
  routines: [],
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
      console.log({ state, action });
      const newRoutines = state?.routines?.filter(
        (routine) => routine.title !== action.payload
      );
      state.routines = newRoutines;
    },
  },
});

export const {
  setTitle,
  setDescription,
  setCadence,
  addRoutine,
  removeRoutine,
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

export default createSystemSlice.reducer;
