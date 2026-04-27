import SetEditor from '@/components/SetEditor';
import { useLocalSearchParams } from 'expo-router';

const EditSet = () => {
  const { id } = useLocalSearchParams();
  return(
    <SetEditor mode='Edit' setId={Number(id)}/>
  );
}

export default EditSet;
