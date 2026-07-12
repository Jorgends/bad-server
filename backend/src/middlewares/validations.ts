import { Joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'

export const phoneRegExp = /^\+?[0-9\s()-]{5,30}$/
const safeFileNameRegExp = /^[^/\\]+$/

const MAX_EMAIL_LENGTH = 254
const MAX_PASSWORD_LENGTH = 128
const MAX_NAME_LENGTH = 30
const MAX_PHONE_LENGTH = 30
const MAX_ADDRESS_LENGTH = 200
const MAX_COMMENT_LENGTH = 500
const MAX_PRODUCT_TITLE_LENGTH = 30
const MAX_PRODUCT_CATEGORY_LENGTH = 50
const MAX_PRODUCT_DESCRIPTION_LENGTH = 1000
const MAX_FILE_NAME_LENGTH = 120
const MAX_ORDER_ITEMS = 50

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

// валидация id
export const validateOrderBody = celebrate({
    body: Joi.object()
        .keys({
            items: Joi.array()
                .items(
                    Joi.string().custom((value, helpers) => {
                        if (Types.ObjectId.isValid(value)) {
                            return value
                        }
                        return helpers.message({ custom: 'Невалидный id' })
                    })
                )
                .min(1)
                .max(MAX_ORDER_ITEMS)
                .required()
                .messages({
                    'array.empty': 'Не указаны товары',
                }),
            payment: Joi.string()
                .valid(...Object.values(PaymentType))
                .required()
                .messages({
                    'string.valid':
                        'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                    'string.empty': 'Не указан способ оплаты',
                }),
            email: Joi.string()
                .email()
                .max(MAX_EMAIL_LENGTH)
                .required()
                .messages({
                    'string.empty': 'Не указан email',
                }),
            phone: Joi.string()
                .max(MAX_PHONE_LENGTH)
                .required()
                .pattern(phoneRegExp)
                .messages({
                    'string.empty': 'Не указан телефон',
                }),
            address: Joi.string().max(MAX_ADDRESS_LENGTH).required().messages({
                'string.empty': 'Не указан адрес',
            }),
            total: Joi.number().min(0).max(100000000).required().messages({
                'string.empty': 'Не указана сумма заказа',
            }),
            comment: Joi.string().max(MAX_COMMENT_LENGTH).optional().allow(''),
        })
        .unknown(false),
})

// валидация товара.
// name и link - обязательные поля, name - от 2 до 30 символов, link - валидный url
export const validateProductBody = celebrate({
    body: Joi.object()
        .keys({
            title: Joi.string()
                .required()
                .min(2)
                .max(MAX_PRODUCT_TITLE_LENGTH)
                .messages({
                    'string.min': 'Минимальная длина поля "name" - 2',
                    'string.max': 'Максимальная длина поля "name" - 30',
                    'string.empty': 'Поле "title" должно быть заполнено',
                }),
            image: Joi.object().keys({
                fileName: Joi.string()
                    .max(MAX_FILE_NAME_LENGTH)
                    .pattern(safeFileNameRegExp)
                    .required(),
                originalName: Joi.string()
                    .max(MAX_FILE_NAME_LENGTH)
                    .pattern(safeFileNameRegExp)
                    .required(),
            }),
            category: Joi.string()
                .max(MAX_PRODUCT_CATEGORY_LENGTH)
                .required()
                .messages({
                    'string.empty': 'Поле "category" должно быть заполнено',
                }),
            description: Joi.string()
                .max(MAX_PRODUCT_DESCRIPTION_LENGTH)
                .required()
                .messages({
                    'string.empty': 'Поле "description" должно быть заполнено',
                }),
            price: Joi.number().min(0).max(100000000).allow(null),
        })
        .unknown(false),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object()
        .keys({
            title: Joi.string().min(2).max(MAX_PRODUCT_TITLE_LENGTH).messages({
                'string.min': 'Минимальная длина поля "name" - 2',
                'string.max': 'Максимальная длина поля "name" - 30',
            }),
            image: Joi.object().keys({
                fileName: Joi.string()
                    .max(MAX_FILE_NAME_LENGTH)
                    .pattern(safeFileNameRegExp)
                    .required(),
                originalName: Joi.string()
                    .max(MAX_FILE_NAME_LENGTH)
                    .pattern(safeFileNameRegExp)
                    .required(),
            }),
            category: Joi.string().max(MAX_PRODUCT_CATEGORY_LENGTH),
            description: Joi.string().max(MAX_PRODUCT_DESCRIPTION_LENGTH),
            price: Joi.number().min(0).max(100000000).allow(null),
        })
        .unknown(false),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object()
        .keys({
            name: Joi.string().min(2).max(MAX_NAME_LENGTH).messages({
                'string.min': 'Минимальная длина поля "name" - 2',
                'string.max': 'Максимальная длина поля "name" - 30',
            }),
            password: Joi.string()
                .min(6)
                .max(MAX_PASSWORD_LENGTH)
                .required()
                .messages({
                    'string.empty': 'Поле "password" должно быть заполнено',
                }),
            email: Joi.string()
                .required()
                .email()
                .max(MAX_EMAIL_LENGTH)
                .message('Поле "email" должно быть валидным email-адресом')
                .messages({
                    'string.empty': 'Поле "email" должно быть заполнено',
                }),
        })
        .unknown(false),
})

export const validateAuthentication = celebrate({
    body: Joi.object()
        .keys({
            email: Joi.string()
                .required()
                .email()
                .max(MAX_EMAIL_LENGTH)
                .message('Поле "email" должно быть валидным email-адресом')
                .messages({
                    'string.required': 'Поле "email" должно быть заполнено',
                }),
            password: Joi.string()
                .max(MAX_PASSWORD_LENGTH)
                .required()
                .messages({
                    'string.empty': 'Поле "password" должно быть заполнено',
                }),
        })
        .unknown(false),
})

export const validateCurrentUserBody = celebrate({
    body: Joi.object()
        .keys({
            name: Joi.string().min(2).max(MAX_NAME_LENGTH),
            email: Joi.string().email().max(MAX_EMAIL_LENGTH),
            phone: Joi.string().max(MAX_PHONE_LENGTH).pattern(phoneRegExp),
        })
        .min(1)
        .unknown(false),
})

export const validateOrderStatusBody = celebrate({
    body: Joi.object()
        .keys({
            status: Joi.string()
                .valid('cancelled', 'completed', 'new', 'delivering')
                .required(),
        })
        .unknown(false),
})
