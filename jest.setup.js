jest.mock('winston');
jest.mock('@logger/index', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    silly: jest.fn(),
    warn: jest.fn(),
  },
}));
