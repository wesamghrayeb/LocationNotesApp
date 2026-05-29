import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Note } from '../features/notes/notesTypes';
import { NotesListScreen } from '../screens/NotesListScreen';
import { NotesMapScreen } from '../screens/NotesMapScreen';
import { NoteDetailsScreen } from '../screens/NoteDetailsScreen';
import { colors } from '../theme/colors';

export type NotesStackParamList = {
  NotesList: undefined;
  NotesMap: undefined;
  NoteDetails: { note: Note };
};

const Stack = createNativeStackNavigator<NotesStackParamList>();

export const NotesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: styles.content,
      }}>
      <Stack.Screen
        name="NotesList"
        component={NotesListScreen}
        options={{ title: 'My Notes' }}
      />
      <Stack.Screen
        name="NotesMap"
        component={NotesMapScreen}
        options={{ title: 'Notes Map' }}
      />
      <Stack.Screen
        name="NoteDetails"
        component={NoteDetailsScreen}
        options={{ title: 'Note Details' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: Platform.OS === 'ios' ? 17 : 18,
    color: colors.text,
  },
  content: {
    backgroundColor: colors.background,
  },
});
