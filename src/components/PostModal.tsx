import { CloseIcon } from './ui/icons';

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};
export default function PostModal({ children, onClose }: Props) {
  return (
    <section
      className="fixed top-0 left-0 flex flex-col justify-center items-center w-full h-full z-50 bg-neutral-900/70"
      data-testid="modalSection"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <button
        className="fixed top-0 right-0 p-8 text-white"
        onClick={() => onClose()}
      >
        <CloseIcon />
      </button>
      <div
        className="bg-white w-4/5 h-3/5 max-w-7xl"
        data-testid="childrenSection"
      >
        {children}
      </div>
    </section>
  );
}
