//
//  UserList.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useCallback, useEffect, useRef, useState} from "react";
import {ActivityIndicator, Animated, FlatList, PanResponder, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useFocusEffect} from "@react-navigation/native";
import {ParamList} from "../../Application";
import {ApplicationConstants} from "../../ApplicationConstants";
import {ApplicationFacade} from "../../ApplicationFacade";
import {User} from "../../model/valueObject/User";
import {IUserList} from "../interfaces/IUserList";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserList">;
}

const UserList: React.FC<Props> = ({navigation}) => {

  // State
  const [users, setUsers] = useState<User[]>([]); // User Data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const delegate = useRef<IUserList>({ // No-op implementation overridden by Mediator during registration
    findAll: async (_signal: AbortSignal) => users,
    deleteById: async (_id: number) => {}
  }).current;

  // Effects
  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_LIST)
    return () => ApplicationFacade.getInstance().unregister(ApplicationConstants.USER_LIST);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      void (async () => {
        try {
          const result = await delegate.findAll(controller.signal); // fetch users
          if (controller.signal.aborted) return;

          setUsers(result);
        } catch (error) {
          if (!controller.signal.aborted)
            setError(error instanceof Error ? error : new Error(String(error)));
        } finally {
          if (!controller.signal.aborted)
            setIsLoading(false);
        }
      })();

      return () => controller.abort();
    }, [])
  );

  // UI Components
  function ListItem({ user }: { user: User }) {
    const translateX = useRef(new Animated.Value(0)).current;

    const responder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          return Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy);
        },
        onPanResponderMove: (_, gesture) => {
          if (gesture.dx < 0) translateX.setValue(Math.max(gesture.dx, -100));
        },
        onPanResponderRelease: (_, gesture) => {
          Animated.spring(translateX, {toValue: gesture.dx < -50 ? -100 : 0, useNativeDriver: true,}).start();
        },
      })
    ).current;

    const onDelete = async () => {
      try {
        await delegate.deleteById(user.id!);
        setUsers((prev) => prev.filter((current) => current.id !== user.id));
      } catch (error) {
        setError(error instanceof Error ? error : new Error(String(error)));
      }
    }

    const onEdit = () => {
      navigation.navigate("UserForm", {user: user});
    }

    return (
      <View style={styles.swipeRow}>
        <TouchableOpacity style={styles.deleteAction} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.rowContent, { transform: [{ translateX }] }]} {...responder.panHandlers}>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.listItem}>{user.last}, {user.first}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // UI Helpers
  const List = () => (
    <FlatList<User>
      data={users} keyExtractor={(user) => `user_${user.id}`}
      renderItem={({ item }) => <ListItem user={item}/>}
    />
  );

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
      ) : users.length === 0 ? (
        <Text>No Users Found</Text>
      ) : (
        <View style={styles.container}>
          {List()}
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
  listItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listItem: {
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  swipeRow: {
    position: "relative",
    overflow: "hidden",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  rowContent: {
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  }
});

export default UserList;
