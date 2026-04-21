import {View, Text, ScrollView} from 'react-native';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { GoalCard } from '../components/GoalCard';
import { StreakCard } from '../components/StreakCard';
import { CardSets } from '../components/CardSets';

export default function Index() {

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: "#f5f5f5"}}>

            {/* Sidebar */}
            <Sidebar/>

            {/* Main */}
            <View style={{ flex: 1, backgroundColor: "#f5f5f5"}}>

                {/* Header */}
                <Header />

                {/* Content */}
                <ScrollView
                style={{ flex: 1, backgroundColor: "#f5f5f5"}}
                showsVerticalScrollIndicator={false}>
                    <GoalCard />
                    <StreakCard />
                    <CardSets />
                </ScrollView>
            </View>
        </View>

    );
}

