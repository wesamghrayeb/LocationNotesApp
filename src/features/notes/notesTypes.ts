export type NoteLocation = {
  latitude: number;
  longitude: number;
};

export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  location: NoteLocation;
};

export type NotesState = {
  notes: Note[];
};
