import { Plus } from "lucide-react";
import { useConfigStore } from "../../store/useConfig";
import { useGridStore } from "../../store/useGrid";

export default function Toolbar() {
  const { addRow } = useGridStore();
  const { fontSize, fontFamily, setFontSize, setFontFamily } = useConfigStore();

  return (
    <div className='bg-white border-b border-gray-200 px-6 py-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <button
            type='button'
            className='flex items-center justify-center gap-x-1 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'>
            <Plus size={16} />
            Thêm cột
          </button>
          <button
            type='button'
            className='flex items-center justify-center gap-x-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'
            onClick={addRow}>
            <Plus size={16} />
            Thêm dòng
          </button>
        </div>

        <div className='flex items-center space-x-4'>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[200px] p-2.5'>
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
          </select>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[200px] p-2.5'>
            <option value='SF Pro Display'>SF Pro Display</option>
            <option value='Arial'>Arial</option>
            <option value='Helvetica'>Helvetica</option>
            <option value='Times New Roman'>Times New Roman</option>
            <option value='Courier New'>Courier New</option>
          </select>
        </div>
      </div>
    </div>
  );
}
