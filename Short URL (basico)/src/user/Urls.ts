import express from "express";
import { Request, Response } from "express";
import { checkSchema } from "express-validator";
import CreateUrlSchema from "./schema/createUrlSchema";
import validateRequest from "../utils/validateRequest";
import createUrlService from "./services/createUrlService";
import resolveUrlService from "./services/resolveUrlService";
import deactivateUrlService from "./services/deactivateUrlService";
import activateUrlService from "./services/activateUrlService";

const Urls = express.Router();

Urls.use(express.json());

// 4. Create Short URL - POST /urls
Urls.post(
  "/",
  checkSchema(CreateUrlSchema),
  validateRequest,
  async (req: Request, res: Response) => {
    const { status, ...rest } = await createUrlService(req.body);
    res.status(status).json(rest);
  }
);

// 5. Resolve Short URL - GET /url/:shortCode
Urls.get(
  "/:shortCode",
  async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;
    const response = await resolveUrlService({ shortCode });

    if (response.status === 200 && response.data) {
      // Redirect to original URL
      return res.redirect(301, response.data.originalUrl);
    }

    const { status, ...rest } = response;
    res.status(status).json(rest);
  }
);

// 6. Deactivate URL - PUT /urls/:id/deactivate
Urls.put(
  "/:id/deactivate",
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, ...rest } = await deactivateUrlService({ urlId: Number(id) });
    res.status(status).json(rest);
  }
);

// 7. Activate URL - PUT /urls/:id/activate
Urls.put(
  "/:id/activate",
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, ...rest } = await activateUrlService({ urlId: Number(id) });
    res.status(status).json(rest);
  }
);

export default Urls;
