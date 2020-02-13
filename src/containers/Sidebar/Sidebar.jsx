import React from "react";
import css from "./Sidebar.module.scss";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={css.sidebar}>
        <div className={css.subbar}>
          <div className={`${css.subbarItem}`}>
            <img className={css.subbarIcon} src={require("../../assets/icon/time.png")} />
            <span>周视图</span>
          </div>
          <div className={`${css.subbarItem}`}>
            <img className={css.subbarIcon} src={require("../../assets/icon/calendar.png")} />
            <span>月视图</span>
          </div>
        </div>
        <div className={css.subbar}>
          <div className={`${css.subbarItem} ${css.currentSubbarItem}`}>
            <img className={css.subbarIcon} src={require("../../assets/icon/todo.png")} />
            <span>待办事项</span>
          </div>
          <div className={`${css.subbarItem}`}>
            <img className={css.subbarIcon} src={require("../../assets/icon/note.png")} />
            <span>随手记</span>
          </div>
        </div>
      </div>
    );
  }
}
