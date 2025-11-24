import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DataTable from '../../Components/DataTable/DataTable';
import useAdminAuthStore from '../../store/adminAuthStore';
import { baseUrl } from '../../utils/base';
import '../UserLists/userlists.scss';

const titleFromItem = (item = {}) =>
    item.title ||
    item.name ||
    item.slug ||
    item.code ||
    item.hotelName ||
    item.destination ||
    '—';

function Bookmarks() {
    const token = useAdminAuthStore((s) => s.token);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [usersModal, setUsersModal] = useState({
        open: false,
        users: [],
        title: '',
    });

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await axios.get(`${baseUrl}/bookmarks/items`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setRows(res.data?.data || []);
        } catch (err) {
            setError('Unable to load bookmarks');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleDeleteItem = useCallback(
        async (bookmarkIds) => {
            if (!bookmarkIds?.length) return;
            try {
                await axios.delete(`${baseUrl}/bookmarks`, {
                    data: { bookmarkIds },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setRows((prev) =>
                    prev.filter(
                        (row) =>
                            !row.bookmarkIds ||
                            !row.bookmarkIds.some((id) => bookmarkIds.includes(id))
                    )
                );
            } catch (err) {
                setError('Failed to delete bookmarks');
            }
        },
        [token]
    );

    const columns = useMemo(
        () => [
            {
                field: 'itemTitle',
                headerName: 'Item',
                width: 240,
                renderCell: (params) => {
                    const link =
                        params.row.item?.bookingLink ||
                        params.row.item?.link ||
                        params.row.item?.url ||
                        params.row.item?.webUrl ||
                        params.row.item?.href;
                    const title = titleFromItem(params.row.item);
                    return link ? (
                        <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="item_link"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {title}
                        </a>
                    ) : (
                        title
                    );
                },
            },
            { field: 'category', headerName: 'Category', width: 140 },
            {
                field: 'count',
                headerName: 'Bookmarked By',
                width: 140,
            },
            {
                field: 'latestCreatedAt',
                headerName: 'Last Bookmarked',
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
                                    title: titleFromItem(params.row.item),
                                });
                            }}
                        >
                            View Users ({params.row.users.length})
                        </button>
                    ) : (
                        '-'
                    ),
            },
            {
                field: 'action',
                headerName: 'Action',
                width: 140,
                sortable: false,
                renderCell: (params) =>
                    params.row.bookmarkIds?.length ? (
                        <button
                            type="button"
                            className="delete_btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(params.row.bookmarkIds);
                            }}
                        >
                            Delete
                        </button>
                    ) : (
                        '-'
                    ),
            },
        ],
        [handleDeleteItem]
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
                            <h4>Users who bookmarked</h4>
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

export default Bookmarks;
