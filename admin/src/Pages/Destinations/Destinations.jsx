import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DataTable from '../../Components/DataTable/DataTable';
import useAdminAuthStore from '../../store/adminAuthStore';
import '../UserLists/userlists.scss';

const apiBase = 'http://localhost:5000/api/trending';

function Destinations() {
    const token = useAdminAuthStore((s) => s.token);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [range, setRange] = useState('all');

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            let endpoint = '/destinations';
            if (range === '30') endpoint = '/destinations/30d';
            if (range === '7') endpoint = '/destinations/7d';

            const res = await axios.get(`${apiBase}${endpoint}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            setRows(res.data?.data || []);
        } catch (err) {
            setError('Unable to load destinations');
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
                field: 'city',
                headerName: 'City',
                width: 220,
            },
            {
                field: 'count',
                headerName: 'Search Count',
                width: 180,
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
                        getRowId={(row) => row.city}
                    />
                </div>
            </div>
        </div>
    );
}

export default Destinations;
