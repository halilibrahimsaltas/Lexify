import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    IsDate,
  } from 'class-validator';
  import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
  } from 'typeorm';
  
  @Entity()
  @Unique(['email']) // Email tekrarlanmasın
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @IsNotEmpty()
    @IsString()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters.' })
    name: string;
  
    @Column()
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format.' })
    email: string;
  
    @Column()
    @IsNotEmpty()
    @IsString()
    @Length(8, 32, { message: 'Password must be 8-32 characters long.' })
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/, {
       message: 'Password must contain only letters, numbers, and allowed special characters.',
     })
    password: string;
  
    @CreateDateColumn()
    @IsDate()
    createdAt: Date;
  
    @UpdateDateColumn()
    @IsDate()
    updatedAt: Date;
  }