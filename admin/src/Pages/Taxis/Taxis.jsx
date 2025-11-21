import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { baseUrl } from "../../utils/base";

function Taxis() {
  const [data, setData] = useState([]);
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  useEffect(() => {
    const datass = async () => {
      const res = await axios.get(`${baseUrl}/taxis`);
      console.log("taxi", res);
      setData(res.data);
    };
    datass();
  }, []);

  const handleDlt = (id) => {
    try {
      axios.delete(`${baseUrl}/taxi/${id}`);
      setData(data.filter((item) => item.id !== id));
      console.log(`deleted room ${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 310,
      renderCell: (param) => <div className="userr">{param.row._id}</div>,
    },
    {
      field: "title",
      headerName: "Title",
      width: 470,
      style: { color: "red" },      renderCell: (param) => (
        <div className="userr">{param.row.carName}</div>
      )
    },
    {
      field: "maxPeople",
      headerName: "Maxpeople",
      width: 140,
      renderCell: (param) => (
        <div className="userr">{param.row.maxCapacity}</div>
      ),
    },
    { field: "price", headerName: "Price", width: 140 ,      renderCell: (param) => (
        <div className="userr">{param.row.pricePerKm}</div>
      )},
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => (
        <div className="actionn">
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
    <div className="room_page">
      <Sidebar />

      <div className="room_page_main">
        <Navbar />

        <div className="room_page_table">
          <div className="btnn">
            <Link to="/taxis/addnew" style={{ textDecoration: "none" }}>
              <button type="button">Create New Taxi</button>
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

export default Taxis;
