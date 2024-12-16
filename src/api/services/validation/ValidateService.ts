import { validate } from 'class-validator';
import _ from 'lodash';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';

import { Logger } from '../../../lib/logger';

@Service()
export class ValidateService {
    private readonly log = new Logger(__filename);
    public async validateBody( body: object ): Promise<void> {
        const bodyValidation = await validate(body);

        if (!_.isEmpty(bodyValidation)) {
            const error = new BadRequestError();
            error.message = 'Invalid request body';
            this.log.error('[validateBody] Validation service errors', {error: { bodyValidation }});
            _.set(error, 'errors', bodyValidation);
            throw new Error(_.get(error, 'message'));
        }
    }

}
