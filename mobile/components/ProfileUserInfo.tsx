import api from "@/api/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileUserInfo = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string | null>();
    const [bio, setBio] = useState(null);

    useEffect(() => {
      const loadUsername = async () => {
      const name = await AsyncStorage.getItem('username');
      setUsername(name);
    };

      loadUsername();
    }, []);

    useEffect(() => {
      if (!username) return;

      const fetchProfile = async () => {
        try {
          const response = await api.get(`/profile/${username}`);
          setBio(response.data.aboutMe);
        } catch (error) {
          console.error(error);
        }
      };

      fetchProfile();
    }, [username]);

    return(
        <View style={styles.container}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{username?.charAt(0)}</Text>
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{username}</Text>
                {!bio ? (
                <Text style={styles.bio}>No description provided yet.</Text>) : (
                <Text style={styles.bio}>{bio}</Text>)}
            </View>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.6}>
                <Text 
                  style={styles.editButtonText}
                  onPress={() => router.push('/editProfile')}>Edit profile</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF6B3D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 28,
  },
  editButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#FF6B3D',
    marginTop: 10
  },
  editButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  userInfo: {
    flex: 1,
    marginTop: 10
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#8E8E8E',
  },
});

export default ProfileUserInfo;
