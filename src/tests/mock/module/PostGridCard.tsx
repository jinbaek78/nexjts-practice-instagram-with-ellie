const mockedPostGridCard = jest.fn();
jest.mock('@/components/PostGridCard', () => mockedPostGridCard);
export default mockedPostGridCard;
