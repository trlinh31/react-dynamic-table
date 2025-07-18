import type { DataColumn } from "../../types/data.type";
import { useConfigStore } from "../../store/useConfig";

type Props = {
  column: DataColumn;
  onChange: (columnId: string, newValue: any) => void;
};

export default function ChildHeaderCell({ column, onChange }: Props) {
  const { fontSize, fontFamily } = useConfigStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    onChange(column.id, newValue);
  };

  return (
    <th
      className='px-4 py-2 border border-[#EEEEEF] text-[#8F97A3] font-medium'
      style={{ fontSize: `${fontSize}px`, fontFamily, width: column.width }}>
      <input type='text' value={column.name} onChange={handleChange} className='w-full border-none outline-none bg-transparent' maxLength={255} />
    </th>
  );
}
