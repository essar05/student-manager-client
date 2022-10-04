import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import React from 'react';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        {/*<Appbar.BackAction color={'#fff'} onPress={() => navigation.navigate('TabTwo')}/>*/}
        <Appbar.BackAction color={'#fff'} />
        <Appbar.Content color={'#fff'} title="Title" subtitle="Subtitle"/>
        <Appbar.Action color={'#fff'} icon="magnify"/>
        <Appbar.Action color={'#fff'} icon="dots-vertical"/>
      </Appbar.Header>

      <View style={styles.content}>
        <Text style={styles.title}>Tab Ones</Text>
        <View style={styles.separator}/>
        <EditScreenInfo path="/screens/TabOneScreen.tsx"/>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
});
