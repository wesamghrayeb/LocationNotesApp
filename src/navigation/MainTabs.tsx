import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { NotesStack } from './NotesStack';
import { NotesStackParamList } from './NotesStack';
import { CreateNoteScreen } from '../screens/CreateNoteScreen';
import { ListIcon, PlusIcon } from '../components/icons/AppIcons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export type MainTabsParamList = {
  NotesTab: NavigatorScreenParams<NotesStackParamList>;
  CreateNoteTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tab.Screen
        name="NotesTab"
        component={NotesStack}
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, focused }) => (
            <ListIcon size={focused ? 24 : 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CreateNoteTab"
        component={CreateNoteScreen}
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <PlusIcon size={focused ? 24 : 22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  tabBarItem: {
    minHeight: spacing.touchTarget,
  },
});
