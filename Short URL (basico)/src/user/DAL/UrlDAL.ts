import { AppDataSource } from "../../data-source";
import { Url } from "../../db/emtity/Url";

const UrlDAL = AppDataSource.getRepository(Url);

export default UrlDAL;
