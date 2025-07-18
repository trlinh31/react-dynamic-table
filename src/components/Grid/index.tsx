import Table from "../Table";
import Toolbar from "../Toolbar";

export default function Grid() {
  return (
    <div className='h-screen flex flex-col bg-gray-50'>
      <Toolbar />
      <div className='flex-1 overflow-auto p-6'>
        <div className='bg-white'>
          <div className='overflow-auto'>
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
}
