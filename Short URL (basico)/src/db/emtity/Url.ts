import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, Unique } from "typeorm";
import { User } from "./User";

@Entity()
@Unique(["shortCode"])
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 2048, nullable: false })
    originalUrl: string;

    @Column("varchar", { length: 20, nullable: false, unique: true })
    shortCode: string;

    @Column("int")
    userId: number;

    @Column("boolean", { default: true })
    isActive: boolean;

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column("int", { default: 0 })
    clickCount: number;

    @ManyToOne(() => User, (user) => user.urls)
    @JoinTable({
        name: "userId",
    })
    user: User;
}