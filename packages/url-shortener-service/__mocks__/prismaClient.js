const { PrismaClient } = require('@prisma/client');

const mockPrisma = {
  url: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

PrismaClient.mockImplementation(() => mockPrisma);

module.exports = mockPrisma;