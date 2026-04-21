import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import {View, ScrollView, StatusBar} from 'react-native';
import ProfileUserInfo from '@/components/ProfileUserInfo';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileFriends from '@/components/ProfileFriends';

const Profile = () => {
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: "#f5f5f5"}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Sidebar/>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5"}}>
        <Header/>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileUserInfo/>
          <ProfileTabs/>
          <ProfileFriends/>
        </ScrollView>
      </View>
    </View>
  );
};

export default Profile;
