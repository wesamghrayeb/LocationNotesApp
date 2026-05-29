import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note, NotesState } from './notesTypes';
import type { RootState } from '../../app/store';

const initialState: NotesState = {
  notes: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
  },
});

export const { addNote, deleteNote } = notesSlice.actions;
export const selectNotesForCurrentUser = (state: RootState): Note[] => {
  const currentUserId = state.auth.currentUserId;
  return state.notes.notes
    .filter(note => note.userId === currentUserId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};
export default notesSlice.reducer;
