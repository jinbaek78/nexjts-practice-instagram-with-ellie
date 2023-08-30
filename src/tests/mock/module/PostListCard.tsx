const mockedPostListCard = jest.fn();
jest.mock('@/components/PostListCard', () => mockedPostListCard);
export default mockedPostListCard;
