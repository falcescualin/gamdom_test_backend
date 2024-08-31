import util from 'util';

import * as bcrypt from 'bcrypt-nodejs';
import { AllowNull, BeforeSave, BeforeUpdate, Column, DataType, Default, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

import { UIRoles, UIUser } from '@generated/data-contracts';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Default(UIRoles.USER)
  @Column(DataType.ENUM(...Object.values(UIRoles)))
  role!: UIRoles;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  favorites!: string[];

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  lastSignInAt!: Date;

  // Method to compare passwords
  async comparePassword(requestPassword: string): Promise<boolean> {
    return util.promisify(bcrypt.compare)(requestPassword, this.password);
  }

  // Hooks for hashing password before saving or updating
  @BeforeSave
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      const salt = await util.promisify(bcrypt.genSalt)(10);
      user.password = await new Promise<string>((resolve, reject) => {
        bcrypt.hash(user.password, salt, null, (err, hash) => {
          if (err) reject(err);
          resolve(hash);
        });
      });
    }
  }

  toJSON() {
    const values = super.toJSON();

    delete values.password;

    return values as UIUser;
  }
}

export default User;
