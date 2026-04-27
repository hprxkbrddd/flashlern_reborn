import { View, StyleSheet } from "react-native"

type Props = {
    progress: number;
}

const ProgressBar = ({progress}: Props) => {
    return (
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]}/>
      </View>
    )
}

const styles = StyleSheet.create({
progressBar: {
    height: 6,
    width: 150,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginTop: 6,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#FF6B3D',
    borderRadius: 10,
  },
})

export default ProgressBar;
