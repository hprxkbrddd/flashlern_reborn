import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export function GoalCard() {

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Today's goal</Text>

            <Text style={styles.progressText}>3/10 cards</Text>

            {/* Progress bar */}
            <View style={styles.progressBar}>
                <View style={styles.progressFill} />
            </View>

            <Text style={styles.description}>
                    Keep it up! You're making great progress.
            </Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Review now</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ff6b3d",
    padding: 16,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },

  title: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },

  progressText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    marginBottom: 12,
  },

  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  description: {
    color: "#e0e0ff",
    fontSize: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "600",
  },
});
