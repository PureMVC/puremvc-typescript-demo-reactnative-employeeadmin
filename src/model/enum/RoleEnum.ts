//
//  RoleEnum.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

export const RoleEnum = {
  ADMIN: { name: "Administrator", id: 0 },
  ACCT_PAY: { name: "Accounts Payable", id: 1 },
  ACCT_RCV: { name: "Accounts Receivable", id: 2 },
  EMP_BENEFITS: { name: "Employee Benefits", id: 3 },
  GEN_LEDGER: { name: "General Ledger", id: 4 },
  PAYROLL: { name: "Payroll", id: 5 },
  INVENTORY: { name: "Inventory", id: 6 },
  PRODUCTION: { name: "Production", id: 7 },
  QUALITY_CTL: { name: "Quality Control", id: 8 },
  SALES: { name: "Sales", id: 9 },
  ORDERS: { name: "Orders", id: 10 },
  CUSTOMERS: { name: "Customers", id: 11 },
  SHIPPING: { name: "Shipping", id: 12 },
  RETURNS: { name: "Returns", id: 13 },
} as const;

export type RoleEnum = typeof RoleEnum[keyof typeof RoleEnum];
