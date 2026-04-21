import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export function StreakCard() {

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Streak</Text>

            {/* Большая цифра */}
            <View style={styles.numberBox}>
                <Text style={styles.number}>1</Text>
            </View>

            {/* Подписи */}
            <Text style={styles.subtitle}>Consecutive days</Text>
            <Text style={styles.description}>
            Keep it up! Review at least 10 cards today to maintain your streak.
            </Text>

            {/* Кнопки */}
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.secondaryBtn}>
                    <Text>🔥 Streak tips</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={{ color: "#fff" }}>Review now</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  numberBox: {
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#ff6b3d",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 10,
  },

  number: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ff6b3d",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 8,
  },

  description: {
    textAlign: "center",
    fontSize: 12,
    color: "#777",
    marginBottom: 16,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  secondaryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
    marginRight: 8,
    alignItems: "center",
  },

  primaryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ff6b3d",
    alignItems: "center",
  },
});