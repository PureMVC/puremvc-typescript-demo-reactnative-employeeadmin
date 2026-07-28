//
//  UserRole.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useEffect} from "react";
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp} from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import {ParamList} from "../../Application";
import {Role} from "../../domain/model/Role";
import {useUserRole} from "../UserRoleHooks";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserRole">;
  route: RouteProp<ParamList, "UserRole">;
}

const UserRole: React.FC<Props> = ({navigation, route}) => {

  // State
  const {loading, error, roles, data, setData, findAll, findByUserId} = useUserRole();

  // Effects
  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      await findAll(controller.signal);

      if (route.params.roles && route.params.roles.length !== 0)
        return setData(route.params.roles);

      await findByUserId(route.params.id, controller.signal);
    })();

    return () => controller.abort();
  }, []);

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
    navigation.popTo("UserForm", {id: route.params.id, roles: data});
  }

  const onCancel = () => {
    navigation.popTo("UserForm", {id: route.params.id});
  }

  // UI Helpers
  const List = () => (
    <>
      {roles?.map((role: Role) => (
        <Pressable key={role.id} style={styles.item} onPress={() => onChange(role)}>
          <Checkbox value={data.some(current => current.id === role.id)} onValueChange={() => onChange(role)}/>
          <Text style={styles.label}>{role.name}</Text>
        </Pressable>
      ))}
    </>
  );

  const Cancel = () => (
    <Pressable
      onPress={onCancel}
      style={({pressed}) => [styles.button, styles.cancel, pressed && { opacity: 0.7}]}>
      <Text style={styles.buttonText}>Cancel</Text>
    </Pressable>
  );

  const Save = () => (
    <Pressable
      onPress={onSave}
      style={({pressed}) => [styles.button, styles.save, pressed && { opacity: 0.7 }]}>
      <Text style={styles.buttonText}>Save</Text>
    </Pressable>
  );

  return (
    <>
      { loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>{error.message}</Text>
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
  },
  button: {
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingVertical: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center"
  },
  cancel: {
    backgroundColor: "#D32F2F",
  },
  save: {
    backgroundColor: "#4CAF50",
  },
});

export default UserRole;
