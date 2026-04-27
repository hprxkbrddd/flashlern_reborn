import api from "@/api/api";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ProfileTabs = () => {
    const [activeTab, setActiveTab] = useState('About');
    const [streak, setStreak] = useState();
    const [reviewedToday, setReviewedToday] = useState();
    const [setsCreated, setSetsCreated] = useState();

    useEffect(() => {
      fetchStats();
      fetchSetsCount();
    }, []);

    const fetchStats = async () => {
      try {
        const response = await api.post('user-stats/progress',{});
        setStreak(response.data.streak);
        setReviewedToday(response.data.reviewedToday);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSetsCount = async () => {
      try {
        const response = await api.get('/flashcards');
        setSetsCreated(response.data.length);
      } catch (error) {
        console.error(error);
      }
    };

    return(
        <View>
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'About' && styles.activeTab]}
                    activeOpacity={0.6}
                    onPress={() => setActiveTab('About')}>
                    <Text
                        style={[styles.tabText, activeTab === 'About' && styles.activeTabText]}>
                        About
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Statistics' && styles.activeTab]}
                    activeOpacity={0.6}
                    onPress={() => setActiveTab('Statistics')}>
                        <Text
                            style={[styles.tabText, activeTab === 'Statistics' && styles.activeTabText]}>
                            Statistics
                        </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tabContent}>
                {activeTab === 'About' && (
                <View style={styles.aboutContainer}>
                    <Text style={styles.aboutHeaderText}>About</Text>
                    <Text style={styles.aboutText}>No description provided yet.</Text>
                </View>
                )}
            
                {activeTab === 'Statistics' && (
                    <View style={styles.statisticsContainer}>
                        <View style={styles.statsSetsCreated}>
                            <Text style={styles.statsSetsCreatedCount}>{setsCreated}</Text>
                            <Text style={styles.statsSetsCreatedText}>Sets created</Text>
                        </View>
                        <View style={styles.statsCardsLearned}>
                            <Text style={styles.statsCardsLearnedCount}>{reviewedToday}</Text>
                            <Text style={styles.statsCardsLearnedText}>Cards learned</Text>
                        </View>
                        <View style={styles.statsDayStreak}>
                            <Text style={styles.statsDayStreakCount}>{streak}</Text>
                            <Text style={styles.statsDayStreakText}>Day streak</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 5,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 5,
    borderColor: '#E8E8E8',
    
  },
  activeTab: {
    backgroundColor: '#FFF6EF',
    borderColor: '#FF6B3D',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 100,
  },
  aboutContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  aboutHeaderText: {
    fontSize: 15,
    fontWeight: '700'
  },
  aboutText: {
    fontSize: 15,
    marginTop: 10,
    color: '#8E8E8E'
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE'
  },
  statsSetsCreated: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: '#E9F4EC'
  },
  statsSetsCreatedCount: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#2BAE8F'
  },
  statsSetsCreatedText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
    color: '#8E8E8E'
  },
  statsCardsLearned: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: '#E8F0F3'
  },
  statsCardsLearnedCount: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#4F7FCB'
  },
  statsCardsLearnedText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
    color: '#8E8E8E'
  },
  statsDayStreak: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#FEF3C6',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: '#EBE7BA'
  },
  statsDayStreakCount: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#D6AA41'
  },
  statsDayStreakText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
    color: '#8E8E8E'
  },
});

export default ProfileTabs;
