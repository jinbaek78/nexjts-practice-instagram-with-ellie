const mockedPostGrid = jest.fn();
jest.mock('@/components/PostGrid', () => mockedPostGrid);
export default mockedPostGrid;
