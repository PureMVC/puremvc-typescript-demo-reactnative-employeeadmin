//
//  DeptEnum.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

export const DeptEnum = {
  NONE_SELECTED: { name: "None Selected", id: -1 },
  ACCT: { name: "Accounting", id: 0 },
  SALES: { name: "Sales", id: 1 },
  PLANT: { name: "Plant", id: 2 },
  SHIPPING: { name: "Shipping", id: 3 },
  QC: { name: "Quality Control", id: 4 },
} as const;

export type DeptEnum = typeof DeptEnum[keyof typeof DeptEnum];
