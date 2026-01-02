import { type NextApiRequest, type NextApiResponse } from 'next';
import { updateAccount } from '@/utils/api/updateAccount';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // remove stock from db

  try {
    const { email } = req.body;

    const response = await updateAccount(email);

    res.json({ response });
  } catch (error) {
    console.log(error);
  }
}
