import { Router, type IRouter } from "express";
import { GeneratePlanBody, GeneratePlanResponse } from "@workspace/api-zod";
import { lawnGuide } from "@workspace/lawn-guide";
import { rateLimit } from "../middlewares/rateLimit";
import { generateLawnPlan, type PlanInput } from "../lib/planGeneration";

const router: IRouter = Router();

const MAX_GOALS = 10;
const MAX_TEXT_CHARS = 300;
const cap = (text: string) => text.slice(0, MAX_TEXT_CHARS);

router.post(
  "/generate-plan",
  rateLimit({ max: 30, windowMs: 60 * 60 * 1000 }),
  async (req, res): Promise<void> => {
    const parsed = GeneratePlanBody.safeParse(req.body);
    if (!parsed.success) {
      req.log.warn({ errors: parsed.error.message }, "generate-plan: invalid request body");
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const body = parsed.data;

    if (!lawnGuide.grassTypes[body.grassType]) {
      res.status(400).json({ error: `Unknown grassType "${body.grassType}".` });
      return;
    }
    const region = lawnGuide.regions[body.zip.charAt(0)];
    if (!region || region.name !== body.region) {
      res.status(400).json({ error: `region must be "${region?.name}" for ZIP ${body.zip}.` });
      return;
    }
    if (Number.isNaN(Date.parse(body.today))) {
      res.status(400).json({ error: "today must be a real date (YYYY-MM-DD)." });
      return;
    }

    // One entry per issue key; keep the first.
    const seen = new Set<string>();
    const confirmedIssues = body.confirmedIssues
      .filter((i) => (seen.has(i.key) ? false : (seen.add(i.key), true)))
      .map((i) => ({ key: i.key, evidence: cap(i.evidence) }));

    const input: PlanInput = {
      zip: body.zip,
      grassType: body.grassType,
      confirmedIssues,
      goals: body.goals.slice(0, MAX_GOALS).map(cap),
      today: body.today,
    };

    const result = GeneratePlanResponse.parse(await generateLawnPlan(input, req.log));
    req.log.info({ request: input, response: result }, "generate-plan");
    res.json(result);
  },
);

export default router;
