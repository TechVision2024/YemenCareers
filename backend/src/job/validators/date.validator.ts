import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsYYYYMMDD(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== 'string') return false;
                    const regex = /^\d{4}-\d{2}-\d{2}$/;
                    if (!regex.test(value)) return false;
                    const parts = value.split('-');
                    const year = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10);
                    const day = parseInt(parts[2], 10);
                    const date = new Date(year, month - 1, day);
                    return (
                        date.getFullYear() === year &&
                        date.getMonth() === month - 1 &&
                        date.getDate() === day &&
                        date > new Date()
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Date must be in YYYY-MM-DD format and it must be in the future!';
                },
            },
        });
    };
}