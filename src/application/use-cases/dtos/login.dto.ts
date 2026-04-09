import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\+221[0-9]{9}$/, {
    message: 'Le numéro de téléphone doit être au format Sénégal (+221XXXXXXXXX)',
  })
  phone!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
