import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('User') // table name
export class User {

    @PrimaryColumn()
    public id: number;

    @Column({ type: 'text' })
    public phoneNumber: string;

    @Column({ type: 'text' })
    public profileImage: string;

    @Column({ type: 'text' })
    public thumbnailProfileImage: string;

    @Column({ type: 'text' })
    public firstName: string;

    @Column({ type: 'text' })
    public lastName: string;

    @Column({ type: 'text' })
    public fullName: string;

    @Column({ type: 'text' })
    public email: string;

    @Column({ type: 'text' })
    public gender: string;

    @Column()
    public dateOfBirth: Date;

    @Column({ type: 'text' })
    public userName: string;

    @Column({ type: 'text' })
    public password: string;

    @Column()
    public pinCode: number;

    @Column()
    public clyncCardStatus: string;

    @Column()
    public isKYC: boolean;

    @Column({ type: 'text' })
    public referenceId: string;

    @Column({ type: 'text' })
    public wallpaper: string;

    @Column({ type: 'text' })
    public idCardFront: string;

    @Column({ type: 'text' })
    public idCardBack: string;

    @Column()
    public isSuspended: boolean;

    @Column()
    public hasNewSocialUpdate: boolean;

    @Column()
    public hasNewFinancialUpdate: boolean;

    @CreateDateColumn({ default: new Date() })
    public createdAt: Date;

    @UpdateDateColumn({ default: new Date() })
    public updatedAt: Date;

}
