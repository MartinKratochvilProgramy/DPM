import { type NextApiRequest, type NextApiResponse } from 'next'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ManagementClient = require('auth0').ManagementClient
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body

    const managementClient = new ManagementClient({
      domain: process.env.AUTH0_ISSUER_BASE_URL,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET
    })

    managementClient.getUser({ email })
      .then((user: any) => {
        const currency = user[0].user_metadata.currency
        res.json({ currency })
      })
      .catch((error: any) => {
        console.error('Error retrieving user:', error)
      })
  } catch (error) {
    console.log(error)
  }
};
