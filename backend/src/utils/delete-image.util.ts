import { Logger } from "@nestjs/common"
import { join } from "path";
import { promises as fsPromises } from 'fs';

export const deleteImage = async (path: string) => {
    const logger: Logger = new Logger('delete-image', {timestamp: true});
    try {
        // Delete the image if the register failed.
        await fsPromises.unlink(
            join(__dirname, '../..', path)
        );
    } catch (error) { 
        logger.error(error);
    }
}