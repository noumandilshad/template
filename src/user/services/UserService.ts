import { inject, injectable } from 'inversify';
import { getLogger, Logger } from 'log4js';
import { Repository } from 'typeorm';
import { authTypes } from '../../auth/authTypes';
import { RegisterDto } from '../../auth/dtos/RegisterDto';
import { UserVerificationDto } from '../../auth/dtos/UserVerificationDto';
import { UserVerification } from '../../auth/models/UserVerfication';
import { ApiError } from '../../common/error/ApiError';
import { ApiErrorMessage } from '../../common/error/ApiErrorMessage';
import { RandomStringTypes } from '../../common/types/commonTypes';
// import { CommonService } from '../../common/utils/commonService';
import { User } from '../models/User';
import { userTypes } from '../userTypes';

@injectable()
export class UserService {
  private logger: Logger;

  // private commonService: CommonService;

  private userRepository: Repository<User>;

  private verificationRepository: Repository<UserVerification>;

  private verificationCodeExpiration: number;

  constructor(
    @inject(userTypes.UserRepository) userRepository: Repository<User>,
    @inject(authTypes.VerificationRepository) verificationRepository: Repository<UserVerification>,
    // @inject(CommonService) commonService: CommonService,
    @inject(authTypes.VerificationCodeExpiration) verificationCodeExpiration: number,
  ) {
    this.logger = getLogger();
    // this.commonService = commonService;
    this.userRepository = userRepository;
    this.verificationRepository = verificationRepository;
    this.verificationCodeExpiration = verificationCodeExpiration;
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    this.logger.info(`Creating a new user with email ${registerDto.email}`);

    if (await this.userRepository.findOne({ email: registerDto.email })) {
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.emailAlreadyInUse);
    }

    if (
      registerDto.phone &&
      (await this.userRepository.findOne({ phone: registerDto.phone }))
    ) {
      throw ApiError.fromApiErrorMessage(ApiErrorMessage.phoneAlreadyInUse);
    }

    try {
      const user = await this.userRepository.save(registerDto);

      const verificationCode = this.generateRandomString(
        5,
        RandomStringTypes.Numeric,
      );

      await this.verificationRepository.create({
        verificationCode,
        expiresAt: Date.now() + this.verificationCodeExpiration,
        userId: user.id.toString(),
      });

      this.logger.info(`Your verification code is ${verificationCode}`);

      this.logger.info(`New user with id ${user.id} was created`);
      return user;
    } catch (error: any) {
      throw ApiError.fromInternalServerError(error.message);
    }
  }

  async verifyUser(userVerificationDto: UserVerificationDto): Promise<User> {
    this.logger.info(`Verifying a user with verification code ${userVerificationDto.verificationCode}`);

    try {
      const userVerification = await
      this.verificationRepository.findOne(
        {
          userId: userVerificationDto.userId,
          verificationCode: userVerificationDto.verificationCode,
          isUsed: false,
        },
      );

      if (!userVerification) {
        throw ApiError.fromApiErrorMessage(ApiErrorMessage.invalidUserOrCode);
      }

      if (userVerification.isUsed) {
        throw ApiError.fromApiErrorMessage(ApiErrorMessage.codeUsed);
      }

      if (userVerification.expiresAt < Date.now()) {
        throw ApiError.fromApiErrorMessage(ApiErrorMessage.codeExpired);
      }

      await Promise.all([
        this.verificationRepository.update(
          {
            userId: userVerificationDto.userId,
            verificationCode: userVerificationDto.verificationCode,
            isUsed: false,
          },
          {
            isUsed: true,
          },
        ),
        this.userRepository.update({ id: userVerificationDto.userId }, { status: 'active' }),
      ]);

      const user = await this.userRepository.findOne({ id: userVerificationDto.userId });

      if (!user) {
        throw ApiError.fromApiErrorMessage(ApiErrorMessage.emailAlreadyInUse);
      }

      this.logger.info(`User ${userVerificationDto.userId} verified Successfully. `);

      return user;
    } catch (error: any) {
      throw ApiError.fromInternalServerError(error.message);
    }
  }

  public generateRandomString = (length: number, type: RandomStringTypes): string => {
    const stringType: number = type === RandomStringTypes.Numeric ? 10 : 36;
    return Math.random().toString(length).substr(2, stringType);
  };
}
