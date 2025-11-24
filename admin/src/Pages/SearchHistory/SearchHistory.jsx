import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DataTable from '../../Components/DataTable/DataTable';
import useAdminAuthStore from '../../store/adminAuthStore';
import { baseUrl } from '../../utils/base';
import '../UserLists/userlists.scss';

function SearchHistory() {
    const token = useAdminAuthStore((s) => s.token);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [range, setRange] = useState('all');
    const [usersModal, setUsersModal] = useState({
        open: false,
        users: [],
        title: '',
    });

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await axios.get(`${baseUrl}/search-history/items`, {
                params: { range },
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setRows(res.data?.data || []);
        } catch (err) {
            setError('Unable to load search history');
        } finally {
            setLoading(false);
        }
    }, [range, token]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const columns = useMemo(
        () => [
            {
                field: 'from',
                headerName: 'From',
                width: 160,
                valueGetter: (params) =>
                    params.row.from?.city ||
                    params.row.from?.name ||
                    params.row.from?.iata ||
                    '-',
            },
            {
                field: 'to',
                headerName: 'To',
                width: 160,
                valueGetter: (params) =>
                    params.row.to?.city ||
                    params.row.to?.name ||
                    params.row.to?.iata ||
                    '-',
            },
            {
                field: 'date',
                headerName: 'Travel Date',
                width: 140,
                renderCell: (params) => params.value || '-',
            },
            {
                field: 'count',
                headerName: 'Search Count',
                width: 140,
            },
            {
                field: 'latestCreatedAt',
                headerName: 'Last Searched',
                width: 170,
                valueFormatter: (params) =>
                    params.value
                        ? new Date(params.value).toLocaleString()
                        : '-',
            },
            {
                field: 'users',
                headerName: 'Users',
                width: 180,
                sortable: false,
                renderCell: (params) =>
                    params.row.users?.length ? (
                        <button
                            type="button"
                            className="pill_button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setUsersModal({
                                    open: true,
                                    users: params.row.users,
                                    title: `${params.row.from?.city || '-'} → ${
                                        params.row.to?.city || '-'
                                    } (${params.row.date || '-'})`,
                                });
                            }}
                        >
                            View Users ({params.row.users.length})
                        </button>
                    ) : (
                        '-'
                    ),
            },
        ],
        []
    );

    return (
        <div className="list_page">
            <div className="list_page_main">
                <div className="data_table">
                    <div className="range_tabs">
                        {[
                            { key: 'all', label: 'All time' },
                            { key: '30', label: 'Last 30 days' },
                            { key: '7', label: 'Last 7 days' },
                        ].map((opt) => (
                            <button
                                key={opt.key}
                                type="button"
                                className={`range_btn ${
                                    range === opt.key ? 'active' : ''
                                }`}
                                onClick={() => setRange(opt.key)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <DataTable
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        error={error}
                        getRowId={(row) => row.itemKey}
                    />
                </div>
            </div>
            {usersModal.open && (
                <div
                    className="modal_backdrop"
                    onClick={() => setUsersModal({ open: false, users: [], title: '' })}
                    role="presentation"
                >
                    <div
                        className="modal_card"
                        onClick={(e) => e.stopPropagation()}
                        role="presentation"
                    >
                        <div className="modal_header">
                            <h4>Users who searched</h4>
                            <p className="modal_sub">{usersModal.title}</p>
                        </div>
                        <div className="modal_body">
                            {usersModal.users.length === 0 ? (
                                <p>No users</p>
                            ) : (
                                <ul className="user_modal_list">
                                    {usersModal.users.map((u) => (
                                        <li key={u._id}>
                                            <span className="user_name">
                                                {u.name || 'Unnamed'}
                                            </span>
                                            <span className="user_email">
                                                {u.email || '—'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="modal_footer">
                            <button
                                type="button"
                                className="pill_button"
                                onClick={() =>
                                    setUsersModal({ open: false, users: [], title: '' })
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchHistory;
