// eslint-disable-next-line @typescript-eslint/no-var-requires
const ManagementClient = require('auth0').ManagementClient
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export function updateUserMetadata (email: string, payload: any) {
  const managementClient = new ManagementClient({
    domain: process.env.AUTH0_ISSUER_BASE_URL,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET
  })

  managementClient.getUser({ email })
    .then((user: any) => {
      const userId = user[0].user_id

      managementClient.updateUser({ id: userId }, { user_metadata: payload })
        .then((updatedUser: any) => {
          console.log('User metadata updated:', email, updatedUser?.user_metadata)
        })
        .catch((error: any) => {
          console.error('Error updating user metadata:', error)
        })
    })
    .catch((error: any) => {
      console.error('Error retrieving user:', error)
    })
}
