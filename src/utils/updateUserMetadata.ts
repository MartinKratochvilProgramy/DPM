// eslint-disable-next-line @typescript-eslint/no-var-requires
const ManagementClient = require('auth0').ManagementClient
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

function updateUserMetadata (email: string, payload: any) {
  const managementClient = new ManagementClient({
    domain: process.env.AUTH0_ISSUER_BASE_URL,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET
  })

  const userMetadata = 'null'

  managementClient.getUser({ email })
    .then((user: any) => {
      const userId = user[0].user_id
      console.log(user[0].user_metadata.currency)
    })
    .catch((error: any) => {
      console.error('Error retrieving user:', error)
    })

  return userMetadata
}

const payload = {
  foo: 'bar'
}

const metadata = updateUserMetadata('martvil96@gmail.com', payload)
console.log()
