import { Response, Request, NextFunction } from "express";
import passport from "passport";
import UserService from "../services/user.service";
import { AppError } from "../utils/appError";
import { createAndSendJWToken } from "../middlewares/auth.middleware";
import { io } from "../server";

export class UserController {
  constructor(private userService: UserService) {}

  async singUp(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.singUp(req.body);
      createAndSendJWToken(201, user, res);
    } catch (err) {
      return next(new AppError((err as Error).message, 404));
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate(
      "local",
      (err: Error, user: Express.User, info: { message: string }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }

        req.logIn(user, async (err) => {
          if (err) {
            return next(err);
          }
          createAndSendJWToken(201, user, res);
        });
      }
    )(req, res, next);
  }

  async signOut(_req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("jwt", "logout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      return next(new AppError((err as Error).message, 404));
    }
  }

  async getUser(req: Request<{ id: string }>, res: Response) {
    const user = await this.userService.getUser(+req.params.id);
    res.status(200).json({ user });
  }

  async updateUser(req: Request<{ id: string }>, res: Response) {
    await this.userService.updateUser(+req.params.id, req.body);
    io.emit("updateUser", { message: "User updated!" });
    res.status(201).json({ message: "success!" });
  }
}

const userController = new UserController(new UserService());
export default userController;
