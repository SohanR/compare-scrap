import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { baseUrl } from "../../utils/base";

function Packages() {
  const [data, setData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const datass = async () => {
      const res = await axios.get(`${baseUrl}/packs`);
      console.log("packages", res.data);
      setData(res.data);
    };
    datass();
  }, []);

  const handleDlt = (id) => {
    try {
      axios.delete(`${baseUrl}/pack/${id}`);
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
      field: "Hotel Name",
      headerName: "Hotel Name",
      width: 300,
      style: { color: "red" },
      renderCell: (param) => (
        <div className="userr">{param.row.hotel?.name}</div>
      ),
    },
    {
      field: "Taxi",
      headerName: "Taxi",
      width: 140,
      renderCell: (param) => (
        <div className="userr">{param.row.taxi?.carName}</div>
      ),
    },
    {
      field: "Photgrapher",
      headerName: "Photgrapher",
      width: 140,
      renderCell: (param) => (
        <div className="userr">{param.row.photographer?.name}</div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 140,
      renderCell: (param) => <div className="userr">{param.row.price}</div>,
    },
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
            <Link to="/packages/addnew" style={{ textDecoration: "none" }}>
              <button type="button">Add New Packages</button>
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

export default Packages;
