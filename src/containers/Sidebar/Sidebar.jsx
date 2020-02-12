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
          <span>周视图</span>
          <span>月视图</span>
        </div>
        <div className={css.subbar}>
          <span>待办事项</span>
          <span>随手记</span>
        </div>
      </div>
    );
  }
}
