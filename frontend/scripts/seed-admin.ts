import { WorkOS } from '@workos-inc/node'
import { config } from 'dotenv'

// Load environment variables
config()

const workos = new WorkOS(process.env.WORKOS_API_KEY)

async function seedAdminUser() {
  const email = 'kasun@karapincha.io'
  const password = 'Admin123!@#456' // Strong password with min 10 chars

  try {
    // Check if user already exists
    const { data: existingUsers } = await workos.userManagement.listUsers({
      email
    })

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0]

      // Update to admin role if not already
      const currentRole = existingUser.metadata?.role
      if (currentRole !== 'admin') {
        await workos.userManagement.updateUser({
          userId: existingUser.id,
          metadata: {
            role: 'admin'
          }
        })
      }

      return
    }

    // Create new admin user
    await workos.userManagement.createUser({
      email,
      password,
      firstName: 'Kasun',
      lastName: 'Peiris',
      emailVerified: true,
      metadata: {
        role: 'admin'
      }
    })
  } catch {
    process.exit(1)
  }
}

seedAdminUser()
  .then(() => {
    process.exit(0)
  })
  .catch(() => {
    process.exit(1)
  })
