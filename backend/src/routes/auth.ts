import { Router } from 'express'
import {
    validateAuthentication,
    validateCurrentUserBody,
    validateUserBody,
} from '../middlewares/validations'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import csrfProtection from '../middlewares/csrf'

const authRouter = Router()

authRouter.get('/user', auth, getCurrentUser)
authRouter.patch(
    '/me',
    auth,
    csrfProtection,
    validateCurrentUserBody,
    updateCurrentUser
)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.get('/token', refreshAccessToken)
authRouter.get('/logout', logout)
authRouter.post('/login', csrfProtection, validateAuthentication, login)
authRouter.post('/register', csrfProtection, validateUserBody, register)

export default authRouter
