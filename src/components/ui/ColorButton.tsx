type Props = {
  text: string;
  padding?: string;
  textSize?: string;
  onClick: () => void;
};

const BUTTON_CLASS = 'bg-white rounded-sm hover:opacity-90 transition-opacity';
export default function ColorButton({
  text,
  onClick,
  padding = 'p-[0.3rem]',
  textSize = 'text-base',
}: Props) {
  return (
    <div className="rounded-md bg-gradient-to-bl from-fuchsia-600 via-rose-500 to-amber-300 p-[0.15rem]">
      <button
        className={`${BUTTON_CLASS} ${padding} ${textSize}`}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}
