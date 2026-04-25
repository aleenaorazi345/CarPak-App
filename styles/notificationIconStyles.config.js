import { StyleSheet } from 'react-native';

export const notificationIconStyles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 10,
  },
  bell: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#ff6b6b',
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});