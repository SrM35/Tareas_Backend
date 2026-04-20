import { ServiceWithProps } from "../../utils/types";
import UrlDAL from "../DAL/UrlDAL";
import { Url } from "../types/Url";

const deactivateUrlService: ServiceWithProps<Url, { urlId: number }> = async (payload) => {
  try {
    const url = await UrlDAL.findOne({ where: { id: payload.urlId } });

    if (!url) {
      return {
        message: "URL not found",
        status: 404,
      };
    }

    if (!url.isActive) {
      return {
        message: "URL is already deactivated",
        status: 400,
      };
    }

    url.isActive = false;
    const updatedUrl = await UrlDAL.save(url);

    return {
      message: "URL deactivated successfully",
      status: 200,
      data: updatedUrl,
    };
  } catch (error) {
    console.error("Error deactivating URL:", error);
    return {
      message: "Error deactivating URL",
      status: 500,
    };
  }
};

export default deactivateUrlService;
