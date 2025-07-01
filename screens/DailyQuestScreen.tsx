// screens.DailyQuestScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Icon from 'react-native-vector-icons/Ionicons';
import { authFetch } from '../utils/authFetch';

interface DailyQuest {
  id: number;
  questType: string;
  progress: number;
  completed: boolean;
  description: string | null;
  rewardCoins: number;
}


// const quests = [
//   {
//     id: 'q1',
//     title: 'Spring Story: Leaf Awakening',
//     type: 'story',
//     description: 'Find a newly sprouted leaf and note its color and shape.',
//   },
//   {
//     id: 'q2',
//     title: 'Weather Challenge: Explore the Rain',
//     type: 'weather',
//     description: 'Go for a walk after rain and observe which realmons are enjoying the rain with you.',
//   },
//   {
//     id: 'q3',
//     title: 'Today\'s Creature: Spot a Butterfly',
//     type: 'species',
//     description: 'Try to spot and photograph a butterfly. Record its colors and flight pattern.',
//   },
// ];

const DailyQuestScreen = () => {
  const [completed, setCompleted] = useState({});
  const [checkedIn, setCheckedIn] = useState(false);
  const [quests, setQuests] = useState<DailyQuest[]>([]);

  useEffect(() => {
    const fetchQuests = async () => {
      const res = await authFetch('/api/user/me');
      const data = await res.json();
      setQuests(data.dailyQuests);
      console.log("dailyQuests is", data.dailyQuests);
    };
    fetchQuests();
  }, []);


  const handleComplete = (type: string) => {
    setCompleted({ ...completed,  [type]: true });
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>🌿 Daily Quests</Text> */}

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
            <Text style={styles.questTitle}>{quest.questType}</Text>
            <Text style={styles.questCoin}>{quest.rewardCoins}</Text>
          </View>
    
          <Text style={styles.questDescription}>
            {quest.description|| 'Complete this quest to earn rewards.'}
          </Text>
    
          <Button 
          onPress={() => handleComplete(quest.questType)}
          disabled={quest.completed}>
            {quest.completed ? 'Completed' : 'In Progress'}
          </Button>
        </CardContent>
      </Card>
        // <Card key={quest.id}>
        //   <CardContent style={styles.cardContent}>
        //     <View style={styles.questHeader}>
        //       {quest.type === 'story' && <Icon name="sparkles-outline" size={20} color="#065f46" style={styles.icon} />}
        //       {quest.type === 'weather' && <Icon name="leaf-outline" size={20} color="#065f46" style={styles.icon} />}
        //       {quest.type === 'species' && <Icon name="gift-outline" size={20} color="#065f46" style={styles.icon} />}
        //       <Text style={styles.questTitle}>{quest.title}</Text>
        //     </View>

        //     <Text style={styles.questDescription}>{quest.description}</Text>
        //     <Button onPress={() => handleComplete(quest.id)} disabled={completed[quest.id]}>
        //       {completed[quest.id] ? 'Completed' : 'Start Quest'}
        //     </Button>
        //   </CardContent>
        // </Card>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#065f46',
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
  questCoin:{
    backgroundColor:'#D4AF37',
    marginLeft: 10,
    borderRadius: 10,
    paddingLeft: 6,
    paddingRight: 6,
    paddingBottom:2,
    paddingTop:2,
    fontWeight: '600',
    color:'white'
  }
});

export default DailyQuestScreen;


