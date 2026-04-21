import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

const Login = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!name || !password) {
            Alert.alert("Ошибка", "Заполните все поля");
            console.log("Ошибка", "Заполните все поля");
            return false;
        }

        if (password.length < 6) {
            Alert.alert("Ошибка", "Пароль должен быть минимум 6 символов");
            console.log("Ошибка", "Пароль должен быть минимум 6 символов");
            return false;
        }

    return true;
    };
    const handleRegister = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const response = await axios.post(
            "http://localhost:8080/api/auth/login",
            {
                username: name,
                password,
            });

            console.log("Успех:", response.data);
            Alert.alert("Успех", "Вы вошли в систему");
            router.replace('/');
        } catch (error: any) {
            console.log(error.response?.data || error.message);
            console.log("ПРОВАЛ", "Ошибка входа");

            Alert.alert("Ошибка", "Не удалось войти");
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вход</Text>
            <TextInput
                placeholder="Имя"
                value={name}
                onChangeText={setName}
                style={styles.input}/>
            <TextInput
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}/>
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                    ) : (
                    <Text style={styles.buttonText}>Войти</Text>
                )}
            </TouchableOpacity>
            <View style={styles.linkContainer}>
                <Text>Нет аккаунта? </Text>
                <Text
                    style={styles.link}
                    onPress={() => router.push('/register')}>Зарегистрируйтесь</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FF6B3D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  link: {
    color: "#403DFF",
  }
});

export default Login;