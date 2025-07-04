// screens.DailyQuestScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,Alert, } from 'react-native';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Icon from 'react-native-vector-icons/Ionicons';
import { authFetch } from '../utils/authFetch';
import QuestButton from '../components/ui/QuestButton';
import { useFocusEffect } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';


interface DailyQuest {
  id: number;
  questType: string;
  progress: number;
  completed: boolean;
  description: string | null;
  rewardCoins: number;
}

const questLabels: Record<string, string> = {
  TODAYS_CREATURE: 'Today\'s Creature',
  NEW_REALMON_CHALLENGE: 'New Realmon Challenge',
  BONUS_QUEST: 'Bonus Quest',
};


const DailyQuestScreen = () => {
  // const [completed, setCompleted] = useState({});
  const [checkedIn, setCheckedIn] = useState(false);
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // navigation.navigate('Home');



  // useEffect(() => {
  //   const fetchQuests = async () => {
  //     const res = await authFetch('/api/user/me');
  //     const data = await res.json();
  //     setQuests(data.dailyQuests);
  //     console.log("dailyQuests is", data.dailyQuests);
  //   };
  //   fetchQuests();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchQuests = async () => {
        const res = await authFetch('/api/user/me');
        const data = await res.json();
        setQuests(data.dailyQuests);
        console.log("✅ dailyQuests refreshed:", data.dailyQuests);
      };
      fetchQuests();
    }, [])
  );

  // const handleComplete = (type: string) => {
  //   setCompleted({ ...completed,  [type]: true });
  // };
  // const handleComplete = async (questId: number) => {
  //   try {
  //     const res = await authFetch(`/api/daily-quests/${questId}/complete`, {
  //       method: 'POST',
  //     });
  //     if (!res.ok) throw new Error('Failed to complete quest');
  
  //     // get updated daily quest again
  //     const refreshed = await authFetch('/api/user/me');
  //     const data = await refreshed.json();
  //     setQuests(data.dailyQuests);
  
  //   } catch (err) {
  //     console.error(err);
  //     Alert.alert('Error', 'Could not mark quest as complete.');
  //   }
  // };
  

  const handleCheckIn = () => {
    setCheckedIn(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>🌿 Daily Quests</Text> */}

      {/* <Card>
        <CardContent style={styles.cardRow}>
          <View style={styles.flexOne}>
            <Text style={styles.cardTitle}>Daily Check-in</Text>
            <Text style={styles.cardSubtext}>Check in every day to earn Nature Coins and badges.</Text>
          </View>
          <View style={styles.buttonWrapper}>
          <QuestButton completed={checkedIn} onPress={handleCheckIn} />

             <Button onPress={handleCheckIn} disabled={checkedIn}>
              {checkedIn ? 'Checked In' : '🎁 Check In'}
            </Button> 
          </View>
        </CardContent>
      </Card> */}
      <Card>
        <CardContent style={styles.cardRow}>
          <View style={styles.flexOne}>
            <Text style={styles.cardTitle}>Daily Check-in</Text>
            <Text style={styles.cardSubtext}>Check in every day to earn Nature Coins and badges.</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Button onPress={handleCheckIn} disabled={checkedIn}>
              {checkedIn ? 'Checked In' : '🎁 Check In'}
            </Button>
          </View>
        </CardContent>
      </Card>

      {quests.map((quest) => (
        <Card key={quest.id}>
        <CardContent style={styles.cardContent}>
          <View style={styles.questHeader}>
            <Icon name="leaf-outline" size={20} color="#065f46" style={styles.icon} />
            <Text style={styles.questTitle}>{questLabels[quest.questType]}</Text>
            <Text style={styles.questCoin}>{quest.rewardCoins}</Text>
          </View>
    
          <Text style={styles.questDescription}>
            {quest.description|| 'Complete this quest to earn rewards.'}
          </Text>
    
          {/* <Button 
          onPress={()=>{}}
          disabled={quest.completed}>
            {quest.completed ? 'Completed' : 'In Progress'}
          </Button> */}
          {/* <Button
            onPress={() => {
              if (!quest.completed) {
                navigation.navigate('Home');
              }
            }}
            disabled={false}
            style={[
              styles.questButton,
              quest.completed ? styles.completedButton : styles.inProgressButton,
            ]}
          >
            
            {quest.completed ? 'Completed' : 'In Progress'}
          </Button> */}
          <QuestButton
              completed={quest.completed}
              onPress={() => {
                if (!quest.completed) {
                  navigation.navigate('Home');
                }
              }}
            />


        </CardContent>
      </Card>
       
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  flexOne: {
    flex: 1,
  },
  buttonWrapper: {
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065f46',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#4b5563',
  },
  cardContent: {
    padding: 16,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065f46',
  },
  questDescription: {
    color: '#374151',
    marginBottom: 8,
  },
  questCoin: {
    backgroundColor: '#D4AF37',
    marginLeft: 8,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontWeight: '600',
    color: 'white',
    overflow: 'hidden',
  },
});

export default DailyQuestScreen;