import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

const ProfileFriends = () => {
    const [searchQuery, setSearchQuery] = useState('');
    return(
        <View style={styles.friendsSection}>
            <Text style={styles.friendsSectionHeader}>Friends</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search friends by username..."
                placeholderTextColor="#8E8E8E"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Text style={styles.emptyText}>No friends yet</Text>
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
});

export default ProfileFriends;
