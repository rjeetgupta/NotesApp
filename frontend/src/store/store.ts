import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "@/store/noteSlice";

export const store = configureStore({
  reducer: {
    notes: noteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;