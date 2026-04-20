import { ServiceWithProps } from "../../utils/types";
import UserDAL from "../DAL/UserDAL";
import UrlDAL from "../DAL/UrlDAL";
import { generateShortCode } from "../../utils/shortCodeGenerator";
import { Url } from "../types/Url";

const createUrlService: ServiceWithProps<Url, { email: string; originalUrl: string; customCode?: string }> = async (
  payload,
) => {
  try {
    // Find user by email
    const user = await UserDAL.findOne({ where: { email: payload.email } });

    if (!user) {
      return {
        message: "User not found",
        status: 404,
      };
    }

    // Check if URL is valid
    try {
      new URL(payload.originalUrl);
    } catch {
      return {
        message: "Invalid URL format",
        status: 400,
      };
    }

    // Generate or use custom short code
    let shortCode = payload.customCode || generateShortCode(6);

    // Check if short code already exists (prevent hash collision)
    let existingUrl = await UrlDAL.findOne({ where: { shortCode } });
    let attempts = 0;
    const maxAttempts = 10;

    while (existingUrl && attempts < maxAttempts) {
      shortCode = generateShortCode(6);
      existingUrl = await UrlDAL.findOne({ where: { shortCode } });
      attempts++;
    }

    if (existingUrl) {
      return {
        message: "Failed to generate unique short code",
        status: 500,
      };
    }

    const url = UrlDAL.create({
      originalUrl: payload.originalUrl,
      shortCode,
      userId: user.id,
      isActive: true,
    });

    const savedUrl = await UrlDAL.save(url);

    return {
      message: "Short URL created successfully",
      status: 201,
      data: savedUrl,
    };
  } catch (error) {
    console.error("Error creating short URL:", error);
    return {
      message: "Error creating short URL",
      status: 500,
    };
  }
};

export default createUrlService;
