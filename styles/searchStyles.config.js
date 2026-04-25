import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerTitle: { // ✅ FIXED (was title)
    fontSize: 18,
    fontWeight: '600',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 20,
  },

  searchInput: { // ✅ FIXED (was input)
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },

  carCard: { // ✅ FIXED (was card)
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    marginBottom: 10,
  },

  carTitle: { // ✅ FIXED (was carName)
    fontSize: 16,
    fontWeight: '500',
  },

  noDataText: { // ✅ FIXED (was noResult)
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default styles;