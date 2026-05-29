import React, { useCallback, useLayoutEffect } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { logoutUser } from '../features/auth/authSlice';
import { deleteNote, selectNotesForCurrentUser } from '../features/notes/notesSlice';
import { NoteCard } from '../components/NoteCard';
import { EmptyState } from '../components/EmptyState';
import { IconButton } from '../components/IconButton';
import { LogOutIcon, MapIcon } from '../components/icons/AppIcons';
import { NotesStackParamList } from '../navigation/NotesStack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<NotesStackParamList, 'NotesList'>;

export const NotesListScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const userNotes = useAppSelector(selectNotesForCurrentUser);
  const { columns, maxContentWidth, horizontalPadding, cardGap } =
    useResponsiveLayout();

  const handleLogout = useCallback(() => {
    Alert.alert('Log out?', 'You will return to the login screen.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  }, [dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <IconButton
            onPress={() => navigation.navigate('NotesMap')}
            variant="ghost"
            size={40}
            accessibilityLabel="Show all notes on map"
            icon={<MapIcon size={20} color={colors.primary} />}
          />
          <IconButton
            onPress={handleLogout}
            variant="ghost"
            size={40}
            accessibilityLabel="Log out"
            icon={<LogOutIcon size={20} color={colors.primary} />}
          />
        </View>
      ),
    });
  }, [navigation, handleLogout]);

  const confirmDelete = (noteId: string) => {
    Alert.alert('Delete note?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteNote(noteId)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.contentShell,
          {
            maxWidth: maxContentWidth,
            paddingHorizontal: horizontalPadding,
          },
        ]}>
        <FlatList
          key={`notes-grid-${columns}`}
          data={userNotes}
          numColumns={columns}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={columns > 1 ? styles.columnRow : undefined}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => navigation.navigate('NoteDetails', { note: item })}
              onDelete={() => confirmDelete(item.id)}
              style={
                columns > 1
                  ? [styles.gridItem, { marginHorizontal: cardGap / 2 }]
                  : undefined
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState title="No notes yet" />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  contentShell: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  columnRow: {
    marginBottom: spacing.md,
  },
  gridItem: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Platform.OS === 'ios' ? spacing.xs : spacing.sm,
    gap: spacing.xs,
  },
});
