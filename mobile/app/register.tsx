import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "@/api/api";

const Register = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!name || !email || !password) {
            Alert.alert("Ошибка", "Заполните все поля");
            console.log("Ошибка", "Заполните все поля");
            return false;
        }

        if (!email.includes("@")) {
            Alert.alert("Ошибка", "Некорректный email");
            console.log("Ошибка", "Некорректный email");
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

            const response = await api.post(
            '/auth/register',
            {
                username: name,
                password,
                email,
            });
            router.replace('/login');
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>
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
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}/>
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                    ) : (
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                )}
            </TouchableOpacity>
            <View style={styles.linkContainer}>
                <Text>Есть аккаунт? </Text>
                <Text
                    style={styles.link}
                    onPress={() => router.push('/login')}>Войдите</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
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
    color: "#FFFFFF",
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

export default Register;