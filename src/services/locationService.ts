import { InteractionManager, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

type Coordinates = {
  latitude: number;
  longitude: number;
};

const locationPermission =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const waitForPermissionUiToSettle = (): Promise<void> =>
  new Promise(resolve => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(resolve, Platform.OS === 'android' ? 350 : 0);
    });
  });

const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const currentStatus = await check(locationPermission);
    if (currentStatus === RESULTS.GRANTED) {
      return true;
    }

    const status = await request(locationPermission);
    return status === RESULTS.GRANTED;
  } catch {
    return false;
  }
};

const readPosition = (
  options: Parameters<typeof Geolocation.getCurrentPosition>[2],
): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      error => reject(error),
      options,
    );
  });

export const getCurrentLocation = async (): Promise<Coordinates> => {
  const hasPermission = await requestLocationPermission();

  if (!hasPermission) {
    throw new Error(
      'Location permission was denied. Allow location access to save a note with coordinates.',
    );
  }

  await waitForPermissionUiToSettle();

  if (Platform.OS === 'ios') {
    const authStatus = await Geolocation.requestAuthorization('whenInUse');
    if (authStatus !== 'granted') {
      throw new Error(
        'Location permission was denied. Allow location access to save a note with coordinates.',
      );
    }
  }

  const options =
    Platform.OS === 'android'
      ? {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000,
          forceLocationManager: true,
          showLocationDialog: false,
        }
      : {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000,
        };

  try {
    return await readPosition(options);
  } catch (error) {
    throw toLocationError(error);
  }
};

const toLocationError = (error: unknown): Error => {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: number }).code;
    if (code === 1) {
      return new Error('Location permission was denied.');
    }
    if (code === 2) {
      return new Error('Location is unavailable. Turn on device location and try again.');
    }
    if (code === 3) {
      return new Error('Location request timed out. Try again in an open area.');
    }
    if (code === 4) {
      return new Error('Google Play Services is missing or outdated.');
    }
    if (code === 5) {
      return new Error('Turn on location services or use a higher accuracy mode.');
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Failed to fetch current location.');
};
