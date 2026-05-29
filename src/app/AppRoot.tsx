import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from './hooks';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { AuthNavigator } from '../navigation/AuthNavigator';
import { MainTabs } from '../navigation/MainTabs';

export const AppRoot = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <NavigationContainer
      key={isAuthenticated ? 'authenticated' : 'unauthenticated'}>
      {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
