//
//  Application.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React from "react";
import {TouchableOpacity} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator, NativeStackNavigationProp} from "@react-navigation/native-stack";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {StatusBar} from 'expo-status-bar';
import {FontAwesome5} from "@expo/vector-icons";
import UserList from "./presentation/components/UserList";
import UserForm from "./presentation/components/UserForm";
import UserRole from "./presentation/components/UserRole";
import {User} from "./domain/model/User";
import {Role} from "./domain/model/Role";
import {ContextProvider} from "./ApplicationContext";

export type ParamList = {
  UserList: { user: User | null } | undefined;
  UserForm: { id: number, roles?: Role[] };
  UserRole: { id: number, roles?: Role[] | null };
};

const Stack = createNativeStackNavigator<ParamList>();

const Application: React.FC = () => {
  function options({navigation}: { navigation: NativeStackNavigationProp<ParamList, "UserList"> }) {
    // Handlers
    const onCreate = () => {
      navigation.navigate("UserForm", {id: 0});
    };

    // UI Helpers
    const headerRight = () => (
      <TouchableOpacity onPress={onCreate}>
        <FontAwesome5 name="plus" size={24} color="#007AFF" />
      </TouchableOpacity>
    );

    return {
      title: "User List",
      headerRight
    };
  }

  return (
    <ContextProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator initialRouteName="UserList">
            <Stack.Screen name="UserList" component={UserList} options={options} />
            <Stack.Screen name="UserForm" component={UserForm} options={{title: "User Form"}} />
            <Stack.Screen name="UserRole" component={UserRole} options={{title: "User Role"}} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ContextProvider>
  );
}

export default Application;
