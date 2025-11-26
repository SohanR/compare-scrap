import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import axios from "axios";
import { baseUrl } from "../../utils/base";
import "./itemlists.scss";

function ItemLists({ type }) {
  const [userCount, setUserCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const usersRes = await axios.get(`${baseUrl}/users`);
      const visitRes = await axios.get(`${baseUrl}/visit-counter`);
      const searchRes = await axios.get(`${baseUrl}/search-counter`);

      setUserCount(usersRes.data.message?.length || 0);
      setVisitCount(visitRes.data.count || 0);
      setSearchCount(searchRes.data.count || 0);
    };
    fetchCounts();
  }, []);

  let data;

  switch (type) {
    case "user":
      data = {
        title: "Registered Users",
        count: <CountUp end={userCount} duration={1} />,
        icon: (
          <PeopleAltOutlinedIcon
            style={{
              color: "#1976d2",
              backgroundColor: "#e3f2fd",
            }}
            className="icon"
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "Website Visits",
        count: <CountUp end={visitCount} duration={1} />,
        icon: (
          <PublicOutlinedIcon
            style={{
              color: "#8e24aa",
              backgroundColor: "#f3e5f5",
            }}
            className="icon"
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "Total Searches",
        count: <CountUp end={searchCount} duration={1} />,
        icon: (
          <QueryStatsOutlinedIcon
            style={{
              color: "#2e7d32",
              backgroundColor: "#e8f5e9",
            }}
            className="icon"
          />
        ),
      };
      break;
    default:
      data = {};
  }

  return (
    <div className="item_listss">
      <div className="name">
        <p>{data.title}</p>
        <span className="persentage positive">{/* visual spacer */}</span>
      </div>

      <div className="counts">{data.count}</div>

      <div className="see_item">{data.icon}</div>
    </div>
  );
}

export default ItemLists;
