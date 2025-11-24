import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DataTable from '../../Components/DataTable/DataTable';
import useAdminAuthStore from '../../store/adminAuthStore';
import { baseUrl } from '../../utils/base';
import './userlists.scss';

function Users() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = useAdminAuthStore((s) => s.token);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await axios.get(`${baseUrl}/users`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setRows(res.data?.data || []);
        } catch (err) {
            setError('Unable to load users');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = useCallback(
        async (id) => {
            try {
                await axios.delete(`${baseUrl}/users/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setRows((prev) => prev.filter((row) => row._id !== id));
            } catch (err) {
                setError('Failed to delete user');
            }
        },
        [token]
    );

    const handleToggleRole = useCallback(
        async (id, role) => {
            const targetRole = role === 'admin' ? 'user' : 'admin';
            try {
                const res = await axios.put(
                    `${baseUrl}/users/${id}/role`,
                    { role: targetRole },
                    {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }
                );
                const updatedRole = res.data?.user?.role || targetRole;
                setRows((prev) =>
                    prev.map((row) =>
                        row._id === id ? { ...row, role: updatedRole } : row
                    )
                );
            } catch (err) {
                setError('Failed to update role');
            }
        },
        [token]
    );

    const columns = useMemo(
        () => [
            { field: '_id', headerName: 'ID', width: 250 },
            { field: 'name', headerName: 'Name', width: 170 },
            {
                field: 'createdAt',
                headerName: 'Join Date',
                width: 150,
                valueFormatter: (params) =>
                    params.value
                        ? new Date(params.value).toLocaleDateString()
                        : '-',
            },
            {
                field: 'bio',
                headerName: 'Bio',
                width: 220,
                renderCell: (params) => params.value || '-',
            },
            {
                field: 'visitedPlaces',
                headerName: 'Visited Place',
                width: 150,
                valueGetter: (params) =>
                    params.row.visitedPlaces?.length
                        ? params.row.visitedPlaces.length
                        : 0,
            },
            {
                field: 'bookmarksCount',
                headerName: 'Bookmarks',
                width: 130,
                valueGetter: (params) => params.row.bookmarksCount ?? 0,
            },
            {
                field: 'searchCount',
                headerName: 'Total Search',
                width: 130,
                valueGetter: (params) => params.row.searchCount ?? 0,
            },
            {
                field: 'role',
                headerName: 'Role',
                width: 120,
                renderCell: (params) => params.value || 'user',
            },
            {
                field: 'action',
                headerName: 'Action',
                width: 220,
                sortable: false,
                renderCell: (params) => (
                    <div className="actionn">
                        <button
                            type="button"
                            className={`role_btn ${
                                params.row.role === 'admin' ? 'admin' : 'user'
                            }`}
                            onClick={() =>
                                handleToggleRole(params.row._id, params.row.role)
                            }
                        >
                            {params.row.role === 'admin'
                                ? 'Make User'
                                : 'Make Admin'}
                        </button>
                        {params.row.role !== 'admin' && (
                            <button
                                type="button"
                                className="delete_btn"
                                onClick={() => handleDelete(params.row._id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ),
            },
        ],
        [handleDelete, handleToggleRole]
    );

    return (
        <div className="list_page">
            <div className="list_page_main">
                <div className="data_table">
                    <DataTable
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        error={error}
                        getRowId={(row) => row._id}
                        getRowClassName={(params) =>
                            params.row.role === 'admin' ? 'admin-row' : ''
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default Users;
