import { type NextApiRequest, type NextApiResponse } from 'next';
import { getProviders } from 'next-auth/react';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const providers = await getProviders();

  res.status(200).json(providers);
}
