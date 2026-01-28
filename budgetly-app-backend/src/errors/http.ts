import createError from '@fastify/error'

export const NotFoundError = createError('NOT_FOUND', '%s', 404)

export const BadRequestError = createError('BAD_REQUEST', '%s', 400)
