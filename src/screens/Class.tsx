import React from "react";
import { RootStackScreenProps } from "../navigation/types";
import { Appbar } from "react-native-paper";
import { View } from "react-native";

export const Class = (props: RootStackScreenProps<'Class'>) => {
  console.log(props);

  return <View>
    <Appbar.Header>
      <Appbar.BackAction onPress={() => props.navigation.goBack()}/>
      <Appbar.Content title="Clasa"/>
    </Appbar.Header>

    {/*{isLoading && <>Loading...</>}*/}
  </View>;
};