import * as bcrypt from 'bcryptjs';

export function hash(str: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(str, salt);
}

export async function compare(str1: string , str2: string): Promise<any> {
    return await bcrypt.compare(str1, str2);
}
