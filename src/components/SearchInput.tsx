import { ChangeEvent, useState } from 'react';

type Props = {
  onChange: (query: string) => void;
};
export default function SearchInput({ onChange }: Props) {
  const [query, setQuery] = useState('');

  const handleQueryChange = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    setQuery(query);
    onChange(query);
  };

  return (
    <input
      className="w-full p-3 px-5 text-3xl border-2 border-neutral-300 outline-none"
      onChange={handleQueryChange}
      value={query}
      placeholder="Search for a username or name"
    />
  );
}
