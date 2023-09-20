const mockedUsePosts = jest.fn();
jest.mock('@/hooks/posts', () => mockedUsePosts);
export default mockedUsePosts;
