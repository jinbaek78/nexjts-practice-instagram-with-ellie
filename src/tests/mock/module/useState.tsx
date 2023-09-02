export const mockedUseState = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: (value: string): [string, jest.Mock<any, any, any>] => [
    value,
    mockedUseState,
  ],
}));
