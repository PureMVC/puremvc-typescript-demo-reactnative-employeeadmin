//
//  UserForm.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp, useFocusEffect} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker";
import {MaterialIcons} from "@expo/vector-icons";
import {ParamList} from "../../Application";
import {User, validate} from "../../domain/model/User";
import {DEFAULT_DEPARTMENT} from "../../domain/model/Department";
import {Role} from "../../domain/model/Role";
import {useUserForm} from "../UserFormHooks";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserForm">;
  route: RouteProp<ParamList, "UserForm">;
}

const UserForm: React.FC<Props> = ({navigation, route}) => {

  // State
  const {loading, error, departments, user, setUser, findAllDepartments, findById, save} = useUserForm();
  const [confirm, setConfirm] = useState<string>("");
  const [roles, setRoles] = useState<Role[] | null>(route.params.roles ?? null);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const isAndroid = Platform.OS === "android";
  const isIOS = Platform.OS === "ios";

  // Effects
  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      await findAllDepartments(controller.signal);
      if (controller.signal.aborted) return;

      if (route.params.id === 0) return;

      await findById(route.params.id, controller.signal);
      if (controller.signal.aborted) return;
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setConfirm(user.password);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      route.params.roles && setRoles(route.params.roles); // receive roles from the UserRole
    }, [route.params.roles])
  );

  // Handlers
  const onChange = (field: keyof User, value: string) => {
    setUser((state: User) => (
      {...state, [field]: value} as User
    ));
  }

  const onValueChange = (value: number, _index: number) => {
    setUser((prev: User) => (
      {
        ...prev,
        department: value === 0 ? DEFAULT_DEPARTMENT : departments.find(department => department.id === value)
      } as User
    ));
    setTimeout(() => setIsPickerVisible(false), 150);
  }

  const onRoles = () => {
    navigation.navigate("UserRole", {id: route.params.id, roles: roles});
  }

  const onSave = async () => {
    if (!user) return;
    const error = validate(user, confirm);
    if (error != null) return alert(error);

    try {
      await save(user, roles);
      navigation.popTo("UserList", {user: user});
    } catch (error) {
      alert(`Failed to ${user.id === 0 ? "save" : "update"} user: ${error}`);
    }
  }

  const onCancel = () => {
    navigation.popTo("UserList", {user: null});
  }

  // UI Helpers
  const First = () => (
    <TextInput style={styles.input} placeholder="First Name" value={user.first}
               onChangeText={(value) => onChange("first", value)} />
  );

  const Last = () => (
    <TextInput style={styles.input} placeholder="Last Name" value={user.last}
               onChangeText={(value) => onChange("last", value)} />
  );

  const Email = () => (
    <TextInput style={styles.input} placeholder="Email" value={user.email}
               autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
               onChangeText={(value) => onChange("email", value)} />
  );

  const Username = () => (
    <TextInput style={[styles.input, user.id !== 0 && styles.disabled]} placeholder="Username"
               value={user?.username} autoCapitalize="none" autoCorrect={false} editable={user.id === 0}
               onChangeText={(value) => onChange("username", value)} />
  );

  const Password = () => (
    <TextInput style={styles.input} placeholder="Password" value={user?.password} secureTextEntry={true}
               onChangeText={(value) => setUser(({...user, password: value} as User))} />
  );

  const Confirm = () => (
    <TextInput style={styles.input} placeholder="Confirm" value={confirm} secureTextEntry={true}
               onChangeText={(value) => setConfirm(value)} />
  );

  const Department = () => (
    <View style={isAndroid ? styles.androidContainer : styles.iosContainer}>
      {isIOS && (
        <TouchableOpacity style={styles.iosTrigger} onPress={() => setIsPickerVisible((flag) => !flag)}>
          <Text style={styles.iosDisplayText}>
            {departments.find((department) => department.id === user.department.id)?.name ?? DEFAULT_DEPARTMENT.name}
          </Text>
          <MaterialIcons name={isPickerVisible ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#666" style={styles.arrow} />
        </TouchableOpacity>
      )}

      {(isAndroid || (isIOS && isPickerVisible)) && (
        <Picker
          selectedValue={user.department.id}
          onValueChange={onValueChange}
          style={isAndroid ? styles.androidPicker : styles.iosPicker}
          itemStyle={isIOS ? styles.iosPickerItem : undefined}
          mode={isAndroid ? "dropdown" : undefined}>
            <Picker.Item label={DEFAULT_DEPARTMENT.name} value={0} />
            {departments.map((department) => (
              <Picker.Item key={department.id.toString()} label={department.name} value={department.id} />
            ))}
        </Picker>
      )}
    </View>
  );

  const Roles = () => (
    <Pressable
      onPress={onRoles}
      style={({pressed}) => [styles.button, styles.roles, pressed && { opacity: 0.7}]}>
      <Text style={styles.buttonText}>ROLES</Text>
    </Pressable>
  );

  const Cancel = () => (
    <Pressable
      onPress={onCancel}
      style={({pressed}) => [styles.button, styles.cancel, pressed && { opacity: 0.7 }]}>
      <Text style={styles.buttonText}>CANCEL</Text>
    </Pressable>
  );

  const Save = () => (
    <Pressable
      onPress={onSave}
      style={({pressed}) => [styles.button, styles.save, pressed && { opacity: 0.7 }]}>
      <Text style={styles.buttonText}>{route.params.id ? "UPDATE" : "SAVE"}</Text>
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
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.row}>
            {First()}{Last()}
          </View>
          <View style={styles.row}>
            {Email()}{Username()}
          </View>
          <View style={styles.row}>
            {Password()}{Confirm()}
          </View>
          <View style={styles.row}>
            {Department()}{Roles()}
          </View>
          <View style={styles.row}>
            {Cancel()}{Save()}
          </View>
        </ScrollView>
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
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginHorizontal: 5,
    paddingHorizontal: 5,
  },
  disabled: {
    backgroundColor: "#f2f2f2",
    color: "#999",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 10,
    overflow: 'hidden',
    justifyContent: 'center', // vertical centering
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  picker: {
    flex: 1,  // fills container
    width: '100%',
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
  update: {
    backgroundColor: "#2196F3",
  },
  roles: {
    backgroundColor: "#9C27B0",
  },

  // picker
  androidContainer: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    height: 40,
    overflow: "hidden",
  },
  androidPicker: {
    height: 50
  },
  iosContainer: {
    flex: 1,
    zIndex: 10
  },
  iosTrigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  iosDisplayText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 8,
  },
  arrow: {
    paddingRight: 8
  },
  iosPicker: {
    position: "absolute",
    top: 40,
    left: 5,
    right: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  iosPickerItem: {
    fontSize: 16,
    height: 120,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  }
});

export default UserForm;
