import { Router, type IRouter } from "express";
import healthRouter from "./health";
import yardRouter from "./yard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(yardRouter);

export default router;
