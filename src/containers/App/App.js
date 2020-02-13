import React from "react";
import css from "./App.module.scss";

import SideBar from "../Sidebar/Sidebar";
import Todo from "../Todo/Todo";

function App() {
  return (
    <div className={css.app}>
      <SideBar></SideBar>
      <Todo></Todo>
    </div>
  );
}

export default App;
