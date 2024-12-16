import _ from 'lodash';
import { Service } from 'typedi';
import puppeteer from 'puppeteer';
import { compile } from 'handlebars';
import { promises as fs } from 'fs';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { HttpError } from 'routing-controllers';

@Service()
export class PdfService {
    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public async encodedPdf(filePath: string, data: any): Promise<any> {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
              });
            const page = await browser.newPage();
            const html = await this.renderTemplate(filePath, data);
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
            });

            await browser.close();
            return Buffer.from(pdfBuffer).toString('base64');
        } catch (error) {
            this.log.error('Failed to encode PDF', { error});
            throw new HttpError(400, 'Failed to encode PDF');
        }
    }

    private async renderTemplate(filePath: string, data: any): Promise <any> {
        const templateSource = await fs.readFile(filePath, 'utf-8');
        const template = compile(templateSource);
        return template({data});
    }
}
