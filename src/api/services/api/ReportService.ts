import _ from 'lodash';
import { Service } from 'typedi';
import { env } from '../../../env';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { IProvider } from '../../wrappers/providers/IProvider';
import { ProviderFactory } from '../../wrappers/providers/handler/ProviderFactory';
import { HttpError } from 'routing-controllers';
import { EODReportRequest } from '../../../api/controllers/api/customer/requests/ReportRequests';

@Service()
export class ReportService {
    private readonly provider: IProvider;

    constructor(
        providerFactory: ProviderFactory,
        @Logger(__filename) private log: LoggerInterface
    ) {
        if (_.isNil(providerFactory)) {
            throw new Error('No providers are available');
        }
        this.provider = providerFactory.getInstance('utp');
    }

    /**
     * Fetches the EOD report for the given parameters.
     */
    public async EODReport(token: string, params: EODReportRequest): Promise<any> {
        try {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

            return await this.provider.dispatch('eod-report', {
                payload: {
                    request: {
                        from: params?.from || `${formattedDate}T00:00:00`,
                        to: params?.to || `${formattedDate}T23:59:59`,
                        isPageable: params?.isPageable || false,
                        size: params?.size || 50,
                        page: params?.page || 1,
                        sort_by: params?.sortBy || 'arabicName',
                        sort_direction: params?.sortDirection || 'ASC',
                    },
                    signature: env.providers.utp.signature,
                },
                headers: {
                    Authorization: token,
                },
            });
        } catch (error) {
            this.log.error('Failed to fetch EOD reports', { error });
            throw new HttpError(400, 'Failed to fetch EOD reports');
        }
    }

    /**
     * Retrieves the EOD report across all pages.
     */
    public async retrieveReport(token: string): Promise<any> {
        try {
            const reportData: any[] = [];
            let page = 1;
            const size = 50;
            let totalPages = 1;

            while (page <= totalPages) {
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

                const report = await this.provider.dispatch('eod-report', {
                    payload: {
                        request: {
                            from: `${formattedDate}T00:00:00`,
                            to: `${formattedDate}T23:59:59`,
                            isPageable: true,
                            size,
                            page,
                            sort_by: 'created',
                            sort_direction: 'ASC',
                        },
                        signature: env.providers.utp.signature,
                    },
                    headers: {
                        Authorization: token,
                    },
                });

                const content = report?.reportDetails?.content;
                if (content) {
                    content.forEach((item: any) => {
                        if (item.created) {
                            item.created = new Date(item.created).toLocaleString();
                        }
                        if (item.mobileNumber) {
                            reportData.push(item);
                        }
                    });
                }

                totalPages = report?.reportDetails?.totalPages || 1;
                page++;
            }

            return reportData;
        } catch (error) {
            this.log.error('Failed to retrieve EOD reports', { error });
            throw new HttpError(400, 'Failed to retrieve EOD reports');
        }
    }
}
