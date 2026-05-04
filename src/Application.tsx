//
//  Application.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {StatusBar} from 'expo-status-bar';
import {ApplicationFacade} from "./ApplicationFacade";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ParamList} from "./ApplicationConstants";
import {NavigationContainer} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import UserList from "./view/components/UserList";
import UserForm from "./view/components/UserForm";
import UserRole from "./view/components/UserRole";
import {createDefaultUser} from "./model/valueObject/UserVO";
import React from "react";

ApplicationFacade.getInstance().startup();

const Stack = createNativeStackNavigator<ParamList>();

const Application: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen name="UserList" component={UserList} options={({navigation}) => ({
          title: "User List",
          headerRight: () => (
            <TouchableOpacity style={{marginRight: 16}} onPress={() => navigation.navigate("UserForm", {user: createDefaultUser(), mode: "create"})}>
              <FontAwesome5 name="plus" size={24} color="#007AFF"/>
            </TouchableOpacity>
          )
        })}/>
        <Stack.Screen name="UserForm" component={UserForm} options={{title: "User Form"}}/>
        <Stack.Screen name="UserRole" component={UserRole} options={{title: "User Role"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Application;
