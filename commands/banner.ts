import chalk from 'chalk';
import * as figlet from 'figlet';

figlet.text(process.argv[2], (error: any, data: any) => {
    if (error) {
        return process.exit(1);
    }

    console.log(chalk.blue(data));
    return process.exit(0);
});
