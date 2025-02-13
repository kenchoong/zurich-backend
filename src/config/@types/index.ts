import { QueueOptions } from 'bull';
import { ProjectEnvironmentConfig } from './project';

export type ConfigEnvironmentType = {
  /**
   * =============================
   * SERVER SHARED ENVIRONMENT
   * =============================
   */
  environment: string;

  // google cloud storage
  gcs?: {
    bucket: string;
    projectId: string;
    keyFilename: string;
  };

  // admin jwt
  adminJwt: {
    publicKey: string;
    privateKey: string;
    refreshPublicKey: string;
    refreshPrivateKey: string;
    tokenExpiration: string | number;
    refreshTokenExpiration: string | number;
  };

  // jwt
  jwt: {
    publicKey: string;
    privateKey: string;
    refreshPublicKey: string;
    refreshPrivateKey: string;
    tokenExpiration: string | number;
    refreshTokenExpiration: string | number;
  };

  cache: {
    host: string;
    port: number;
    password: string;
    ttl: number;
  };

  batch: {
    interval: number;
    size: number;
  };

  isSentReportingEmail: boolean;
  // timed otp / secured token expiration
  timeTokenExpiration: number;
  securedTokenExpiration: number;

  // lightship configuration
  lightship?: number;

  // bull
  bull?: Omit<QueueOptions, 'createClient'>;

  transport: {
    port: number;
    host: string;
  };

  // queue job timeout number
  jobTimeout: number;

  // 2FA bypass pass code
  twoFAByPassPassword?: string;

  /**
   * =============================
   * SERVER PROJECT ENVIRONMENT
   * =============================
   * NOTE: Add more project according project setup
   */
  reporting: ProjectEnvironmentConfig;
};
