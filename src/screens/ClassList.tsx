import React, { useEffect } from "react";
import { RootStackScreenProps } from "../navigation/types";
import { Appbar, Button, Card, Paragraph, Title } from "react-native-paper";
import { Class } from "../models/class";
import { useClassStore } from "../stores/classStore";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export const ClassList = (props: RootStackScreenProps<'ClassList'>) => {
  const fetchClasses = useClassStore((state) => state.fetch);
  const classes = useClassStore((state) => state.classes);
  const isLoading = useClassStore((state) => state.isLoading);
  const isInitialized = useClassStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      fetchClasses();
    }
  }, [ isInitialized ]);

  return (
    <View>
      <Appbar.Header>
        {/*<Appbar.BackAction color={'#fff'} onPress={() => navigation.navigate('TabTwo')}/>*/}
        <Appbar.Content title="Classes"/>
      </Appbar.Header>

      {isLoading && <Text>Loading...</Text>}

      {!isLoading &&
          <ScrollView style={styles.cards}>
            {classes.map(class_ => (
              <Card
                key={class_.id}
                style={styles.card}
                elevation={5}
                onPress={() => props.navigation.navigate('Root', { screen: 'Class', params: { id: class_.id } })}
              >
                <Card.Title title={`Clasa a ${class_.year}-a`} subtitle={class_.school}/>
              </Card>
            ))}
          </ScrollView>
      }
    </View>
  );
};

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
    marginBottom: 10,
    padding: 10
  }
});