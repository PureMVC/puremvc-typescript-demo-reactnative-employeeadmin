//
//  UserForm.tsx
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp, useFocusEffect} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker";
import {MaterialIcons} from "@expo/vector-icons";
import {ParamList} from "../../Application";
import {useAppDispatch, useAppSelector} from "../../ApplicationStore";
import {findAllDepartments, findById, save, update} from "../../model/UserThunk";
import {createDefaultUser, User, validate} from "../../model/valueObject/User";
import {Role} from "../../model/valueObject/Role";
import {DEFAULT_DEPARTMENT} from "../../model/valueObject/Department";

interface Props {
  navigation: NativeStackNavigationProp<ParamList, "UserForm">;
  route: RouteProp<ParamList, "UserForm">;
}

const UserForm: React.FC<Props> = ({navigation, route}) => {

  // Controller
  const dispatch = useAppDispatch();

  // State
  const {departments, isLoading, error} = useAppSelector(state => state.UserFormSlice);
  const [user, setUser] = useState<User>(createDefaultUser());
  const [roles, setRoles] = useState<Role[]>(route.params.roles ?? []); // Roles

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const isAndroid = Platform.OS === "android";
  const isIOS = Platform.OS === "ios";

  // Effects
  useEffect(() => {
    void (async () => {
      try {
        await dispatch(findAllDepartments()).unwrap();
      } catch (error) {
        return alert(`Failed to load departments: ${error}`);
      }

      try {
        const { id } = route.params.user;
        if (!id) return;

        const result = await dispatch(findById(id)).unwrap(); // fetch user details
        setUser({...result, confirm: result.password, roles: result.roles ?? []});
      } catch(error) {
        alert(`Failed to load user: ${error}`);
      }
    })();
  }, [dispatch]);

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
    navigation.navigate("UserRole", {user: user, roles: roles});
  }

  const onSave = async () => {
    const error = validate(user);
    if (error) return alert(error);

    try {
      user.roles = roles;
      user.id === 0 ? await dispatch(save(user)).unwrap() : await dispatch(update(user)).unwrap();
      navigation.goBack();
    } catch (error) {
      alert(`Failed to ${user.id === 0 ? "save" : "update"} user: ${error}`);
    }
  }

  const onCancel = () => {
    navigation.goBack();
  }

  // UI Helpers
  const First = () => (
    <TextInput style={styles.input} placeholder="First Name" value={user.first}
               onChangeText={(value) => onChange("first", value)}/>
  );

  const Last = () => (
    <TextInput style={styles.input} placeholder="Last Name" value={user.last}
               onChangeText={(value) => onChange("last", value)}/>
  );

  const Email = () => (
    <TextInput style={styles.input} placeholder="Email" value={user.email}
               autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
               onChangeText={(value) => onChange("email", value)} />
  );

  const Username = () => (
    <TextInput style={[styles.input, user.id !== 0 && styles.disabled]} placeholder="Username"
               value={user?.username} autoCapitalize="none" autoCorrect={false} editable={user.id === 0}
               onChangeText={(value) => onChange("username", value)}/>
  );

  const Password = () => (
    <TextInput style={styles.input} placeholder="Password" value={user?.password} secureTextEntry={true}
               onChangeText={(value) => setUser(({...user, password: value} as User))}/>
  );

  const Confirm = () => (
    <TextInput style={styles.input} placeholder="Confirm" value={user?.confirm} secureTextEntry={true}
               onChangeText={(value) => setUser(({...user, confirm: value} as User))}/>
  );

  const Department = () => (
    <View style={isAndroid ? styles.androidContainer : styles.iosContainer}>
      {isIOS && (
        <TouchableOpacity style={styles.iosTrigger} onPress={() => setIsPickerVisible((flag) => !flag)}>
          <Text style={styles.iosDisplayText}>
            {departments.find((department) => department.id === user.department.id)?.name ?? DEFAULT_DEPARTMENT.name}
          </Text>
          <MaterialIcons name={isPickerVisible ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#666" style={styles.arrow}/>
        </TouchableOpacity>
      )}

      {(isAndroid || (isIOS && isPickerVisible)) && (
        <Picker itemStyle={{fontSize: 16}} selectedValue={user.department.id} onValueChange={onValueChange}
                style={isAndroid ? undefined : styles.iosPicker} mode={isAndroid ? "dropdown" : undefined}>
          <Picker.Item label={DEFAULT_DEPARTMENT.name} value={0}/>
          {departments.map((department) => (
            <Picker.Item key={department.id.toString()} label={department.name} value={department.id}/>
          ))}
        </Picker>
      )}
    </View>
  );

  const Roles = () => (
    <TouchableOpacity style={[styles.button, styles.roles]} onPress={onRoles}>
      <Text style={styles.buttonText}>ROLES</Text>
    </TouchableOpacity>
  );

  const Cancel = () => (
    <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
      <Text style={styles.buttonText}>CANCEL</Text>
    </TouchableOpacity>
  );

  const Save = () => (
    <TouchableOpacity style={[styles.button, styles.save]} onPress={onSave}>
      <Text style={styles.buttonText}>{route.params.user.id ? "UPDATE" : "SAVE"}</Text>
    </TouchableOpacity>
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  }
});

export default UserForm;
