import { View, Text, StyleSheet } from "react-native";
import ProgressBar from "./Progressbar";

type Props = {
  remembered: number;
  forgot: number;
  skipped: number;
  total: number;
  currentIndex: number;
};

const SessionProgress = ({
  remembered,
  forgot,
  skipped,
  total,
  currentIndex,
}: Props) => {
    const progress = currentIndex / total;
    return(
        <View style={styles.container}>
            <View style={styles.progressInfo}>
                <Text style={styles.header}>Progress</Text>
                <Text>{currentIndex} / {total}</Text>
            </View>
            <ProgressBar progress={progress}/>
            <View style={styles.stats}>
                <View style={styles.statsRow}>
                    <View style={styles.statsBlock}>
                        <Text style={styles.statsBlockText}>Correct</Text>
                        <Text style={styles.statsBlockCountText}>{remembered}</Text>
                    </View>
                    <View style={styles.statsBlock}>
                        <Text style={styles.statsBlockText}>Forgot</Text>
                        <Text style={styles.statsBlockCountText}>{forgot}</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statsBlock}>
                        <Text style={styles.statsBlockText}>Skipped</Text>
                        <Text style={styles.statsBlockCountText}>{skipped}</Text>
                    </View>
                    <View style={styles.statsBlock}>
                        <Text style={styles.statsBlockText}>Remaining</Text>
                        <Text style={styles.statsBlockCountText}>{total - currentIndex}</Text>
                    </View>
                </View>
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
  header: {
    fontSize: 20,
    fontWeight: '600',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  stats: {
    marginTop: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10
  },
  statsBlock: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  statsBlockText: {
    color: '#8E8E8E',
  },
  statsBlockCountText: {
    fontSize: 16,
    fontWeight: '500',
  }
});

export default SessionProgress;
