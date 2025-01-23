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
            throw new Error('no providers are available');
        }
        this.provider = providerFactory.getInstance('utp');
    }

    public async EODReport(token: string, params: EODReportRequest): Promise<any> {
        try {
            // Generate today's date dynamically
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
            return this.provider.dispatch('eod-report', {
                payload: {
                    request: {
                        from: params?.from || `${formattedDate}T00:00:00`,
                        to: params?.to || `${formattedDate}T23:00:00`,
                        isPageable: params?.isPageable,
                        size: params?.size,
                        page: params?.page,
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
    

    public async retrieveReport(token: string): Promise<any> {
        try {
            const reportData = [];
            let page = 1;
            const size = 50;
            let totalPages = 1;
            // body should be fetched from client
            while (page <= totalPages) {
                const report = await this.provider.dispatch('eod-report', {
                    payload: {
                        request : {
                            from: '2023-10-10T10:15:30',
                            to: '2024-12-20T10:15:30',
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
                content?.forEach(item => {
                    if (item.created) {
                        item.created = new Date(item.created).toLocaleString();
                    }
                    if (item.mobileNumber) {
                        reportData.push(item);
                    }
                });

                totalPages = report?.reportDetails?.totalPages;
                page++;
            }

            return reportData;
        } catch (error) {
            this.log.error('Failed to retrieve EOD reports', { error});
            throw new HttpError(400, 'Failed to retrieve EOD reports');
        }
    }
}
