import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import './datatable.scss';

function DataTable({
    rows = [],
    columns = [],
    loading = false,
    error = '',
    getRowId,
    pageSize = 10,
    getRowClassName,
}) {
    return (
        <div className="data_table">
            <DataGrid
                className="data_grid"
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[pageSize]}
                checkboxSelection
                getRowId={getRowId || ((row) => row._id || row.id)}
                loading={loading}
                getRowClassName={getRowClassName}
            />
            {error && <p className="error_text">{error}</p>}
        </div>
    );
}

export default DataTable;
