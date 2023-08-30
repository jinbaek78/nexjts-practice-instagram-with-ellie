const mockedActionBar = jest.fn();
jest.mock('@/components/ActionBar', () => mockedActionBar);
export default mockedActionBar;
