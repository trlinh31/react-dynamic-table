import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
  Download,
  Upload,
  Settings,
  Calculator,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const DynamicFormBuilder = () => {
  // Form Meta State
  const [formMeta, setFormMeta] = useState({
    name: "New Form",
    code: "FORM_001",
    processSteps: ["Step 1"],
    version: "1.0",
    creator: "Admin",
    department: "IT",
    createdAt: new Date().toISOString(),
    isDraft: true,
  });

  // Grid State
  const [columns, setColumns] = useState([
    {
      id: "col1",
      name: "Item",
      type: "Text",
      width: 150,
      required: false,
      readOnly: false,
      visible: true,
      order: 0,
    },
    {
      id: "col2",
      name: "Quantity",
      type: "Number",
      width: 120,
      required: true,
      readOnly: false,
      visible: true,
      order: 1,
    },
    {
      id: "col3",
      name: "Price",
      type: "Decimal",
      width: 120,
      required: true,
      readOnly: false,
      visible: true,
      order: 2,
    },
    {
      id: "col4",
      name: "Total",
      type: "Number",
      width: 120,
      required: false,
      readOnly: true,
      visible: true,
      order: 3,
      formula: "col2 * col3",
    },
  ]);

  const [rows, setRows] = useState([
    {
      id: "row1",
      parentId: null,
      level: 0,
      expanded: true,
      highlight: false,
      data: { col1: "Laptop", col2: 2, col3: 999.99, col4: 1999.98 },
    },
    {
      id: "row2",
      parentId: null,
      level: 0,
      expanded: true,
      highlight: false,
      data: { col1: "Mouse", col2: 3, col3: 25.0, col4: 75.0 },
    },
  ]);

  // UI State
  const [isDesignMode, setIsDesignMode] = useState(true);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [resizingColumn, setResizingColumn] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showColumnEditor, setShowColumnEditor] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [frozenColumns, setFrozenColumns] = useState(0);
  const [frozenRows, setFrozenRows] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState("Arial");

  // Refs
  const tableRef = useRef(null);
  const resizeRef = useRef(null);

  // Column Types
  const columnTypes = ["Text", "Number", "Integer", "Decimal", "Date", "Time", "Percentage", "Droplist", "Checkbox", "Binding"];

  // Utility Functions
  const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  // Column Management
  const addColumn = () => {
    const newColumn = {
      id: generateId(),
      name: `Column ${columns.length + 1}`,
      type: "Text",
      width: 150,
      required: false,
      readOnly: false,
      visible: true,
      order: columns.length,
    };
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter((col) => col.id !== columnId));
    setRows(
      rows.map((row) => ({
        ...row,
        data: Object.fromEntries(Object.entries(row.data).filter(([key]) => key !== columnId)),
      }))
    );
  };

  const updateColumn = (columnId, updates) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, ...updates } : col)));
  };

  const reorderColumns = (dragIndex, hoverIndex) => {
    const newColumns = [...columns];
    const draggedCol = newColumns[dragIndex];
    newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, draggedCol);

    newColumns.forEach((col, index) => {
      col.order = index;
    });

    setColumns(newColumns);
  };

  // Row Management
  const addRow = (parentId = null) => {
    const parentRow = parentId ? rows.find((r) => r.id === parentId) : null;
    const newRow = {
      id: generateId(),
      parentId,
      level: parentRow ? parentRow.level + 1 : 0,
      expanded: true,
      highlight: false,
      data: {},
    };

    sortedColumns.forEach((col) => {
      newRow.data[col.id] = col.type === "Checkbox" ? false : "";
    });

    setRows([...rows, newRow]);
  };

  const deleteRow = (rowId) => {
    const deleteRecursive = (id) => {
      const children = rows.filter((r) => r.parentId === id);
      children.forEach((child) => deleteRecursive(child.id));
      return rows.filter((r) => r.id !== id && r.parentId !== id);
    };
    setRows(deleteRecursive(rowId));
  };

  const updateRowData = (rowId, columnId, value) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          const newData = { ...row.data, [columnId]: value };

          // Calculate formulas
          const updatedData = calculateFormulas(newData);

          return { ...row, data: updatedData };
        }
        return row;
      })
    );
  };

  const toggleRowExpansion = (rowId) => {
    setRows(rows.map((row) => (row.id === rowId ? { ...row, expanded: !row.expanded } : row)));
  };

  // Formula Calculation
  const calculateFormulas = (rowData) => {
    const newData = { ...rowData };

    sortedColumns.forEach((col) => {
      if (col.formula) {
        try {
          let formula = col.formula;

          // Replace column references with values
          sortedColumns.forEach((refCol) => {
            const value = newData[refCol.id] || 0;
            formula = formula.replace(new RegExp(`\\b${refCol.id}\\b`, "g"), value);
          });

          // Basic math evaluation (simplified)
          const result = eval(formula);
          newData[col.id] = isNaN(result) ? 0 : result;
        } catch (e) {
          newData[col.id] = 0;
        }
      }
    });

    return newData;
  };

  // Drag and Drop
  const handleColumnDragStart = (e, columnIndex) => {
    setDraggedColumn(columnIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e) => {
    e.preventDefault();
  };

  const handleColumnDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedColumn !== null && draggedColumn !== targetIndex) {
      reorderColumns(draggedColumn, targetIndex);
    }
    setDraggedColumn(null);
  };

  // Column Resizing
  const handleResizeStart = (e, columnId) => {
    setResizingColumn(columnId);
    resizeRef.current = {
      startX: e.clientX,
      startWidth: columns.find((col) => col.id === columnId).width,
    };
  };

  const handleResizeMove = useCallback(
    (e) => {
      if (resizingColumn && resizeRef.current) {
        const diff = e.clientX - resizeRef.current.startX;
        const newWidth = Math.max(50, resizeRef.current.startWidth + diff);

        updateColumn(resizingColumn, { width: newWidth });
      }
    },
    [resizingColumn]
  );

  const handleResizeEnd = () => {
    setResizingColumn(null);
  };

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);

      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [resizingColumn, handleResizeMove]);

  // Export/Import
  const exportToExcel = () => {
    const csvContent = [
      sortedColumns.map((col) => col.name).join(","),
      ...rows.map((row) => sortedColumns.map((col) => row.data[col.id] || "").join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formMeta.name}_${formMeta.version}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split("\n");
        const headers = lines[0].split(",");

        // Create columns from headers
        const newColumns = headers.map((header, index) => ({
          id: `col_${index}`,
          name: header.trim(),
          type: "Text",
          width: 150,
          required: false,
          readOnly: false,
          visible: true,
          order: index,
        }));

        // Create rows from data
        const newRows = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line, index) => {
            const values = line.split(",");
            const data = {};
            newColumns.forEach((col, colIndex) => {
              data[col.id] = values[colIndex] || "";
            });

            return {
              id: `row_${index}`,
              parentId: null,
              level: 0,
              expanded: true,
              highlight: false,
              data,
            };
          });

        setColumns(newColumns);
        setRows(newRows);
      };
      reader.readAsText(file);
    }
  };

  // Column Editor Component
  const ColumnEditor = ({ column, onSave, onCancel }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto'>
        <h3 className='text-lg font-semibold mb-4'>Edit Column</h3>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Column Name</label>
            <input
              type='text'
              value={column.name}
              onChange={(e) => updateColumn(column.id, { name: e.target.value })}
              className='w-full border rounded px-3 py-2'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Data Type</label>
            <select
              value={column.type}
              onChange={(e) => updateColumn(column.id, { type: e.target.value })}
              className='w-full border rounded px-3 py-2'>
              {columnTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Width (px)</label>
            <input
              type='number'
              value={column.width}
              onChange={(e) => updateColumn(column.id, { width: parseInt(e.target.value) })}
              className='w-full border rounded px-3 py-2'
            />
          </div>

          <div className='flex items-center space-x-4'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={column.required}
                onChange={(e) => updateColumn(column.id, { required: e.target.checked })}
                className='mr-2'
              />
              Required
            </label>

            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={column.readOnly}
                onChange={(e) => updateColumn(column.id, { readOnly: e.target.checked })}
                className='mr-2'
              />
              Read Only
            </label>

            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={column.visible}
                onChange={(e) => updateColumn(column.id, { visible: e.target.checked })}
                className='mr-2'
              />
              Visible
            </label>
          </div>

          {column.type === "Number" && (
            <div>
              <label className='block text-sm font-medium mb-1'>Formula</label>
              <input
                type='text'
                value={column.formula || ""}
                onChange={(e) => updateColumn(column.id, { formula: e.target.value })}
                placeholder='e.g., col2 * col3'
                className='w-full border rounded px-3 py-2'
              />
            </div>
          )}
        </div>

        <div className='flex justify-end space-x-2 mt-6'>
          <button onClick={onCancel} className='px-4 py-2 text-gray-600 border rounded hover:bg-gray-50'>
            Cancel
          </button>
          <button onClick={onSave} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // Cell Renderer
  const renderCell = (row, column) => {
    const value = row.data[column.id] || "";
    const isEditable = !column.readOnly && !isDesignMode;

    if (column.type === "Checkbox") {
      return (
        <input
          type='checkbox'
          checked={Boolean(value)}
          onChange={(e) => updateRowData(row.id, column.id, e.target.checked)}
          disabled={!isEditable}
          className='mx-auto'
        />
      );
    }

    if (isEditable) {
      return (
        <input
          type={column.type === "Number" || column.type === "Integer" || column.type === "Decimal" ? "number" : "text"}
          value={value}
          onChange={(e) => updateRowData(row.id, column.id, e.target.value)}
          className='w-full border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1'
          style={{ fontSize: `${fontSize}px`, fontFamily }}
        />
      );
    }

    return <span style={{ fontSize: `${fontSize}px`, fontFamily }}>{column.type === "Percentage" ? `${value}%` : value}</span>;
  };

  // Get visible rows (considering expansion)
  const getVisibleRows = () => {
    const visible = [];

    const addRowAndChildren = (row) => {
      visible.push(row);
      if (row.expanded) {
        const children = rows.filter((r) => r.parentId === row.id);
        children.forEach(addRowAndChildren);
      }
    };

    rows.filter((row) => row.parentId === null).forEach(addRowAndChildren);
    return visible;
  };

  const visibleRows = getVisibleRows();

  return (
    <div className='h-screen flex flex-col bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-2xl font-bold'>{formMeta.name}</h1>
            <span className='text-sm text-gray-500'>v{formMeta.version}</span>
            <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm'>{formMeta.isDraft ? "Draft" : "Published"}</span>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setIsDesignMode(!isDesignMode)}
              className={`px-4 py-2 rounded ${isDesignMode ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}>
              {isDesignMode ? "Design Mode" : "Preview Mode"}
            </button>

            <button onClick={exportToExcel} className='p-2 text-gray-600 hover:text-gray-800' title='Export to Excel'>
              <Download size={20} />
            </button>

            <label className='p-2 text-gray-600 hover:text-gray-800 cursor-pointer' title='Import from Excel'>
              <Upload size={20} />
              <input type='file' accept='.csv' onChange={handleFileImport} className='hidden' />
            </label>

            <button onClick={() => setShowCalculator(!showCalculator)} className='p-2 text-gray-600 hover:text-gray-800' title='Calculator'>
              <Calculator size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {isDesignMode && (
        <div className='bg-white border-b px-6 py-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button onClick={addColumn} className='flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                <Plus size={16} />
                <span>Add Column</span>
              </button>

              <button onClick={() => addRow()} className='flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
                <Plus size={16} />
                <span>Add Row</span>
              </button>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <label className='text-sm'>Font Size:</label>
                <select value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className='border rounded px-2 py-1'>
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                </select>
              </div>

              <div className='flex items-center space-x-2'>
                <label className='text-sm'>Font:</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className='border rounded px-2 py-1'>
                  <option value='Arial'>Arial</option>
                  <option value='Helvetica'>Helvetica</option>
                  <option value='Times New Roman'>Times New Roman</option>
                  <option value='Courier New'>Courier New</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='flex-1 overflow-auto p-6'>
        <div className='bg-white rounded-lg shadow-sm border'>
          {/* Table Container */}
          <div className='overflow-auto'>
            <table ref={tableRef} className='w-full border-collapse' style={{ fontSize: `${fontSize}px`, fontFamily }}>
              <thead>
                <tr className='bg-gray-50'>
                  {isDesignMode && (
                    <th className='border p-2 w-12 text-center'>
                      <Settings size={16} />
                    </th>
                  )}

                  {sortedColumns
                    .filter((col) => col.visible)
                    .map((column, index) => (
                      <th
                        key={column.id}
                        className={`border p-2 bg-gray-50 relative ${index < frozenColumns ? "sticky left-0 z-10" : ""}`}
                        style={{
                          width: `${column.width}px`,
                          minWidth: `${column.width}px`,
                          left: index < frozenColumns ? `${sortedColumns.slice(0, index).reduce((sum, col) => sum + col.width, 0)}px` : "auto",
                        }}
                        draggable={isDesignMode}
                        onDragStart={(e) => handleColumnDragStart(e, index)}
                        onDragOver={handleColumnDragOver}
                        onDrop={(e) => handleColumnDrop(e, index)}>
                        <div className='flex items-center justify-between'>
                          <span className={column.required ? "text-red-600" : ""}>
                            {column.name}
                            {column.required && " *"}
                          </span>

                          {isDesignMode && (
                            <div className='flex items-center space-x-1'>
                              <button
                                onClick={() => {
                                  setEditingColumn(column);
                                  setShowColumnEditor(true);
                                }}
                                className='p-1 text-gray-600 hover:text-gray-800'>
                                <Edit2 size={14} />
                              </button>

                              <button onClick={() => deleteColumn(column.id)} className='p-1 text-red-600 hover:text-red-800'>
                                <Trash2 size={14} />
                              </button>

                              <div
                                className='cursor-col-resize p-1 text-gray-400 hover:text-gray-600'
                                onMouseDown={(e) => handleResizeStart(e, column.id)}>
                                <GripVertical size={14} />
                              </div>
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row, rowIndex) => (
                  <tr key={row.id} className={`${row.highlight ? "bg-yellow-50" : ""} hover:bg-gray-50`}>
                    {isDesignMode && (
                      <td className='border p-2 text-center'>
                        <div className='flex items-center justify-center space-x-1'>
                          {row.level > 0 && <div style={{ width: `${row.level * 20}px` }} />}

                          {rows.some((r) => r.parentId === row.id) && (
                            <button onClick={() => toggleRowExpansion(row.id)} className='p-1 text-gray-600 hover:text-gray-800'>
                              {row.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          )}

                          <button onClick={() => addRow(row.id)} className='p-1 text-green-600 hover:text-green-800' title='Add child row'>
                            <Plus size={14} />
                          </button>

                          <button onClick={() => deleteRow(row.id)} className='p-1 text-red-600 hover:text-red-800' title='Delete row'>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}

                    {sortedColumns
                      .filter((col) => col.visible)
                      .map((column, colIndex) => (
                        <td
                          key={column.id}
                          className={`border p-2 ${colIndex < frozenColumns ? "sticky left-0 z-10 bg-white" : ""}`}
                          style={{
                            width: `${column.width}px`,
                            minWidth: `${column.width}px`,
                            left:
                              colIndex < frozenColumns ? `${sortedColumns.slice(0, colIndex).reduce((sum, col) => sum + col.width, 0)}px` : "auto",
                          }}
                          onClick={() => setSelectedCell(`${row.id}-${column.id}`)}>
                          {row.level > 0 && colIndex === 0 && <div style={{ marginLeft: `${row.level * 20}px` }}>{renderCell(row, column)}</div>}
                          {(row.level === 0 || colIndex > 0) && renderCell(row, column)}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Column Editor Modal */}
      {showColumnEditor && editingColumn && (
        <ColumnEditor
          column={editingColumn}
          onSave={() => {
            setShowColumnEditor(false);
            setEditingColumn(null);
          }}
          onCancel={() => {
            setShowColumnEditor(false);
            setEditingColumn(null);
          }}
        />
      )}

      {/* Calculator Modal */}
      {showCalculator && (
        <div className='fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 w-80'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold'>Calculator</h3>
            <button onClick={() => setShowCalculator(false)} className='text-gray-500 hover:text-gray-700'>
              ×
            </button>
          </div>

          <div className='space-y-2'>
            <div className='text-sm text-gray-600'>Available functions: +, -, *, /, sum, average, min, max</div>
            <div className='text-sm text-gray-600'>Example: col2 * col3 (multiply quantity by price)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFormBuilder;
