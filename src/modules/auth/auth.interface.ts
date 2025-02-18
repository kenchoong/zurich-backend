export type AccessPlatformType = 'user' | 'admin-user';

/**
 * Access token context holds information that originally from token
 */
export type AccessTokenContext = {
  sub: string; // refer to unique user reference (referralCode)
  /**
   * refer to platform
   * business: refer to business owner portal
   * portal: refer to admin
   */
  aud: AccessPlatformType;
  iss: string; // issuer example default: zurich
};

/**
 * Access token payload used for token creation
 */
export type AccessTokenPayload = {
  reference?: string; // refer to unique user reference
  platform: AccessPlatformType;
};

export type UserEntity = {
  id: string;
  role: 'Admin' | 'User';
};

/**
 * Access token info holds information extracted from passport strategy (before & after)
 */
export type AccessTokenInfo = {
  user: UserEntity;
  token: AccessTokenContext;
};

export type AccessTokenPortalUser = {
  user: UserEntity;
  token: AccessTokenContext;
  identity: 'SUPERADMIN' | 'ADMIN_USER';
};
