'use client'

import { useAuth } from '@workos-inc/authkit-nextjs/components'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { getInitials } from '@/utils/get-initials'

export const AppUser = () => {
  const { user } = useAuth()

  return (
    <Avatar className="size-10 border">
      <AvatarImage src={user?.profilePictureUrl || ''} alt={user?.firstName || user?.email || ''} />
      <AvatarFallback className="bg-background">
        {getInitials(user?.firstName || user?.email || '')}
      </AvatarFallback>
    </Avatar>
  )
}
