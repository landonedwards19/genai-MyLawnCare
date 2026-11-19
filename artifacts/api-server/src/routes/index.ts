import { Router, type IRouter } from "express";
import healthRouter from "./health";
import yardRouter from "./yard";
import planRouter from "./plan";

const router: IRouter = Router();

router.use(healthRouter);
router.use(yardRouter);
router.use(planRouter);

export default router;
