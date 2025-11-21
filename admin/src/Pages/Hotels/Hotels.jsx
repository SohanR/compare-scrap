/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import noImage from '../../Images/no hotel.jpg';
import { baseUrl } from '../../utils/base';
import './hotels.scss';

function Hotels({ type }) {
    const [data, setData] = useState([]);
    const location = useLocation();
    const path = location.pathname.split('/')[1];

    useEffect(() => {
        const datass = async () => {
            const res = await axios.get(`${baseUrl}/hotels`);
            setData(res.data.message);
        };
        datass();
    }, [data]);

    /**
     * The function `handleDlt` is used to delete an item from the data array and make an API call to
     * delete the item with the corresponding id.
     */
    const handleDlt = (id) => {
        try {
            axios.delete(`${baseUrl}/${path}/${id}`);
            setData(data.filter((item) => item.id !== id));
            console.log(`deleted user ${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    /* The `columns` variable is an array of objects that define the columns for the data grid component.
  Each object represents a column and contains properties such as `field`, `headerName`, `width`,
  and `renderCell`. */
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 310,
            renderCell: (param) => (
                <div className="userr">
                    <img
                        src={param.row.images?.[0] ? param.row.images?.[0] : noImage}
                        alt="Hotel"
                        className="userr_image"
                    />
                    {param.row._id}
                </div>
            ),
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 350,
            style: { color: 'red' },
        },
        { field: 'price', headerName: 'Price', width: 140 },
        {
            field: 'rooms',
            headerName: 'Rooms',
            width: 140,
            renderCell: (param) => <div className="roomCount">{param.row.rooms.length}</div>,
        },
        { field: 'city', headerName: 'City', width: 140 },
        {
            field: 'action',
            headerName: 'Action',
            width: 160,
            renderCell: (params) => (
                <div className="actionn">
                    <Link to={params.row._id}>
                        <button type="button" className="view_btn">
                            View
                        </button>
                    </Link>
                    <button
                        type="button"
                        className="delete_btn"
                        onClick={() => handleDlt(params.row._id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="hotel_page">
            <Sidebar />

            <div className="hotel_page_main">
                <Navbar />

                <div className="hotel_page_table">
                    <div className="btnn">
                        <Link
                            to={`/${
                                type === 'room' ? 'hotels' : 'user' ? 'users' : 'products'
                            }/addnew`}
                            style={{ textDecoration: 'none' }}
                        >
                            <button type="button">Create New Room</button>
                        </Link>
                    </div>
                    <DataGrid
                        className="data_grid"
                        rows={data}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                    />
                </div>
            </div>
        </div>
    );
}

export default Hotels;
