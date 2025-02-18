import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AccessToken')
export class AccessTokenDto {
  @Field()
  accessToken: string;

  @Field()
  expiresIn: number;

  constructor(accessToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
  }
}
