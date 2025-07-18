import { useConfigStore } from "../../store/useConfig";
import type { DataColumn } from "../../types/data.type";

type Props = {
  value: any;
  type: "text" | "number" | "checkbox" | "select" | "date" | "time" | "percentage" | "lookup" | "formula" | "nested";
  column: DataColumn;
  rowIndex: number;
  onChange: (rowIndex: number, columnId: string, newValue: any, parentId?: string) => void;
};

export default function TableCell({ value, type, column, rowIndex, onChange }: Props) {
  const { fontSize, fontFamily } = useConfigStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = type === "checkbox" && e.currentTarget instanceof HTMLInputElement ? e.currentTarget.checked : e.currentTarget.value;
    onChange(rowIndex, column.id, newValue, column?.parentId);
  };

  const renderCell = () => {
    switch (type) {
      case "checkbox":
        return (
          <input
            id={`${column.id}-${rowIndex}`}
            type='checkbox'
            checked={Boolean(value)}
            onChange={handleChange}
            readOnly={column.readOnly ?? false}
            className='w-4 h-4 bg-gray-100 border-gray-300 rounded-sm focus:ring-gray-800'
          />
        );
      case "select":
        return (
          <select
            id={`${column.id}-${rowIndex}`}
            value={value}
            onChange={handleChange}
            className='relative left-[-4px] bg-transparent border-none outline-none'>
            {column.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            id={`${column.id}-${rowIndex}`}
            type={type}
            value={value}
            onChange={handleChange}
            readOnly={column.readOnly ?? false}
            className='w-full border-none outline-none bg-transparent read-only:opacity-40'
          />
        );
    }
  };

  return (
    <td className={`px-4 py-2 border border-[#EEEEEF] text-[#8F97A3] font-medium`} style={{ fontSize: `${fontSize}px`, fontFamily }}>
      {renderCell()}
    </td>
  );
}
