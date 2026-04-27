import api from "@/api/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileMain = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<number | null>();
    const [username, setUsername] = useState<string | null>();
    const [usernameInputText, setUsernameInputText] = useState<string | null>('');
    const [bioInputText, setBioInputText] = useState('');

    useEffect(() => {
      const loadUserData = async () => {
        const name = await AsyncStorage.getItem('username');
        const id = await AsyncStorage.getItem('userId');
        setUsername(name);
        setUsernameInputText(name);
        setUserId(Number(id));
      };

      loadUserData();
    }, []);

    useEffect(() => {
      if (!username) return;

      const fetchProfile = async () => {
        try {
          const response = await api.get(`/profile/${username}`);
          setBioInputText(response.data.aboutMe);
        } catch (error) {
          console.error(error);
        }
      };

      fetchProfile();
    }, [username]);

    const handleSave = async () => {
    try {

      const response = await api.put(
        `/profile/update/${userId}`,
        {
          "username": usernameInputText,
          "aboutMe": bioInputText
        });

        await AsyncStorage.setItem('username', usernameInputText!);
        router.push('/profile');
      } catch (error: any) {
    }};

    return(
        <View style={styles.container}>
          <View style={styles.info}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{username?.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.labelText}>Рекдактирование профиля</Text>
              <Text style={styles.usernameText}>{username}</Text>
            </View>
          </View>
          <Text style={styles.headerText}>Имя</Text>
          <TextInput
            style={styles.usernameInput}
            placeholder="Введите новое имя"
            placeholderTextColor="#8E8E8E"
            value={usernameInputText!}
            onChangeText={setUsernameInputText}/>
          <Text style={styles.headerText}>О себе</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Коротко о себе, интересы, цели"
            placeholderTextColor="#8E8E8E"
            value={bioInputText}
            onChangeText={setBioInputText}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"/>
          <Text style={styles.labelText}>Расскажите о себе - это увидят ваши друзья.</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.6}>
              <Text 
                style={styles.saveButtonText}
                onPress={handleSave}>
                Сохранить изменения
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discardButton} activeOpacity={0.6}>
              <Text 
                  style={styles.discardButtonText}
                  onPress={() => router.push('/profile')}>
                  Отмена
              </Text>
            </TouchableOpacity>
          </View>
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
  info: {
    flexDirection: 'row',
    gap: 15
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
  labelText: {
    fontSize: 14,
    color: '#8E8E8E',
  },
  headerText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '700',
  },
  usernameInput: {
    marginTop: 5,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  bioInput: {
    marginTop: 5,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#FF6B3D',
    marginTop: 10
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  discardButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 10,
  },
  discardButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditProfileMain;
