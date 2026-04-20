import { ServiceWithProps } from "../../utils/types";
import UrlDAL from "../DAL/UrlDAL";
import { Url } from "../types/Url";

const resolveUrlService: ServiceWithProps<Url, { shortCode: string }> = async (payload) => {
  try {
    const url = await UrlDAL.findOne({ where: { shortCode: payload.shortCode } });

    if (!url) {
      return {
        message: "Short URL not found",
        status: 404,
      };
    }

    if (!url.isActive) {
      return {
        message: "This short URL has been deactivated",
        status: 410,
      };
    }

    url.clickCount += 1;
    await UrlDAL.save(url);

    return {
      message: "Short URL resolved successfully",
      status: 200,
      data: url,
    };
  } catch (error) {
    console.error("Error resolving short URL:", error);
    return {
      message: "Error resolving short URL",
      status: 500,
    };
  }
};

export default resolveUrlService;
