import { View, Text, StyleSheet } from "react-native";

const SessionTips = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.header}>Tip</Text>
            <Text style={styles.text}>Try to recall before flipping. Use "Skip" when unsure to revisit later.</Text>
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
  header: {
    fontSize: 20,
    fontWeight: '600',
  },
  text: {
    marginTop: 10,
    fontSize: 15,
    color: '#333333'
  }
});

export default SessionTips;
