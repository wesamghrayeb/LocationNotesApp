import React, { useCallback, useLayoutEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '../app/hooks';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { selectNotesForCurrentUser } from '../features/notes/notesSlice';
import { NotesMapView } from '../components/NotesMapView';
import { EmptyState } from '../components/EmptyState';
import { IconButton } from '../components/IconButton';
import { ListIcon } from '../components/icons/AppIcons';
import { NotesStackParamList } from '../navigation/NotesStack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<NotesStackParamList, 'NotesMap'>;

export const NotesMapScreen = ({ navigation }: Props) => {
  const userNotes = useAppSelector(selectNotesForCurrentUser);
  const { horizontalPadding } = useResponsiveLayout();

  const openList = useCallback(() => {
    navigation.navigate('NotesList');
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          onPress={openList}
          variant="ghost"
          size={40}
          accessibilityLabel="Show notes list"
          icon={<ListIcon size={20} color={colors.primary} />}
          style={styles.headerButton}
        />
      ),
    });
  }, [navigation, openList]);

  return (
    <View style={styles.container}>
      {userNotes.length === 0 ? (
        <View style={[styles.emptyWrap, { paddingHorizontal: horizontalPadding }]}>
          <EmptyState
            title="No notes"
            subtitle="Create a note first."
          />
        </View>
      ) : (
        <NotesMapView
          notes={userNotes}
          onNoteSelect={note => navigation.navigate('NoteDetails', { note })}
          style={[styles.map, { marginHorizontal: horizontalPadding }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
    marginBottom: spacing.md,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  headerButton: {
    marginRight: Platform.OS === 'ios' ? spacing.xs : spacing.sm,
  },
});
