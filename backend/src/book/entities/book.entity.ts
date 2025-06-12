import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity("book")
export class Book{

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        type: "varchar",    
        length: 255,
        nullable: false
    })
    title: string;

    @Column({
        type: "varchar",    
        length: 255,
        nullable: false
    })
    author: string;

    @Column({
        type: "text",
        nullable: true
    })
    content: string;

    @Column({
        type: "varchar",    
        length: 255,
        nullable: true
    })
    coverImage: string;

    @Column({
        type: "varchar",    
        length: 255,
        nullable: true
    })
    filePath: string;

    @Column({
        type: "varchar",    
        length: 50,
        nullable: true
    })
    category: string;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        nullable: false
    })
    createdAt: Date;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        nullable: false
    })
    updatedAt: Date;
    



}