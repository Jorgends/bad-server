import { NextFunction, Request, Response } from 'express'
import { unlink } from 'fs/promises'
import { constants } from 'http2'
import sharp from 'sharp'
import BadRequestError from '../errors/bad-request-error'

const MIN_FILE_SIZE = 2 * 1024

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        if (req.file.size < MIN_FILE_SIZE) {
            await unlink(req.file.path)
            return next(new BadRequestError('Размер файла слишком мал'))
        }

        const metadata = await sharp(req.file.path).metadata()

        if (!metadata.format || !metadata.width || !metadata.height) {
            await unlink(req.file.path)
            return next(new BadRequestError('Некорректное изображение'))
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file.filename,
        })
    } catch (error) {
        await unlink(req.file.path).catch(() => undefined)
        return next(new BadRequestError('Некорректное изображение'))
    }
}

export default {}
