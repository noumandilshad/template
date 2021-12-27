export const authTypes = {
  VerificationRepository: Symbol.for('VerificationRepository'),
  AuthController: Symbol.for('AuthController'),
  RegisterService: Symbol.for('RegisterService'),
  TokenService: Symbol.for('TokenService'),
  AuthRouter: Symbol.for('AuthRouter'),
  PasswordService: Symbol.for('PasswordService'),
  RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),
  JwtAccessTokenExpiration: Symbol.for('JwtAccessTokenExpiration'),
  JwtSecret: Symbol.for('JwtSecret'),
  JwtRefreshTokenExpiration: Symbol.for('JwtRefreshTokenExpiration'),
  VerificationCodeExpiration: Symbol.for('VerificationCodeExpiration'),
};
