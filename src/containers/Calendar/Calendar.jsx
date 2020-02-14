import React from "react";
import css from "./Calendar.module.scss";

export default class Calendar extends React.Component {
  constructor() {
    super();
    this.state = {
      weeks: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      days: [

      ]
    };
  }
  componentDidMount = () => {
    this.getDate();
  }
  getDate = () => {
    let curDay = new Date().getDay();
    let curDate = new Date().getDate();
    let curMonth = new Date().getMonth() + 1;
    let curYear = new Date().getFullYear();
    console.log(curDate, curMonth, curYear, curDay);
    console.log(new Date(new Date().setDate(curDate - 15)));
  }

  render() {
    return <div className={css.calendar}>
      <button onClick={this.getDate}>test</button>
      <div className={css.header}>
        {this.state.weeks.map((item, index) => {
          return <span>{item}</span>
        })}
      </div>
    </div>
  }
};