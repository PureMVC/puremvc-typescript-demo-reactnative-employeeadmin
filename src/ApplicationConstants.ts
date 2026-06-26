//
//  ApplicationConstants.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Platform} from "react-native";

export class ApplicationConstants {
  static URL = Platform.OS === "android" ? "http://10.0.2.2/graphql" : "http://localhost/graphql";
}
