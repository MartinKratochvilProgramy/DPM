import { type NextApiRequest, type NextApiResponse } from 'next'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ManagementClient = require('auth0').ManagementClient
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const managementClient = new ManagementClient({
      domain: process.env.AUTH0_ISSUER_BASE_URL,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET
    })

    const { email, selectedCurrency } = JSON.parse(req.body)

    const metadata = {
      currency: selectedCurrency
    }

    managementClient.getUser({ email })
      .then((user: any) => {
        const userId = user[0].user_id

        managementClient.updateUser({ id: userId }, { user_metadata: metadata })
          .catch((error: any) => {
            console.error('Error updating user metadata:', error)
          })
      })
      .catch((error: any) => {
        console.error('Error retrieving user:', error)
      })

    res.json({ selectedCurrency })
  } catch (error) {
    console.log(error)
  }
};
