/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../Components/Input/Input";

import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { baseUrl } from "../../utils/base";
import "./../AddRoom/addroom.scss";

function AddTaxi({ inputs, title, type }) {
  const [inpVal, setInpVal] = useState({
    title: "",
    price: "",
    maxPeople: "",
    carType: "",
  });

  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState("");

  const nevigate = useNavigate();

  const handleChange = (e) => {
    setInpVal({ ...inpVal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(inpVal);
    try {
      setLoading(true);

      const imgList = await Promise.all(
        Object.values(photo).map(async (files) => {
          const data = new FormData();
          data.append("file", files);
          data.append("upload_preset", "upload");

          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/drbvugloj/image/upload",
            data
          );

          const { url } = uploadRes.data;
          return url;
        })
      );

      console.log("imgage", imgList);

      await axios.post(`${baseUrl}/taxi/create`, {
        carName: inpVal.title,
        maxCapacity: inpVal.maxPeople,
        pricePerKm: inpVal.price,
        images: imgList,
        carType:inpVal.carType
      });

      setLoading(false);
      nevigate(`/taxis`);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="add_new_room">
      <Sidebar />

      <div className="new_page">
        <Navbar />

        <div className="new_page_main">
          <div className="new_page_content">
            <div className="image">
              <p className="add_new_user">Add Taxi Image</p>
              <img
                src={photo ? URL.createObjectURL(photo[0]) : ""}
                alt="add img" height={500} width={500}
              />
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form_main">
                <div className="form_inp">
                  <label htmlFor="file">
                    Upload: <DriveFolderUploadIcon className="file_icon" />
                  </label>

                  <input
                    type="file"
                    name="file"
                    multiple
                    id="file"
                    // style={{ display: "none" }}
                    onChange={(e) => setPhoto(e.target.files)}
                  />
                </div>

                <Input
                  type="text"
                  placeholder="Transport Name"
                  onChange={handleChange}
                  name="title"
                  lable="Transport Name"
                  required
                  errorMsg="Title is required!"
                />

                <Input
                  type="number"
                  placeholder="price"
                  onChange={handleChange}
                  name="price"
                  lable="Price/KM"
                  required
                  errorMsg="Price is required!"
                />

                <Input
                  type="number"
                  placeholder="Max People"
                  onChange={handleChange}
                  name="maxPeople"
                  lable="Max People"
                  required
                  errorMsg="Max People is required!"
                />

                <div className="select_inp_title">
                  <label>Select Transport Type</label>
                  <select
                    id="carType"
                    value={inpVal.carType}
                    onChange={handleChange}
                    name="carType"
                  >
                    <option value="">Please select one</option>
                    <option value="sedan">Sedan</option>
                    <option value="Suv">SUV</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Microbus">Microbus</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="submit_btn"
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Loading.." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTaxi;
