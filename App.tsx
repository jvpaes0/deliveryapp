import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { database } from "./src/firebaseConfig";

import Home from "./src/pages/Home/inicio";
import Menu from "./src/pages/Menu/menu";

const Tab = createBottomTabNavigator();

export default function App(){
  return(
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Inicio" component={Home} options={{headerShown:false}}/>
        <Tab.Screen name="Menu" component={Menu} options={{headerShown:false}}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}