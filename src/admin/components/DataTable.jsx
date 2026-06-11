export default function DataTable({ columns, rows, onRowClick, renderActions, renderCell }) {
  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              onKeyDown={(event) => {
                if (!onRowClick) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick(row);
                }
              }}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              className={onRowClick ? 'admin-table-row-clickable' : ''}
            >
              {columns.map((column) => {
                const fieldKey = column.toLowerCase().replace(/\s/g, '_');
                if (fieldKey === 'actions' && renderActions) {
                  return <td key={column}>{renderActions(row)}</td>;
                }

                if (renderCell) {
                  const custom = renderCell(row, fieldKey, column);
                  if (custom !== undefined) {
                    return <td key={column}>{custom}</td>;
                  }
                }

                return <td key={column}>{row[fieldKey] ?? row[column]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
