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
// Add these to your carDetails.config.js

// Three Dots Menu Styles
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  paddingTop: 60,
  paddingRight: 20,
},

modalMenu: {
  backgroundColor: '#fff',
  borderRadius: 12,
  width: 200,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  overflow: 'hidden',
},

menuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 16,
  backgroundColor: '#fff',
},

deleteMenuItem: {
  backgroundColor: '#fff',
},

menuItemText: {
  fontSize: 16,
  marginLeft: 12,
  color: '#333',
},

deleteText: {
  color: '#FF3B30',
},

menuDivider: {
  height: 1,
  backgroundColor: '#e0e0e0',
},

// Edit Modal Styles
editModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

editModalContainer: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  width: '85%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

editModalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center',
  color: '#333',
},

editInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  marginBottom: 20,
  backgroundColor: '#f9f9f9',
},

editModalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

cancelButton: {
  flex: 1,
  paddingVertical: 12,
  marginRight: 10,
  borderRadius: 8,
  backgroundColor: '#f0f0f0',
  alignItems: 'center',
},

cancelButtonText: {
  fontSize: 16,
  color: '#666',
  fontWeight: '600',
},

saveButton: {
  flex: 1,
  paddingVertical: 12,
  marginLeft: 10,
  borderRadius: 8,
  backgroundColor: '#F4B400',
  alignItems: 'center',
},

saveButtonText: {
  fontSize: 16,
  color: '#fff',
  fontWeight: '600',
},

editIcon: {
  marginRight: 12,
  color: '#F4B400',
},
});