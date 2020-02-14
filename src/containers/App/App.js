import React from "react";
import css from "./App.module.scss";

import SideBar from "../Sidebar/Sidebar";
import Timetable from "../Timetable/Timetable";
import Calendar from "../Calendar/Calendar";
import Todo from "../Todo/Todo";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curTab: "calendar"
    };
  }
  selectTab = (curTab) => {
    console.log(curTab);
    console.log(this.state.curTab);
    this.setState({ curTab: curTab });
    console.log(this.state.curTab);
  }
  render() {
    return (
      <div className={css.app} >
        <SideBar selectTab={this.selectTab}></SideBar>
        {this.state.curTab === "timetable" ? <Timetable></Timetable> : null}
        {this.state.curTab === "calendar" ? <Calendar></Calendar> : null}
        {this.state.curTab === "todo" ? <Todo></Todo> : null}
      </div>
    );
  }
}

