import { scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { DeepPartial } from "typeorm";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../entities/User";
import { IUser } from "../types/user.type";
import { generateHash } from "../utils/generateHash";

const scrypt = promisify(_scrypt);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return done(null, false, { message: "user not found" });
        }

        const [salt, storedHash] = user.password.split(".");

        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if (storedHash === hash.toString("hex")) {
          return done(null, user);
        }
        return done(null, false, { message: "bad password" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  const tran = user as User;
  done(null, tran.id);
});

passport.deserializeUser((id: number, done) => {
  User.findOne({ where: { id } })
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error);
    });
});

export default class UserService {
  async singUp({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: IUser): Promise<User> {
    let resultSaltAndHash;
    if (password) {
      resultSaltAndHash = await generateHash(password);
    }
    const newUser: DeepPartial<User> = {
      firstName,
      lastName,
      phone,
      email,
      password: resultSaltAndHash,
    };

    const responce = User.create(newUser);
    await responce.save();

    return responce as User;
  }

  async getUser(id: number): Promise<User> {
    const [user] = await User.find({ where: { id } });
    if (!user) {
      throw new Error("user not found");
    }
    return user;
  }

  async updateUser(id: number, body: Partial<User>): Promise<User> {
    const [findUser] = await User.find({ where: { id } });

    Object.assign(findUser, body);
    return User.save(findUser);
  }
}
