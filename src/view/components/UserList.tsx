//
//  UserList.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useCallback, useEffect, useRef, useState} from "react";
import {Animated, FlatList, PanResponder, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {ApplicationConstants, ParamList} from "../../ApplicationConstants";
import {UserVO} from "../../model/valueObject/UserVO";
import {ApplicationFacade} from "../../ApplicationFacade";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserList">;
}

export interface IUserList {
  findAll: () => Partial<UserVO>[],
  deleteByUsername: (username: string) => void
}

const UserList: React.FC<Props> = ({navigation}) => {

  // State
  const [users, setUsers] = useState<Partial<UserVO>[]>([]); // User Data
  
  const delegate = useRef<IUserList>({ // No-op implementation overridden by Mediator during registration
    findAll: () => users,
    deleteByUsername: (_username: string) => {},
  }).current;

  // Effects
  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_LIST)
    return () => ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_LIST);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const result = delegate.findAll();
      setUsers([...result]);
    }, [])
  );

  // UI Helpers
  function ListItem({ user }: { user: Partial<UserVO> }) {
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

    return (
      <View style={styles.swipeRow}>
        <TouchableOpacity style={styles.deleteAction} onPress={() => {
          delegate.deleteByUsername(user.username!);
          setUsers((prev) => prev.filter((current) => current.username !== user.username));
        }}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.rowContent, { transform: [{ translateX }] }]} {...responder.panHandlers}>
          <TouchableOpacity onPress={() => navigation.navigate("UserForm", {user: user, mode: "edit"})}>
            <Text style={styles.listItem}>{user.last}, {user.first}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <>
      { users.length === 0 ? (
        <Text>No Users Found</Text>
      ) : (
        <View style={styles.container}>
          <FlatList<Partial<UserVO>> data={users}
            keyExtractor={(user) => `${user.username}`}
            renderItem={({ item }) => <ListItem user={item}/>}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  }
});

export default UserList;
