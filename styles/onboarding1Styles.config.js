import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'flex-end',
  },

  stepText: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    marginBottom: 40,
  },

  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#F4B400',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});