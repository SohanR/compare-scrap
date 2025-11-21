import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { baseUrl } from "../../utils/base";
import "./itemlists.scss";

function ItemLists({ type }) {
  // store the data
  const [userData, setUserData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [earningData, setEarningData] = useState();

  /* The `useEffect` hook is used to perform side effects in functional components. In this case, it
   is used to fetch data from three different API endpoints with the response data. */
  useEffect(() => {
    const datass = async () => {
      const res = await axios.get(`${baseUrl}/hotels`);
    //   const res2 = await axios.get(`${baseUrl}/blogs`);
      const res3 = await axios.get(`${baseUrl}/users`);
      const res4 = await axios.get(`${baseUrl}/earning/balance`)
      setHotelData(res.data.message);
    //   setBlogData(res2.data.message);
      setUserData(res3.data.message);
     setEarningData(res4.data.balance)

    };
    datass();
  }, []);

  let data;

  // Dynamicaly change the ui content
  /* The `switch` statement is used to conditionally assign values to the `data` object based on the
    value of the `type` parameter. */
  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        count: <CountUp end={userData.length} duration={1} />,
        icon: (
          <PermIdentityIcon
            style={{
              color: "#FF74B1",
              backgroundColor: "#FFD6EC",
            }}
            className="icon"
          />
        ),
        link: "See all users",
        linkto: "/users",
      };
      break;
    case "order":
      data = {
        title: "HOTELS",
        isMoney: false,
        count: <CountUp end={hotelData.length} duration={1} />,

        icon: (
          <LocalGroceryStoreOutlinedIcon
            style={{
              color: "#AC7088",
              backgroundColor: "#FFF38C",
            }}
            className="icon"
          />
        ),
        link: "View all hotels",
        linkto: "/hotels",
      };
      break;
    // case "earning":
    //   data = {
    //     title: "BLOGS",
    //     count: <CountUp end={blogData.length} duration={1} />,
    //     icon: (
    //       <AttachMoneyOutlinedIcon
    //         style={{
    //           color: "#367E18",
    //           backgroundColor: "#A7FFE4",
    //         }}
    //         className="icon"
    //       />
    //     ),
    //     link: "See All Blogs",
    //     linkto: "/blogs",
    //   };
    //   break;
    case "balance":
      data = {
        title: "BALANCE",
        count: <CountUp end={earningData} duration={1} />,
        isMoney: true,
        icon: (
          <PaidOutlinedIcon
            style={{
              color: "#AC7088",
              backgroundColor: "#B1B2FF",
            }}
            className="icon"
          />
        ),
        link: "See all details",
        linkto: "/",
      };
      break;
    default:
      break;
  }

  return (
    <div className="item_listss">
      <div className="name">
        <p>{data.title}</p>
        <span className="persentage positive">
          <KeyboardArrowUpIcon />
        </span>
      </div>

      <div className="counts">
        {data.isMoney && <AttachMoneyOutlinedIcon />}
        {data.count}
      </div>

      <div className="see_item">
        <Link to={data.linkto}>
          <p>{data.link}</p>
        </Link>
        {data.icon}
      </div>
    </div>
  );
}

export default ItemLists;
