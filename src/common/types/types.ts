export enum UserRoles {
  user = 'user',
  admin = 'admin',
}

export enum UserGender {
  male = 'male',
  female = 'female',
}

export enum paymentMethodTypes {
  cash = 'cash',
  card = 'card',
}

export enum orderStatusTypes {
  pending = 'pending',
  placed = 'placed',
  delivering = 'delivering',
  delivered = 'delivered',
  cancelled = 'cancelled',
  rejected = 'rejected',
  paid = 'paid',
  refunded = 'refunded',
}

export enum TokenTypes {
  Bearer = 'Bearer',
  Admin = 'Admin',
}

export enum otpTypes {
  confirmation = 'confirmation',
  resetPassword = 'resetPassword',
  forgetPassword = 'forgetPassword',
}
