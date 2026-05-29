import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { addNote } from '../features/notes/notesSlice';
import { MainTabsParamList } from '../navigation/MainTabs';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { LocationPinIcon } from '../components/icons/AppIcons';
import { getCurrentLocation } from '../services/locationService';
import { validateRequiredTitle } from '../utils/validators';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = BottomTabScreenProps<MainTabsParamList, 'CreateNoteTab'>;

export const CreateNoteScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(state => state.auth.currentUserId);
  const { maxContentWidth, horizontalPadding, isTablet } = useResponsiveLayout();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    const titleError = validateRequiredTitle(title);
    if (titleError) {
      setError(titleError);
      return;
    }
    if (!currentUserId) {
      setError('Please log in again before creating notes.');
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      const location = await getCurrentLocation();
      dispatch(
        addNote({
          id: `${Date.now()}-${Math.random()}`,
          userId: currentUserId,
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          location,
        }),
      );
      setTitle('');
      setContent('');
      navigation.navigate('NotesTab', { screen: 'NotesList' });
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save note. Please try again.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            maxWidth: maxContentWidth,
            alignSelf: 'center',
            width: '100%',
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Note</Text>

        <View style={styles.formCard}>
          <AppInput
            label="Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="Note title"
          />
          <AppInput
            label="Content"
            value={content}
            onChangeText={setContent}
            placeholder="Optional details"
            multiline
          />

          <View style={styles.locationHint}>
            <LocationPinIcon size={18} color={colors.primary} />
            <Text style={styles.locationHintText}>Location saved with note</Text>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <AppButton
            title={isSaving ? 'Saving...' : 'Save Note'}
            loading={isSaving}
            disabled={isSaving}
            onPress={onSave}
            accessibilityLabel="Save note button"
          />
        </View>

        {isTablet && <View style={styles.tabletSpacer} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  locationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  locationHintText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md,
  },
  tabletSpacer: {
    height: spacing.xxl,
  },
});
