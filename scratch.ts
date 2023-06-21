import { PrismaClient } from '@prisma/client'
const data = require('./dbSource/stocks.json')

console.log(data[1].relativeChangeHistory)
