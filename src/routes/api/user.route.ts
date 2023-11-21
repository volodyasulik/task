import { Router } from 'express';
import userController from '../../controllers/user.controller';
import { tryCatch } from '../../middlewares/tryCatch.middleware';
import { validateUserBody } from '../../middlewares/validator.middlewares';
import { Protect } from '../../middlewares/auth.middleware';

const router: Router = Router();

router.route('/users').post(validateUserBody, tryCatch(userController.singUp.bind(userController)));
router.route('/login').post(validateUserBody, tryCatch(userController.signIn.bind(userController)));
router.route('/signOut').get(tryCatch(userController.signOut.bind(userController)));

router.use(tryCatch(Protect));

router
  .route('/users/:id')
  .get(tryCatch(userController.getUser.bind(userController)))
  .put(validateUserBody, tryCatch(userController.updateUser.bind(userController)));

export default router;
