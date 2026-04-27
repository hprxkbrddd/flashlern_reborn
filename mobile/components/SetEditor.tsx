import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import api from '@/api/api';
import { useRouter } from 'expo-router';

type Card = {
  front: string;
  back: string;
};

type Props = {
    mode: 'Edit' | 'Create';
    setId?: number
}

type Visiability = 'PRIVATE' | 'FRIENDS' | 'PUBLIC';

const SetEditor = ({mode, setId}:Props) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<Visiability>('PRIVATE');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!setId) return;
    fetchSet();
  }, [setId]);

  const fetchSet = async () => {
    try {
      const response = await api.get(`/flashcards/getSet/${setId}`);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setVisibility(response.data.visibility);
      setTags(response.data.tags);
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

  const handleCreate = async () => {
    try {
      setLoading(true);

      const formattedCards = cards.map(card => ({
        question: card.front,
        answer: card.back
      }));

      const response = await api.post(
        '/flashcards/create',
        {
          "title": title,
          "description": description,
          "visibility": visibility,
          "tags": tags,
          "flashCards": formattedCards
        });

        router.push('/');
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
    try {
      setLoading(true);

      const formattedCards = cards.map(card => ({
        question: card.front,
        answer: card.back
      }));

      const response = await api.put(
        `/flashcards/edit/${setId}`,
        {
          "title": title,
          "description": description,
          "visibility": visibility,
          "tags": tags,
          "flashCards": formattedCards
        });

        router.push('/');
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const addCard = () => {
    if (front.trim() && back.trim()) {
      setCards((prev) => [...prev, { front, back }]);
      setFront('');
      setBack('');
    }
  };

  const removeCard = (index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: "#f5f5f5"}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Sidebar/>
      <View style={{ flex: 1, backgroundColor: "#f5f5f5"}}>
        <Header/>
        <ScrollView>
          <View style={styles.container}>
            {mode == 'Create' ? (
              <Text style={styles.header}>Create new set</Text>) : (
                <Text style={styles.header}>Edit set</Text>
            )}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}/>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={description}
              onChangeText={setDescription}
              multiline/>

            <Text style={styles.label}>Visibility</Text>
            <View>
              <Picker
                style={styles.picker}
                selectedValue={visibility}
                onValueChange={(itemValue: Visiability) =>
                setVisibility(itemValue)}>
                <Picker.Item label="Private" value="PRIVATE" />
                <Picker.Item label="Friends" value="FRIENDS" />
                <Picker.Item label="Public" value="PUBLIC" />
              </Picker>
            </View>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Type tag..."
                value={tagInput}
                onChangeText={setTagInput}/>
              <TouchableOpacity style={styles.addBtn} onPress={addTag}>
              <Text style={styles.addBtnText}>Добавить тег</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(index)}>
                    <Text style={styles.remove}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <Text style={styles.label}>Add cards</Text>
            <View style={styles.row}>
                <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Front"
                value={front}
                onChangeText={setFront}
                />
                <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Back"
                value={back}
                onChangeText={setBack}
                />
            </View>
            
            <TouchableOpacity style={styles.addCardBtn} onPress={addCard}>
                <Text style={styles.addCardText}>Add card</Text>
            </TouchableOpacity>

            <Text>{cards.length} cards</Text>

            {cards.map((card, index) => (
                <View key={index} style={styles.card}>
                <View>
                    <Text style={styles.bold}>{card.front}</Text>
                    <Text>{card.back}</Text>
                </View>
                <TouchableOpacity onPress={() => removeCard(index)}>
                    <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
                </View>
            ))}


            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancel}
                onPress={() => router.push('/')}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              {mode == 'Create' ? (
                <TouchableOpacity style={styles.create}
                    onPress={handleCreate}>
                    <Text style={{ color: '#fff' }}>Create</Text>
                </TouchableOpacity>) : (
                    <TouchableOpacity style={styles.create}
                    onPress={handleSave}>
                        <Text style={{ color: '#fff' }}>Save</Text>
                    </TouchableOpacity>
                )}
              
            </View>
          </View>
        </ScrollView>
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
  header: {
    fontSize: 20,
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addBtn: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
  },
  addBtnText: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 6,
    marginTop: 6,
  },
  remove: {
    marginLeft: 6,
    color: 'red',
  },
  addCardBtn: {
    backgroundColor: '#2ec26e',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  addCardText: {
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  cancel: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  create: {
    backgroundColor: '#FF6B3D',
    padding: 10,
    borderRadius: 6,
  },
});

export default SetEditor;
