export type ProjectEnvironmentConfig = {
  // the starting port
  port: number;

  // timed otp / secured token expiration
  timeTokenExpiration: number;
  securedTokenExpiration: number;

  // graphql
  graphqlPlayground: boolean;
  graphqlSubscription: boolean;

  // redis
  redis?: {
    max: number;
    host: string;
    port: number;
    auth_pass?: string;
  };

  // database connection
  database?: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl?: string;
    logging?: boolean;
  };

  // testing for e2e / unit test
  testing: {
    database: {
      type: string;
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      ssl?: string;
      logging?: boolean;
    };
  };
};
