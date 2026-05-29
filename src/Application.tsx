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
import {ApplicationFacade} from "./ApplicationFacade";
import UserList from "./view/components/UserList";
import UserForm from "./view/components/UserForm";
import UserRole from "./view/components/UserRole";
import {createDefaultUser, UserVO} from "./model/valueObject/UserVO";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {RoleEnum} from "./model/enum/RoleEnum";

ApplicationFacade.getInstance().startup();

export type ParamList = {
  UserList: undefined;
  UserForm: { user: UserVO, mode: "create" | "edit", roles?: RoleEnum[] };
  UserRole: { user: UserVO, mode: "create" | "edit", roles: RoleEnum[] };
};

const Stack = createNativeStackNavigator<ParamList>();

const Application: React.FC = () => {

  function options({navigation}: { navigation: NativeStackNavigationProp<ParamList, "UserList"> }) {
    // Handlers
    const onCreate = () => {
      navigation.navigate("UserForm", {user: createDefaultUser(), mode: "create",});
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
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="UserList">
          <Stack.Screen name="UserList" component={UserList} options={options} />
          <Stack.Screen name="UserForm" component={UserForm} options={{title: "User Form"}} />
          <Stack.Screen name="UserRole" component={UserRole} options={{title: "User Role"}} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Application;
