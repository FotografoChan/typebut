import prisma from '@typebot.io/lib/prisma'
import { env } from '@typebot.io/env'
import { CollaboratorsOnTypebots, User } from '@typebot.io/prisma'
import { Typebot } from '@typebot.io/schemas'

export const isReadTypebotForbidden = async (
  typebot: Pick<Typebot, 'workspaceId'> & {
    collaborators: Pick<CollaboratorsOnTypebots, 'userId'>[]
  },
  user: Pick<User, 'email' | 'id'>
) => {
  if (
    env.ADMIN_EMAIL === user.email ||
    typebot.collaborators.find(
      (collaborator) => collaborator.userId === user.id
    )
  )
    return false
  const memberInWorkspace = await prisma.memberInWorkspace.findFirst({
    where: {
      workspaceId: typebot.workspaceId,
      userId: user.id,
    },
  })
  return memberInWorkspace === null
}
