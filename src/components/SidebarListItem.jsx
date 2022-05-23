import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function SidebarListItem({ item }) {
  return (
    <Link className="link" to={`/room/${item.id}`}>
      <div className="sidebar__chat">
        <div className="avatar__container">
          <Avatar
            src={
              item.photoURL ||
              `https://avatars.dicebear.com/api/human/${item.id}.svg`
            }
            className="w-24 h-24"
          />
        </div>
        <div className="sidebar__chat--info">
          <h4>{item.name}</h4>
        </div>
      </div>
    </Link>
  );
}
