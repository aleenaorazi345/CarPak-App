import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /* GENERAL */
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginHorizontal: 15,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 15,
  },

  viewAll: {
    color: '#999',
    fontSize: 12,
  },

  /* 🟡 HEADER (IMPORTANT - you were missing this earlier) */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F4B400',
  },

  menuIcon: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  /* 🟡 BUDGET */
  budgetContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 10,
  },

  budgetPillInactive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#eee',
    marginRight: 10,
  },

  budgetPillActive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#F4B400',
  },

  /* 🚗 CARD */
  card: {
    width: 180,
    marginLeft: 15,
    marginTop: 15,
  },

  imageWrapper: {
    backgroundColor: '#eee',
    borderRadius: 15,
    height: 140,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'red',
    fontSize: 16,
  },

  carName: {
    fontWeight: 'bold',
    marginTop: 8,
  },

  carSub: {
    fontSize: 12,
    color: '#777',
  },
resultCount: {
  fontSize: 14,
  color: '#666',
  marginLeft: 15,  // ← This adds space to the left
  marginTop: 8,
  marginBottom: 12,
},
// Add these to your homeStyles.config.js

budgetScrollView: {
  flexGrow: 0,
},

budgetContainer: {
  flexDirection: 'row',
  marginHorizontal: 15,
  marginTop: 10,
  marginBottom: 10,
},

budgetPillActive: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 25,
  backgroundColor: '#F4B400',
  marginRight: 10,
  shadowColor: '#F4B400',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 3,
},

budgetPillInactive: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 25,
  backgroundColor: '#f0f0f0',
  marginRight: 10,
  borderWidth: 1,
  borderColor: '#e0e0e0',
},

activeText: {
  color: '#fff',
  fontWeight: '600',
},

inactiveText: {
  color: '#666',
  fontWeight: '500',
},



emptyContainer: {
  padding: 40,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f9f9f9',
  marginHorizontal: 15,
  marginVertical: 20,
  borderRadius: 12,
},

emptyText: {
  fontSize: 16,
  color: '#999',
  textAlign: 'center',
},
  price: {
    fontWeight: 'bold',
    marginTop: 4,
  },

  /* 🎁 DISCOUNT */
  discountBox: {
    margin: 15,
    padding: 25,
    backgroundColor: '#ccc',
    borderRadius: 20,
    alignItems: 'center',
  },

  discountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  /* 🚘 VERTICAL CARD (FOR YOU) */

verticalCard: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  marginHorizontal: 15,
  marginVertical: 8,
  borderRadius: 15,
  padding: 10,
  elevation: 2, // Android shadow
},

verticalImage: {
  width: 100,
  height: 80,
  borderRadius: 10,
},

verticalContent: {
  flex: 1,
  marginLeft: 10,
  justifyContent: 'center',
},

verticalHeart: {
  position: 'absolute',
  right: 15,
  top: 15,
  color: 'red',
},
});

export default styles;