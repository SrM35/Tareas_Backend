import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Url } from "./Url";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255, nullable: false })
    name: string;

    @Column("varchar", { length: 255, nullable: false, unique: true })
    email: string;

    @Column("varchar", { length: 255 })
    password: string;

    @Column("boolean", { default: false })
    isVerified: boolean;

    @Column("varchar", { length: 255, nullable: true })
    verificationCode: string | null;

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @OneToMany(() => Url, (urls) => urls.user)
    urls: Url[];
}