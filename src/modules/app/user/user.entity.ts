import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt, IsPhoneNumber, IsString, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  @Column({ default: '' })
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  @Column()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(2, 255)
  @Column()
  name: string;

  @ApiProperty()
  @IsString()
  @Length(12, 255)
  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @IsString()
  @Column()
  avatar: string;

  @ApiProperty()
  @IsInt()
  @Column({ default: 0 })
  quota: number;

  // @ApiProperty()
  // @Column({
  //   type: 'timestamp',
  //   default: () => `CURRENT_TIMESTAMP + INTERVAL 1 YEAR`,
  // })
  // expiredAt: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
