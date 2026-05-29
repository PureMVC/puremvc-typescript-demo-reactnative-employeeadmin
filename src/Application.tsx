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
import {StatusBar} from 'expo-status-bar';
import {FontAwesome5} from "@expo/vector-icons";
import {Provider} from "react-redux";
import UserList from "./view/components/UserList";
import UserForm from "./view/components/UserForm";
import UserRole from "./view/components/UserRole";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {createDefaultUser, User} from "./model/valueObject/User";
import {Role} from "./model/valueObject/Role";
import {store} from "./ApplicationStore";

export type ParamList = {
  UserList: undefined;
  UserForm: { user: User, roles?: Role[] };
  UserRole: { user: User, roles: Role[] };
};

const Stack = createNativeStackNavigator<ParamList>();

const Application: React.FC = () => {

  function options({navigation}: { navigation: NativeStackNavigationProp<ParamList, "UserList"> }) {
    // Handlers
    const onCreate = () => {
      navigation.navigate("UserForm", {user: createDefaultUser()});
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
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator initialRouteName="UserList">
            <Stack.Screen name="UserList" component={UserList} options={options} />
            <Stack.Screen name="UserForm" component={UserForm} options={{title: "User Form"}} />
            <Stack.Screen name="UserRole" component={UserRole} options={{title: "User Role"}} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

export default Application;
