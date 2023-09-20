const mockedPostDetail = jest.fn();
jest.mock('@/components/PostDetail', () => mockedPostDetail);
export default mockedPostDetail;
