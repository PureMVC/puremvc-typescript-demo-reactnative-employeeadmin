//
//  UserRole.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, ScrollView, StyleSheet, Text, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp} from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import {ParamList} from "../../Application";
import {useAppDispatch, useAppSelector} from "../../ApplicationStore";
import {findAll, findByUserId} from "../../model/RoleThunk";
import {Role} from "../../model/valueObject/Role";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserRole">;
  route: RouteProp<ParamList, "UserRole">;
}

const UserRole: React.FC<Props> = ({navigation, route}) => {

  // Controller
  const dispatch = useAppDispatch();

  // State
  const {roles, isLoading, error} = useAppSelector(state => state.UserRoleSlice);
  const [data, setData] = useState<Role[]>([]); // User Data

  // Effects
  useEffect(() => {

    void (async() => {
      try {
        await dispatch(findAll()).unwrap(); // fetch roles
      } catch (error) {
        alert(`Failed to load roles: ${error}`);
      }

      if (route.params.roles.length)
        return setData(route.params.roles);

      try {
        const result = await dispatch(findByUserId(route.params.user.id)).unwrap() // fetch user roles
        setData(result);
      } catch (error) {
        alert(`Failed to load user: ${error}`);
      }
    })();

  }, [dispatch]);

  // Handlers
  const onChange = (role: Role) => {
    setData((prev: Role[]) => {
      if (prev.some(current => current.id === role.id)) {
        return prev.filter(current => current.id !== role.id); // Remove
      } else {
        return [...prev, role]; // Add
      }
    });
  }

  const onSave = () => {
    navigation.popTo("UserForm", {user: route.params.user, roles: data});
  }

  const onCancel = () => {
    navigation.popTo("UserForm", {user: route.params.user, roles: []});
  }

  // UI Helpers
  const List = () => (
    <>
      {roles?.map((role: Role) => (
        <View key={`role_${role.id}`} style={styles.item}>
          <Checkbox value={data.some(current => current.id === role.id)} onValueChange={() => onChange(role)}/>
          <Text style={styles.label}>{role.name}</Text>
        </View>
      ))}
    </>
  );

  const Cancel = () => (
    <Button title="Cancel" onPress={onCancel} />
  );

  const Save = () => (
    <Button title="Save" onPress={onSave} />
  );

  return (
    <>
      { isLoading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {List()}
          </ScrollView>
          <View style={styles.sticky}>
            {Cancel()}{Save()}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  }
});

export default UserRole;
