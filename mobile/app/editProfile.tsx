import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import {View, ScrollView, StatusBar} from 'react-native';
import EditProfileHints from '@/components/EditProfileTips';
import EditProfileMain from '@/components/EditProfileMain';

const EditProfile = () => {
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: "#F5F5F5"}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Sidebar/>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5"}}>
        <Header/>
        <ScrollView showsVerticalScrollIndicator={false}>
          <EditProfileMain/>
          <EditProfileHints/>
        </ScrollView>
      </View>
    </View>
  );
};

export default EditProfile;