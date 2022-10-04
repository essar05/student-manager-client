import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Appbar, Surface } from 'react-native-paper';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import useColorScheme from "../hooks/useColorScheme";

// @ts-ignore
const LeftContent = props => <Avatar.Icon {...props} icon="folder"/>;

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.surface}>
      <Appbar.Header>
        <Appbar.BackAction color={'#fff'}/>
        <Appbar.Content color={'#fff'} title="Title" subtitle="Subtitle"/>
      </Appbar.Header>

      <ScrollView style={styles.cards}>
        <Card style={styles.card} elevation={5}>
          <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent}/>
          <Card.Content>
            <Title>Card title</Title>
            <Paragraph>Card content</Paragraph>
          </Card.Content>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }}/>
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card} collapsable mode={"outlined"}>
          <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent}/>
          <Card.Content>
            <Title>Card title</Title>
            <Paragraph>Card content</Paragraph>
          </Card.Content>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }}/>
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <Appbar>
        <Appbar.Action
          icon="archive"
          onPress={() => console.log('Pressed archive')}
        />
        <Appbar.Action icon="mail" onPress={() => console.log('Pressed mail')}/>
        <Appbar.Action icon="label" onPress={() => console.log('Pressed label')}/>
        <Appbar.Action
          icon="delete"
          onPress={() => console.log('Pressed delete')}
        />
      </Appbar>
    </View>
  );
}
const styles = StyleSheet.create({

  surface: {
    flex: 1,
    minHeight: '100%'
  },
  cards: {
    paddingTop: 20,
    paddingHorizontal: 10
  },
  card: {
    marginBottom: 10
  }
});