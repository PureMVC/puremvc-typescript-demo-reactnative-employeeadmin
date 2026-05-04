//
//  UserRole.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, Button, ScrollView, StyleSheet, Text, View} from "react-native";
import {RouteProp} from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import {ApplicationConstants, ParamList} from "../../ApplicationConstants";
import {Role} from "../../model/valueObject/Role";
import {ApplicationFacade} from "../../ApplicationFacade";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserRole">;
  route: RouteProp<ParamList, "UserRole">;
}

export interface IUserRole {
  findAll: (signal: AbortSignal) => Promise<Role[]>,
  findByUserId: (id: number, signal: AbortSignal) => Promise<Role[]>
}

const UserRole: React.FC<Props> = ({navigation, route}) => {

  // State
  const [roles, setRoles] = useState<Role[]>([]); // UI Data
  const [data, setData] = useState<Role[]>([]); // User Data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const delegate = useRef<IUserRole>({
    findAll: async (_signal: AbortSignal): Promise<Role[]> => roles,
    findByUserId: async (_id: number, _signal): Promise<Role[]> => data
  }).current;

  // Effects
  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_ROLE);
    return () => ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_ROLE);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        let result = await delegate.findAll(controller.signal);
        if (!controller.signal.aborted) setRoles(result);
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error : new Error(String(error)));
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (roles.length === 0) return;

    if (route.params?.user.roles.length == 0)
      return setIsLoading(false);

    const controller = new AbortController();

    void (async () => {
      try {
        if (route.params?.user.roles.length === 0 || route.params?.user.id === 0)
          return setData(route.params?.user.roles);

        let result = await delegate.findByUserId(route.params?.user.id, controller.signal);
        if (!controller.signal.aborted) setData(result);
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [roles]);

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
    route.params.user.roles = data;
    if (navigation.canGoBack()) navigation.goBack();
  }

  const onCancel = () => {
    if (navigation.canGoBack()) navigation.goBack();
  }

  // UI Helpers
  function list() {
    return (
      <>
        {roles?.map((role: Role) => (
          <View key={`role_${role.id}`} style={styles.item}>
            <Checkbox value={data.some(current => current.id === role.id)} onValueChange={() => onChange(role)}/>
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
    <>
      { isLoading ? (
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
            {list()}
          </ScrollView>
          <View style={styles.sticky}>
            <>{cancel()}{save()}</>
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
