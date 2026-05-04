//
//  UserRole.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useEffect, useRef, useState} from "react";
import {Button, ScrollView, StyleSheet, Text, View} from "react-native";
import {RouteProp} from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import {ApplicationConstants, ParamList} from "../../ApplicationConstants";
import {ApplicationFacade} from "../../ApplicationFacade";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RoleEnum} from "../../model/enum/RoleEnum";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserRole">;
  route: RouteProp<ParamList, "UserRole">;
}

export interface IUserRole {
  findByUsername: (username: string) => RoleEnum[]
}

const UserRole: React.FC<Props> = ({navigation, route}) => {

  // State
  const [roles, setRoles] = useState<RoleEnum[]>([]); // User Data

  const delegate = useRef<IUserRole>({
    findByUsername: (_username: string): RoleEnum[] => roles
  }).current;

  // Effects
  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_ROLE);
    return () => ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_ROLE);
  }, []);

  useEffect(() => {
    if (route.params?.roles.length !== 0)
      return setRoles(route.params?.roles);

    let result = delegate.findByUsername(route.params?.user.username);
    setRoles(result);
  }, []);

  // Handlers
  const onChange = (role: RoleEnum) => {
    setRoles((prev: RoleEnum[]) => {
      if (prev.some(current => current.id === role.id)) {
        return prev.filter(current => current.id !== role.id); // Remove
      } else {
        return [...prev, role]; // Add
      }
    });
  }

  const onSave = () => {
    navigation.popTo("UserForm", {user: route.params?.user, roles: roles, mode: route.params?.mode});
  }

  const onCancel = () => {
    navigation.popTo("UserForm", {user: route.params?.user, roles: [], mode: route.params?.mode});
  }

  // UI Helpers
  function list() {
    return (
      <>
        {Object.values(RoleEnum)?.map((role: RoleEnum) => (
          <View key={`${role.name}`} style={styles.item}>
            <Checkbox value={roles.some(current => current.id === role.id)} onValueChange={() => onChange(role)}/>
            <Text style={styles.label}>{role.name}</Text>
          </View>
        ))}
      </>
    );
  }

  function cancel() {
    return (<Button title="Cancel" onPress={onCancel}/>);
  }

  function save() {
    return (<Button title="Save" onPress={onSave}/>);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {list()}
      </ScrollView>
      <View style={styles.sticky}>
        <>{cancel()}{save()}</>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  scrollView: {
    marginBottom: 60
  },
  checkbox: {
    backgroundColor: "transparent",
  },
  label: {
    marginLeft: 25,
    fontSize: 18,
  },
  sticky: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  }
});

export default UserRole;
