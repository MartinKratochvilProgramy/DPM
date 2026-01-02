import { type NextApiRequest, type NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface Inflation {
  date: Date;
  value: number;
}

export interface InflationAdjustedValues {
  dates: Date[];
  values: number[];
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;

    const relativeChange = await prisma.relativeChange.findUnique({
      where: {
        email,
      },
    });

    const inflation = await prisma.inflation.findMany({
      select: {
        date: true,
        value: true,
      },
    });

    if (relativeChange !== null) {
      const inflationAdjustedValues = getInflationAdjustedChange(
        relativeChange,
        inflation,
      );

      res.json({
        dates: relativeChange.relativeChangeDates,
        values: relativeChange.relativeChangeValues,
        inflationAdjustedValues,
      });
    } else {
      res.json({ dates: [], values: [] });
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}

function getInflationAdjustedChange(
  relativeChange: {
    relativeChangeValues: number[];
    relativeChangeDates: Date[];
  },
  inflation: Inflation[],
): InflationAdjustedValues {
  // calculate real return using (1 + return) / (1 + inflation) - 1
  // return is the monthly diff in relative change

  const inflationAdjustedValues: InflationAdjustedValues = {
    dates: [],
    values: [],
  };

  inflationAdjustedValues.dates.push(relativeChange?.relativeChangeDates[0]);
  inflationAdjustedValues.values.push(0);

  let previousMonth: null | number = null;
  let previousRealChange: null | number = 0;
  let previousAdjustedChange: null | number = 0;
  let inflationValue: number = 0;

  for (let i = 0; i < relativeChange?.relativeChangeDates.length; i++) {
    const date = relativeChange?.relativeChangeDates[i];
    const currentMonth = date.getMonth();
    const currentValue = (relativeChange?.relativeChangeValues[i] - 1) * 100;

    // get current change in %
    const inflationAdjustedValue: number =
      previousAdjustedChange +
      ((1 + (currentValue - previousRealChange) / 100) /
        (1 + inflationValue / 100) -
        1) *
        100;

    if (currentMonth !== previousMonth && i > 0) {
      // if month flips to new one, update prev change values
      previousMonth = currentMonth;

      const currentInflation = inflation.find(
        (e) =>
          e.date.getMonth() === date.getMonth() &&
          e.date.getFullYear() === date.getFullYear(),
      );
      inflationValue = currentInflation?.value ?? 0;

      previousAdjustedChange = inflationAdjustedValue;
      previousRealChange = currentValue;
    }

    inflationAdjustedValues.dates.push(relativeChange?.relativeChangeDates[i]);
    inflationAdjustedValues.values.push(inflationAdjustedValue);
  }

  return inflationAdjustedValues;
}
