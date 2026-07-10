import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const safeBaseDir = path.resolve(baseDir)
        const filePath = path.resolve(safeBaseDir, `.${req.path}`)

        if (
            filePath !== safeBaseDir &&
            !filePath.startsWith(`${safeBaseDir}${path.sep}`)
        ) {
            return next()
        }

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return next()
            }

            return fs.stat(filePath, (statError, stat) => {
                if (statError || !stat.isFile()) {
                    return next()
                }

                return res.sendFile(filePath, (sendFileError) => {
                    if (sendFileError) {
                        next(sendFileError)
                    }
                })
            })
        })
    }
}
