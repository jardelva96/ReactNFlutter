import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Details from "../screens/Details";
import MySubs from "../screens/MySubs";
const Stack = createNativeStackNavigator();
export default function RootNav(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{title:"Eventos"}} />
        <Stack.Screen name="Details" component={Details} options={{title:"Detalhes"}} />
        <Stack.Screen name="MySubs" component={MySubs} options={{title:"Minhas inscrições"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
