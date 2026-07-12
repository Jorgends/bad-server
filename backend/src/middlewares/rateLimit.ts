import { NextFunction, Request, Response } from 'express'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 50

type RateLimitEntry = {
    count: number
    resetAt: number
}

const requests = new Map<string, RateLimitEntry>()

export default function rateLimit(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const now = Date.now()
    const key = req.ip || req.socket.remoteAddress || 'unknown'
    const current = requests.get(key)

    if (!current || current.resetAt <= now) {
        const resetAt = now + WINDOW_MS
        requests.set(key, { count: 1, resetAt })
        res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS))
        res.setHeader('X-RateLimit-Remaining', String(MAX_REQUESTS - 1))
        res.setHeader('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)))
        return next()
    }

    current.count += 1
    const remaining = Math.max(MAX_REQUESTS - current.count, 0)

    res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS))
    res.setHeader('X-RateLimit-Remaining', String(remaining))
    res.setHeader(
        'X-RateLimit-Reset',
        String(Math.ceil(current.resetAt / 1000))
    )

    if (current.count > MAX_REQUESTS) {
        const retryAfter = Math.ceil((current.resetAt - now) / 1000)
        res.setHeader('Retry-After', String(retryAfter))
        return res.status(429).send({ message: 'Слишком много запросов' })
    }

    return next()
}
