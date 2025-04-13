import { ServeStaticModuleOptions } from "@nestjs/serve-static";
import { join } from "path";

export const ServeStaticConfig: ServeStaticModuleOptions = {
    rootPath: join(__dirname, '../..', 'uploads'),
    serveRoot: '/api/uploads'
}