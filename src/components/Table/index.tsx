import TableHead from "../TableHead";
import TableRow from "../TableRow";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useGridStore } from "../../store/useGrid";

export default function Table() {
  const sensors = useSensors(useSensor(PointerSensor));
  const { columns, setColumns } = useGridStore();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = columns.findIndex((c) => c.id === active.id);
      const newIndex = columns.findIndex((c) => c.id === over.id);
      const newCols = arrayMove(columns, oldIndex, newIndex);
      setColumns(newCols);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={columns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <table className='border-collapse text-left'>
          <TableHead />
          <TableRow />
        </table>
      </SortableContext>
    </DndContext>
  );
}
