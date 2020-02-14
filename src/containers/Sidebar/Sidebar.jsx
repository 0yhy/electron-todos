import React from "react";
import css from "./Sidebar.module.scss";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goToPage = (e) => {
    this.props.selectTab(e.currentTarget.dataset.tabname);
    const sidebarItems = e.currentTarget.parentNode.children;
    for (let sidebarItem of sidebarItems) {
      sidebarItem.className = css.sidebarItem;
    }
    e.currentTarget.className += ` ${css.currentSidebarItem}`;
  };

  render() {
    return (
      <div className={css.sidebar}>
        <div className={`${css.sidebarItem}`} data-tabname="timetable" onClick={this.goToPage}>
          <img className={css.sidebarIcon} src={require("../../assets/icon/time.png")} alt="img" />
          <span>周视图</span>
        </div>
        <div className={`${css.sidebarItem}`} data-tabname="calendar" onClick={this.goToPage}>
          <img className={css.sidebarIcon} src={require("../../assets/icon/calendar.png")} alt="img" />
          <span>月视图</span>
        </div>
        <div className={`${css.sidebarItem} ${css.currentSidebarItem}`} data-tabname="todo" onClick={this.goToPage}>
          <img className={css.sidebarIcon} src={require("../../assets/icon/todo.png")} alt="img" />
          <span>待办事项</span>
        </div>
        <div className={`${css.sidebarItem}`} data-tabname="note" onClick={this.goToPage}>
          <img className={css.sidebarIcon} src={require("../../assets/icon/note.png")} alt="img" />
          <span>随手记</span>
        </div>
      </div>
    );
  }
}
