import { IconButton } from "@material-ui/core";
import {
  Add,
  ExitToApp,
  SearchOutlined,
  Home,
  PeopleAlt,
  Message,
} from "@material-ui/icons";
import React from "react";
import { auth, createTimestamp, db } from "../firebase";
import "./Sidebar.css";
import SidebarList from "./SidebarList";

const dummyImg =
  "https://images.unsplash.com/photo-1648737119247-e93f56878edf?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872";
import { NavLink, Switch, Route, useHistory } from "react-router-dom";
import useRooms from "../hooks/useRooms";
import { useUsers } from "../hooks/useUsers";
import useChats from "../hooks/useChats";

export default function Sidebar({ user, page }) {
  const chats = useChats(user);
  const rooms = useRooms();
  const users = useUsers(user);
  const history = useHistory();
  const [menu, setMenu] = React.useState(1);
  function signOut() {
    if (!page.isMobile) {
      history.push("/");
    }
    auth.signOut();
  }
  let Nav;
  if (page.isMobile) {
    Nav = NavLink;
  } else {
    Nav = (props) => {
      return <div onClick={props.onClick}>{props.children}</div>;
    };
  }
  function createRoom() {
    const name = prompt("Type the Name of your Room:");
    if (name.trim()) {
      db.collection("rooms").add({
        name,
        timestamp: createTimestamp(),
      });
    }
  }
  const [search, setSearch] = React.useState([]);
  async function searchUsersAndRooms(e) {
    e.preventDefault();
    const query = e.target.search.value;
    if (query.trim()) {
      const usersSnapshot = await db
        .collection("users")
        .where("name", "==", query)
        .get();
      const roomSnapshot = await db
        .collection("rooms")
        .where("name", "==", query)
        .get();
      let users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      let rooms = roomSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const searchResult = [...users, ...rooms];
      setSearch(searchResult);
      setMenu(4);
    }
  }
  return (
    <div
      className="sidebar"
      style={{ minHeight: page.isMobile ? page.hieght : "auto" }}
    >
      <div className="sidebar__header">
        <div className="sidebar__header--left">
          <a href="#" className="block relative">
            <img
              alt="profil"
              src={user?.photoURL || dummyImg}
              className="mx-auto object-cover rounded-full h-16 w-16 "
            />
          </a>
          <h4>{user?.displayName || "Uknown"}</h4>
        </div>
        <div className="sidebar__header--right">
          <IconButton onClick={signOut}>
            <ExitToApp />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <form
          className="sidebar__search--container"
          onSubmit={searchUsersAndRooms}
        >
          <SearchOutlined />
          <input
            type="text"
            name="search"
            placeholder="search for a user or room"
            id="search"
          />
        </form>
      </div>
      <div className="sidebar__menu">
        <Nav to="/chats" onClick={() => setMenu(1)}>
          <div
            className={`sidebar__menu--home ${
              menu === 1 ? "border-b-2 border-gray-500" : ""
            }`}
          >
            <Home />
            <div className="sidebar__menu--line" />
          </div>
        </Nav>
        <Nav to="/rooms" onClick={() => setMenu(2)}>
          <div
            className={`sidebar__menu--rooms ${
              menu === 2 ? "border-b-2 border-gray-500" : ""
            }`}
          >
            <Message />
            <div className="sidebar__menu--line" />
          </div>
        </Nav>
        <Nav to="/users" onClick={() => setMenu(3)}>
          <div
            className={`sidebar__menu--people ${
              menu === 3 ? "border-b-2 border-gray-500" : ""
            }`}
          >
            <PeopleAlt />
            <div className="sidebar__menu--line" />
          </div>
        </Nav>
      </div>

      <>
        {menu == 1 ? (
          <SidebarList title="Chats" data={chats} />
        ) : menu == 2 ? (
          <SidebarList data={rooms} title="rooms" />
        ) : menu === 3 ? (
          <SidebarList data={users} title="users" />
        ) : menu === 4 ? (
          <SidebarList title="search" data={search} />
        ) : null}
      </>

      <div className="absolute bottom-4 right-4 bg-green-500 rounded-full shadow-xl ">
        <IconButton onClick={createRoom}>
          <Add className="text-white" />
        </IconButton>
      </div>
    </div>
  );
}
