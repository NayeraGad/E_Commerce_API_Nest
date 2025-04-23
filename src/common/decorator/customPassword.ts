import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class customPasswordConstraint implements ValidatorConstraintInterface {
  validate(cPassword: string, args: ValidationArguments) {
    if (cPassword !== args.object[args.constraints[0]]) {
      return false;
    }

    return true;
  }
}

export function customPasswordDecorator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: ['password'],
      validator: customPasswordConstraint,
    });
  };
}
