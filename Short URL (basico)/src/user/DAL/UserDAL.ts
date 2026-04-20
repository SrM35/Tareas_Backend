import { AppDataSource } from "../../data-source";
import { User } from "../../db/emtity/User";

const UserDAL = AppDataSource.getRepository(User);

export default UserDAL;