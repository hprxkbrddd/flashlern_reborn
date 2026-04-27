import { useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";

const friendsData = [
  { id: "1", name: "Алексей" },
  { id: "2", name: "Мария" },
  { id: "3", name: "Иван" },
  { id: "4", name: "Анна" },
];



const ProfileFriends = () => {
    const [search, setSearch] = useState('');

    const filteredFriends = useMemo(() => {
    return friendsData.filter(friend =>
      friend.name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    return(
        <View style={styles.friendsSection}>
            <Text style={styles.friendsSectionHeader}>Friends</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends by username..."
                placeholderTextColor="#8E8E8E"
                value={search}
                onChangeText={setSearch}/>
            </View>
            {friendsData.length > 0 ? (
              <FlatList
              data={filteredFriends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Text style={styles.item}>{item.name}</Text>
              )}
              ListEmptyComponent={<Text>Ничего не найдено</Text>}/>) : (
                <Text style={styles.emptyText}>No friends yet</Text>
              )}
          </View>
          
    )
}

const styles = StyleSheet.create({
  friendsSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  friendsSectionHeader: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#000000',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 15,
    color: '#8E8E8E',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default ProfileFriends;
