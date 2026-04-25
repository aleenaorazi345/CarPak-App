import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  carImage: {
    width: '100%',
    height: 250,
  },

  infoContainer: {
    padding: 16,
  },

  carName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },

  price: {
    fontSize: 18,
    color: 'green',
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },

  contactButton: {
    backgroundColor: '#FFD700',
    margin: 16,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  contactText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
  },
  badge: {
  backgroundColor: '#FFD700',
  alignSelf: 'flex-start',
  margin: 10,
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 20,
},

badgeText: {
  fontWeight: 'bold',
  color: '#000',
},

category: {
  fontSize: 14,
  color: '#777',
  marginTop: 5,
},

specBox: {
  margin: 16,
  padding: 15,
  backgroundColor: '#f8f8f8',
  borderRadius: 10,
},

sectionTitle: {
  fontSize: 16,
  fontWeight: '700',
  marginBottom: 10,
},

specText: {
  fontSize: 14,
  marginBottom: 5,
  color: '#333',
},

descriptionBox: {
  margin: 16,
},

description: {
  fontSize: 14,
  color: '#555',
  lineHeight: 20,
},
});