type Props = {
  text: string;
  onClick: () => void;
  red?: boolean;
  isLoading?: boolean;
};
export default function Button({ text, onClick, red, isLoading }: Props) {
  const RED_COLOR = isLoading ? 'bg-red-400' : 'bg-red-500';
  const SKY_COLOR = isLoading ? 'bg-sky-400' : 'bg-sky-500';
  return (
    <>
      <button
        onClick={onClick}
        className={` border-none rounded-md py-2 px-8 text-white font-bold leading-4 ${
          red ? RED_COLOR : SKY_COLOR
        }
        `}
      >
        {text}
      </button>
    </>
  );
}
{
}
