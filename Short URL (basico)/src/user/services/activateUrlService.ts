import { ServiceWithProps } from "../../utils/types";
import UrlDAL from "../DAL/UrlDAL";
import { Url } from "../types/Url";

const activateUrlService: ServiceWithProps<Url, { urlId: number }> = async (payload) => {
  try {
    const url = await UrlDAL.findOne({ where: { id: payload.urlId } });

    if (!url) {
      return {
        message: "URL not found",
        status: 404,
      };
    }

    if (url.isActive) {
      return {
        message: "URL is already active",
        status: 400,
      };
    }

    url.isActive = true;
    const updatedUrl = await UrlDAL.save(url);

    return {
      message: "URL activated successfully",
      status: 200,
      data: updatedUrl,
    };
  } catch (error) {
    console.error("Error activating URL:", error);
    return {
      message: "Error activating URL",
      status: 500,
    };
  }
};

export default activateUrlService;
