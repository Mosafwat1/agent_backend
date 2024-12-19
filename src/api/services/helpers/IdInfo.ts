export const parseGender = (id: string): string => {
    const genderID = parseInt(id.substring(12, 13), 10);
    return genderID % 2 === 0 ? 'female' : 'male';
};

export const parsePlaceOfBirth = (id: string): string => {
    const placeMapping: { [key: string]: string } = {
        '01': 'القاهرة',
        '02': 'الإسكندرية',
        '03': 'بورسعيد',
        '04': 'السويس',
        '11': 'دمياط',
        '12': 'الدقهلية',
        '13': 'الشرقية',
        '14': 'القليوبية',
        '15': 'كفر الشيخ',
        '16': 'الغربية',
        '17': 'المنوفية',
        '18': 'البحيرة',
        '19': 'الإسماعيلية',
        '21': 'الجيزة',
        '22': 'بني سويف',
        '23': 'الفيوم',
        '24': 'المنيا',
        '25': 'أسيوط',
        '26': 'سوهاج',
        '27': 'قنا',
        '28': 'أسوان',
        '29': 'الأقصر',
        '31': 'البحر الأحمر',
        '32': 'الوادي الجديد',
        '33': 'مطروح',
        '34': 'شمال سيناء',
        '35': 'جنوب سيناء',
    };

    const govID = id.substring(7, 9);
    return placeMapping[govID] || 'خارج الجمهورية';
};

export const parseBirthDate = (id: string): string => {
    const centuryCode = id[0];
    let yearPrefix = '';
    if (centuryCode === '1') {
        yearPrefix = '18';
    } else if (centuryCode === '2') {
        yearPrefix = '19';
    } else {
        yearPrefix = '20';
    }

    const year = yearPrefix + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    return `${year}-${month}-${day}`;
};
