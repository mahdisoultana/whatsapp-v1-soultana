import React from "react";
import "./App.css";
import useWindowSize from "./hooks/useWindowSize";
import Login from "./components/Login";
import useAuthUser from "./hooks/useAuthUser";
import SideBar from "./components/Sidebar";
import Chat from "./components/Chat";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
export default function App() {
  let user = useAuthUser();

  const page = useWindowSize();

  if (!user) {
    return <Login />;
  }
  return (
    <div className="app" style={{ ...page }}>
      <Redirect to={page.isMobile ? "/chats" : "/"} />
      <div className="app__body">
        <SideBar user={user} page={page} />
        <Route path="/room/:roomId">
          <Chat user={user} page={page} />
        </Route>
      </div>
    </div>
  );
}
