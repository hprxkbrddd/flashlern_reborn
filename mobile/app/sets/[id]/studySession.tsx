import api from '@/api/api';
import { Header } from '@/components/Header';
import ProgressBar from '@/components/Progressbar';
import SessionProgress from '@/components/SessionProgress';
import SessionResult from '@/components/SessionResult';
import SessionTips from '@/components/SessionTips';
import { Sidebar } from '@/components/Sidebar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';

type Card = {
  front: string;
  back: string;
};

const StudySession = () => {
  const router = useRouter();
  const { id: setId } = useLocalSearchParams();

  const [cards, setCards] = useState<Card[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const [remembered, setRemembered] = useState(0);
  const [forgot, setForgot] = useState(0);
  const [skipped, setSkipped] = useState(0);

  const currentCard = cards[currentIndex];
  const total = cards.length;

  useEffect(() => {
      if (!setId) return;
    fetchCards();
  }, [setId]);

  const fetchCards = async () => {
    try {
      const response = await api.get(`/flashcards/getSet/${setId}`);
      const flashCards = response.data.flashCards;
      const formattedCards = flashCards.map((card:any) => ({
        front: card.question,
        back: card.answer
      }));
      setCards(formattedCards);
    } catch (error) {
      console.error(error);
    }
  };

  const sendProgress = async () => {
    try {
      const response = await api.post('/user-stats/progress',
        {
          "reviewed": total
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = () => {
    setShowBack(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRemembered = () => {
    setRemembered((prev) => prev + 1);
    handleNext();
  };

  const handleForgot = () => {
    setForgot((prev) => prev + 1);
    handleNext();
  };

  const handleSkip = () => {
    setSkipped((prev) => prev + 1);
    handleNext();
  };

  const progress = currentIndex / total;

  if (currentIndex >= total) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: "#f5f5f5"}}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Sidebar/>
        <View style={{ flex: 1, backgroundColor: "#f5f5f5"}}>
          <Header/>
            <SessionResult
              remembered={remembered}
              forgot={forgot}
              skipped={skipped}
              total={total}
              onRestart={() => {
                sendProgress();
                setCurrentIndex(0);
                setRemembered(0);
                setForgot(0);
                setSkipped(0);
              }}
              onExit={() => {
                sendProgress();
                router.push('/');
              }}/>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: "#f5f5f5"}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Sidebar/>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5"}}>
        <Header/>
        <ScrollView>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.exitButton} activeOpacity={0.6}>
              <Text 
                style={styles.exitButtonText}
                onPress={() => router.push('/')}>
                ← Exit
              </Text>
            </TouchableOpacity>
            <View>
                <Text>{currentIndex} / {total}</Text>
                <ProgressBar progress={progress}/>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => setShowBack((prev) => !prev)}
              activeOpacity={0.8}>

              <Text style={styles.label}>
              {showBack ? 'Answer' : 'Question'}
              </Text>
              <Text style={styles.cardText}>
              {showBack ? currentCard.back : currentCard.front}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>Click card to reveal answer</Text>

            <View style={styles.buttons}>
                <TouchableOpacity
                style={[styles.btn, styles.green]}
                onPress={handleRemembered}
                >
                <Text style={styles.btnText}>✓ Remembered</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.btn, styles.red]}
                onPress={handleForgot}
                >
                <Text style={styles.btnText}>✗ Forgot</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.btn, styles.gray]}
                onPress={handleSkip}
                >
                <Text style={styles.btnText}>⊘ Skip</Text>
                </TouchableOpacity>
            </View>

          <SessionProgress 
              remembered={remembered}
              forgot={forgot}
              skipped={skipped}
              total={total}
              currentIndex={currentIndex}/>
          <SessionTips/>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 16,
  },
  
  card: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#888',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 8,
    marginHorizontal: 16,
    color: '#888',
  },
  buttons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    gap: 10,
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
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
  btnText: {
    color: '#fff',
  },
  exitButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default StudySession;
