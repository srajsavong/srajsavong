// common/models/permissions.ts


import { ZodSchema, z } from 'zod'

const actionsKeys = z.enum(['read', 'edit', '*'])

const scopesKeys = z.enum([
  'STATS',
  'POS_CONFIG',
  'THIRD_PARTIES',
  'BOOKING',
  'CUSTOMERS',
  'USER_ADMIN',
  'ORG_ADMIN',
  '*',
])

const actionModel = z.record(actionsKeys, z.boolean())

const BaseScopeSchema: ZodSchema<BaseScope> = z.lazy(() =>
  z.object({
    actions: actionModel,
    scopes: z.record(scopesKeys, BaseScopeSchema).optional(),
  }),
)

const PermissionsSchema = z.record(scopesKeys, BaseScopeSchema)

export const permissionsJsonModel = z.record(scopesKeys, BaseScopeSchema)

type BaseScope = {
  actions: z.infer<typeof actionModel>
  scopes?: z.infer<typeof PermissionsSchema>
}
