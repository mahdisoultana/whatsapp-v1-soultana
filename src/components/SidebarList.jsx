import { CircularProgress } from "@material-ui/core";
import { Cancel, CancelOutlined, SearchOutlined } from "@material-ui/icons";
import "./SidebarList.css";
import SidebarListItem from "./SidebarListItem";
export default function SidebarList({ title, data }) {
  if (!data) {
    return (
      <div className="loader__container sidebar__loader">
        <CircularProgress />
      </div>
    );
  }
  if (!data.length && title === "Search Results") {
    return (
      <div className="no-result">
        <div>
          <SearchOutlined />
          <div className="cancel-root">
            <CancelOutlined />
            <h2>No Search Result</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar__chat--container">
      <h2>{title}</h2>
      {data.map((item) => (
        <SidebarListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
