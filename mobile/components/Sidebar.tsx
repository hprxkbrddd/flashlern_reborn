import {View, TouchableOpacity, StyleSheet} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

type Props = {
  onPress: () => void;
};

export function Sidebar() {
  const router = useRouter();
  
  return (
      <View style={styles.container}>
          <View style={styles.up}>
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => router.push('/')}>
                <Ionicons name="home-outline" size={18} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => router.push('/profile')}>
                <Ionicons name="person-outline" size={18} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => router.push('/')}>
                <Ionicons name="settings-outline" size={18} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.down}>
            <TouchableOpacity
              style={styles.iconBox}
              onPress={() => router.push('/register')}>
                <Ionicons name="log-out-outline" size={18} color="#333" />
            </TouchableOpacity>
          </View>
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: 60,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "white",
    borderBottomRightRadius: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  up: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },

  down: {
    flexDirection: "column",
    gap: 8,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },

  points: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});