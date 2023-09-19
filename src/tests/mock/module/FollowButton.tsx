const mockedFollowButton = jest.fn();
jest.mock('@/components/FollowButton', () => mockedFollowButton);
export default mockedFollowButton;
