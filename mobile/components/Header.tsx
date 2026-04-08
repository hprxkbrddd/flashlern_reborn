import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function Header() {
  return (
    <View style={styles.container}>

      {/* Левая часть */}
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Ionicons name="flash" size={18} color="#ff6b3d" />
        </View>
        <Text style={styles.points}>Flashlearn</Text>
      </View>

      {/* Правая часть */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.iconBox}>
            <Ionicons name="notifications-outline" size={18} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  right: {
    flexDirection: "row",
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
  avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#ff6b3d",
      justifyContent: "center",
      alignItems: "center",
  },

  avatarText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 14,
  },

  points: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});