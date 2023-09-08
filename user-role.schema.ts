// api-authz/user-role/model

const userRole = {
  id: z.string({ description: 'User role ID' }),
  name: z.string({ description: 'User role name' }),
  createdAt: auditDateSchema,
  updatedAt: auditDateSchema,
  organizationId: z.string({ description: 'Organization ID' }).uuid().nullish(),
  permissions: permissionsJsonModel,
}

// ...

const createUserRoleInput = {
  name: userRoleNameSchema,
  organizationId: z.string().uuid().nullish(),
  permissions: permissionsJsonModel,
}

// ...

const userRoleReplySchemaExample: UserRoleOutputType = {
  id: 'd6f5e4d3-c2b1-42a0-9c68-31a3b4d5e6f7',
  name: 'USER_ROLE_SAMPLE_NAME',
  createdAt: new Date('2022-01-01'),
  updatedAt: new Date('2022-06-10'),
  organizationId: 'd6f5e4d3-c2b1-42a0-9c68-31a3b4d5e6f7',
  permissions: {
    STATS: { actions: { '*': true }, scopes: {} },
  },
}
