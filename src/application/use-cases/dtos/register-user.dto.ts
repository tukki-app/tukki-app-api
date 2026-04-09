import { IsString, IsEnum, Matches, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Matches(/^\+221[0-9]{9}$/, {
    message: 'Le numéro de téléphone doit être au format Sénégal (+221XXXXXXXXX)',
  })
  phone!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEnum(['PASSENGER', 'DRIVER'])
  role!: 'PASSENGER' | 'DRIVER';

  @IsString()
  @MinLength(6)
  password!: string;
}
