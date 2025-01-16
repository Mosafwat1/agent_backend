import _ from 'lodash';
import { Service } from 'typedi';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { HttpError } from 'routing-controllers';
import { User } from '../../models/User';
import { AppDataSource } from '../../../../data-source';

@Service()
export class UserService {
    private readonly userRepository;
    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) {
        this.userRepository = AppDataSource.getRepository(User);
    }

    public async getUserByMobileNumber(mobileNumber: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { phoneNumber: mobileNumber} });
            return user;
        } catch (error) {
            this.log.error('Failed to fetch business id', { error});
            throw new HttpError(400, 'Failed to fetch business id');
        }
    }

    public getUserStatus(cardStatus: string): string {
        if (cardStatus === 'received') {
            return 'registered';
        }

        if (cardStatus === 'neutral') {
            return 'applied_for_card';
        }

        return cardStatus;
    }
}
