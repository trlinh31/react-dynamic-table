import { GripVertical } from "lucide-react";
import type { DataColumn } from "../../types/data.type";
import { useConfigStore } from "../../store/useConfig";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

type Props = {
  column: DataColumn;
  onChange: (columnId: string, newValue: any) => void;
};

export default function GroupHeaderCell({ column, onChange }: Props) {
  const { fontSize, fontFamily } = useConfigStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.id });
  const hasChildren = column.columns && !!column.columns.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    onChange(column.id, newValue);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  if (hasChildren) {
    return (
      <th
        ref={setNodeRef}
        colSpan={column.columns && column.columns.length}
        className='px-4 py-2 border border-[#EEEEEF] text-[#8F97A3] font-medium'
        style={{ fontSize: `${fontSize}px`, fontFamily, width: column.width, ...style }}>
        <div className='flex items-center justify-between gap-x-2'>
          <input
            type='text'
            value={column.headerGroup || column.name}
            onChange={handleChange}
            className='w-full border-none outline-none bg-transparent'
            maxLength={255}
          />
          <span {...attributes} {...listeners} className='cursor-grab'>
            <GripVertical size={16} />
          </span>
        </div>
      </th>
    );
  }

  return (
    <th
      ref={setNodeRef}
      rowSpan={2}
      className='px-4 py-2 border border-[#EEEEEF] text-[#8F97A3] font-medium'
      style={{ fontSize: `${fontSize}px`, fontFamily, width: column.width, ...style }}>
      <div className='flex items-center justify-between gap-x-2'>
        <input type='text' value={column.name} onChange={handleChange} className='w-full border-none outline-none bg-transparent' maxLength={255} />
        <span {...attributes} {...listeners} className='cursor-grab'>
          <GripVertical size={16} />
        </span>
      </div>
    </th>
  );
}
