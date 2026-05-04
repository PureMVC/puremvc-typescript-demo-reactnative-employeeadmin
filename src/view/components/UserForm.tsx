//
//  UserForm.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useCallback, useEffect, useRef, useState} from "react";
import {Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {RouteProp, useFocusEffect} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker";
import {ApplicationConstants, ParamList} from "../../ApplicationConstants";
import {createDefaultUser, UserVO, validate} from "../../model/valueObject/UserVO";
import {ApplicationFacade} from "../../ApplicationFacade";
import {MaterialIcons} from "@expo/vector-icons";
import {DeptEnum} from "../../model/enum/DeptEnum";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RoleEnum} from "../../model/enum/RoleEnum";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserForm">;
  route: RouteProp<ParamList, "UserForm">;
}

export interface IUserForm {
  findByUsername: (username: string) => UserVO | undefined,
  save: (user: UserVO, roles: RoleEnum[]) => void,
  update: (user: UserVO, roles: RoleEnum[]) => void,
}

const UserForm: React.FC<Props> = ({navigation, route}) => {

  // State
  const [user, setUser] = useState<UserVO>(createDefaultUser()); // User Data
  const [roles, setRoles] = useState<RoleEnum[]>([]); // RoleEnums

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const isAndroid = Platform.OS === "android";
  const isIOS = Platform.OS === "ios";

  const delegate = useRef<IUserForm>({
    findByUsername: (_username: string): UserVO => user,
    save: (_user: UserVO, _roles: RoleEnum[]): void => {},
    update: (_user: UserVO, _roles: RoleEnum[]): void => {}
  }).current;

  // Effects
  useEffect(() => {
    ApplicationFacade.getInstance().register(delegate, ApplicationConstants.USER_FORM);
    return () => ApplicationFacade.getInstance().unregister(null, ApplicationConstants.USER_FORM);
  }, []);

  useEffect(() => {
    const username = route.params?.user?.username ?? "";

    const result = delegate.findByUsername(username);
    if (result !== undefined) setUser({ ...result, confirm: result.password });
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (route.params?.roles)
        setRoles(route.params.roles);
    }, [route.params?.roles])
  );

  // Handlers
  const onChange = (field: keyof UserVO, value: string) => {
    setUser((state: UserVO) => (
      {...state, [field]: value} as UserVO
    ));
  }

  const onValueChange = (value: number, _index: number) => {
    setUser((prev: UserVO) => (
      {
        ...prev,
        department: value === -1 ? DeptEnum.NONE_SELECTED : Object.values(DeptEnum).find(department => department.id === value)
      } as UserVO
    ));
    setTimeout(() => setIsPickerVisible(false), 150);
  }

  const onRoles = (_event: any) => {
    navigation.navigate("UserRole", {user: user, roles: roles, mode: route.params?.mode});
  }

  const onSave = (_event: any) => {
    const error = validate(user);
    if (error != null) return alert(error);

    route.params.mode === "create" ? delegate.save(user, roles) : delegate.update(user, roles);
    if (navigation.canGoBack()) navigation.goBack();
  }

  const onCancel = (_event: any) => {
    if (navigation.canGoBack()) navigation.goBack();
  }

  // UI Helpers
  function first() {
    return (<TextInput style={styles.input} placeholder="First Name" value={user?.first}
                       onChangeText={(value) => onChange("first", value)}/>);
  }

  function last() {
    return (<TextInput style={styles.input} placeholder="Last Name" value={user?.last}
                       onChangeText={(value) => onChange("last", value)}/>);
  }

  function email() {
    return (<TextInput style={styles.input} placeholder="Email" value={user?.email}
                       onChangeText={(value) => onChange("email", value)} keyboardType="email-address"/>);
  }

  function username() {
    return (<TextInput style={[styles.input, route.params.mode !== "create" && styles.disabled]} placeholder="Username" value={user?.username}
                       editable={route.params.mode === "create"}
                       onChangeText={(value) => onChange("username", value)}/>);
  }

  function password() {
    return (<TextInput style={styles.input} placeholder="Password" value={user?.password} secureTextEntry={true}
                       onChangeText={(value) => setUser(({...user, password: value} as UserVO))}/>);
  }

  function confirm() {
    return (<TextInput style={styles.input} placeholder="Confirm" value={user?.confirm} secureTextEntry={true}
                       onChangeText={(value) => setUser(({...user, confirm: value} as UserVO))}/>);
  }

  function department() {
    return (
      <View style={isAndroid ? styles.androidContainer : styles.iosContainer}>
        {isIOS && (
          <TouchableOpacity style={styles.iosTrigger} onPress={() => setIsPickerVisible((flag) => !flag)}>
            <Text style={styles.iosDisplayText}>
              {Object.values(DeptEnum).find((department) => department.id === user.department.id)?.name ?? DeptEnum.NONE_SELECTED.name}
            </Text>
            <MaterialIcons name={isPickerVisible ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#666" style={styles.arrow}/>
          </TouchableOpacity>
        )}

        {(isAndroid || (isIOS && isPickerVisible)) && (
          <Picker itemStyle={{fontSize: 16}} selectedValue={user.department.id} onValueChange={onValueChange}
                  style={isAndroid ? undefined : styles.iosPicker} mode={isAndroid ? "dropdown" : undefined}>
            {Object.values(DeptEnum).map((department) => (
              <Picker.Item key={department.id} label={department.name} value={department.id}/>
            ))}
          </Picker>
        )}
      </View>
    );
  }

  function rolesButton() {
    return (
      <TouchableOpacity style={[styles.button, styles.roles]} onPress={onRoles}>
        <Text style={styles.buttonText}>ROLES</Text>
      </TouchableOpacity>
    );
  }

  function cancel() {
    return (
      <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
        <Text style={styles.buttonText}>CANCEL</Text>
      </TouchableOpacity>
    );
  }

  function save() {
    return (
      <TouchableOpacity style={[styles.button, styles.save]} onPress={onSave}>
        <Text style={styles.buttonText}>{route.params?.mode === "edit" ? "UPDATE" : "SAVE"}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <>{first()}{last()}</>
      </View>
      <View style={styles.row}>
        <>{email()}{username()}</>
      </View>
      <View style={styles.row}>
        <>{password()}{confirm()}</>
      </View>
      <View style={styles.row}>
        <>{department()}{rolesButton()}</>
      </View>
      <View style={styles.row}>
        <>{cancel()}{save()}</>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  }
});

export default UserForm;
