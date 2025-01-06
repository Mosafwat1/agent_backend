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

    public async fetchBusinessId(mobileNumber: string): Promise<string> {
        try {
            const user = await this.userRepository.findOne({ where: { phoneNumber: mobileNumber} });
            return user.referenceId;
        } catch (error) {
            this.log.error('Failed to fetch business id', { error});
            throw new HttpError(400, 'Failed to fetch business id');
        }
    }
}
