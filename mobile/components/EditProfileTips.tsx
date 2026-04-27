import { View, Text, StyleSheet } from "react-native";

const EditProfileTips = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.header}>Советы по профилю</Text>
            <Text style={styles.text}>Сделайте имя узнаваемым для друзей.</Text>
            <Text style={styles.text}>Добавьте пару предложений о своих целях и интересах.</Text>
            <Text style={styles.text}>Обновляйте информацию, когда меняются планы.</Text>
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
    marginLeft: 20,
    fontSize: 15,
    color: '#333333'
  }
});

export default EditProfileTips;
