import { Router, type IRouter } from "express";
import { AnalyzeYardBody, AnalyzeYardResponse } from "@workspace/api-zod";
import { rateLimit } from "../middlewares/rateLimit";
import { analyzeYard, MAX_DESCRIPTION_CHARS, type YardInput } from "../lib/yardAnalysis";

const router: IRouter = Router();

const cap = (text: string) => text.slice(0, MAX_DESCRIPTION_CHARS);

router.post(
  "/analyze-yard",
  rateLimit({ max: 30, windowMs: 60 * 60 * 1000 }),
  async (req, res): Promise<void> => {
    const parsed = AnalyzeYardBody.safeParse(req.body);
    if (!parsed.success) {
      req.log.warn({ errors: parsed.error.message }, "analyze-yard: invalid request body");
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const input: YardInput = {
      zip: parsed.data.zip,
      grassType: parsed.data.grassType,
      currentDescription: cap(parsed.data.currentDescription),
      desiredDescription: cap(parsed.data.desiredDescription),
    };

    const result = AnalyzeYardResponse.parse(await analyzeYard(input, req.log));
    req.log.info({ request: input, response: result }, "analyze-yard");
    res.json(result);
  },
);

export default router;
