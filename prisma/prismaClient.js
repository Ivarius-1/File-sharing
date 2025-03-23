const { PrismaClient } = require('@prisma/client'); // поменяй импорты на modulejs
const prisma = new PrismaClient();

module.exports = prisma;
