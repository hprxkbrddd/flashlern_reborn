import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  remembered: number;
  forgot: number;
  skipped: number;
  total: number;
  onRestart: () => void;
  onExit: () => void;
};

const SessionResult = ({
  remembered,
  forgot,
  skipped,
  total,
  onRestart,
  onExit,
}: Props) => {
  const accuracy =
    remembered + forgot === 0
      ? 0
      : Math.round((remembered / (remembered + forgot)) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Сессия завершена</Text>
        <Text style={styles.title}>Great job!</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.green]}>
            <Text style={styles.statLabel}>✓</Text>
            <Text style={styles.statText}>Remembered</Text>
            <Text style={styles.statNumber}>{remembered}</Text>
          </View>

          <View style={[styles.statBox, styles.red]}>
            <Text style={styles.statLabel}>✗</Text>
            <Text style={styles.statText}>Forgot</Text>
            <Text style={styles.statNumber}>{forgot}</Text>
          </View>

          <View style={[styles.statBox, styles.gray]}>
            <Text style={styles.statLabel}>⊘</Text>
            <Text style={styles.statText}>Skipped</Text>
            <Text style={styles.statNumber}>{skipped}</Text>
          </View>
        </View>

        <Text style={styles.info}>
          You reviewed {total} of {total} cards
        </Text>

        <Text style={styles.accuracy}>
          Accuracy: {accuracy}%
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.restartBtn}
            onPress={onRestart}
          >
            <Text style={styles.restartText}>Restart session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitBtn}
            onPress={onExit}
          >
            <Text>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  subtitle: {
    color: '#888',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
  },
  green: {
    backgroundColor: '#22c55e',
  },
  red: {
    backgroundColor: '#ef4444',
  },
  gray: {
    backgroundColor: '#6b7280',
  },
  statLabel: {
    color: '#fff',
    fontSize: 18,
  },
  statText: {
    color: '#fff',
    marginTop: 4,
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    marginTop: 6,
    fontWeight: 'bold',
  },
  info: {
    marginTop: 20,
  },
  accuracy: {
    marginTop: 6,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  restartBtn: {
    backgroundColor: '#FF6B3D',
    padding: 12,
    borderRadius: 8,
  },
  restartText: {
    color: '#fff',
  },
  exitBtn: {
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
});

export default SessionResult;
