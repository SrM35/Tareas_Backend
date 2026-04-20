import { Url as UrlEntity } from "../../db/emtity/Url";

export type Url = UrlEntity;

export type createUrlDTO = Pick<Url, "originalUrl"> & { email: string; customCode?: string };

export type loginDTO = Pick<Url["user"], "email"> & { password: string };
