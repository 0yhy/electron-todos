import React from "react";
import css from "./Calendar.module.scss";
import Datastore from "nedb";
const app = window.electron.remote.app;

export default class Calendar extends React.Component {
  constructor() {
    super();
    this.state = {
      weeks: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      days: []
    };
  }
  componentDidMount = () => {
    this.setDaysData(this.getStartDateStr());
    var db = new Datastore({ filename: `${app.getPath("userData")}/db/userinfo.db` });
  };
  getStartDateStr = () => {
    let curDateInfo = new Date();
    let curDate = curDateInfo.getDate();
    // 当前是周几
    let curDay = curDateInfo.getDay();
    // 获取当前页面的起始日期
    let previousDayCnt = 6 + curDay;
    let startDateInfo = new Date(curDateInfo.setDate(curDate - previousDayCnt));
    console.log(startDateInfo);
    return `${startDateInfo.getFullYear()}-${startDateInfo.getMonth() + 1}-${startDateInfo.getDate()}`;
  };
  setDaysData = (startDateStr) => {
    let days = this.state.days;
    let startDate = Number(startDateStr.split("-")[2]);
    for (let i = 0; i < 42; ++i) {
      days.push({ info: new Date(new Date(startDateStr).setDate(startDate + i)) });
    }
    for (let day of days) {
      let curDayInfo = day.info;
      day.date = curDayInfo.getDate();
    }
    this.setState({ days: days });
    console.log(this.state.days);
  };

  doneInput = (e) => {
    console.log(e.currentTarget.value);
    let a = e.currentTarget.value;
    e.currentTarget.value = a;
  };

  render() {
    return (
      <div className={css.calendar}>
        <div className={css.header}>
          {this.state.weeks.map((item, index) => {
            return <span className={css.headerItem}>{item}</span>;
          })}
        </div>
        <div className={css.body}>
          {this.state.days.map((item, index) => {
            return (
              <div className={css.bodyItem}>
                <span data-dateinfo={item.info}>{item.date}</span>
                <textarea className={css.bodyTextarea} onBlur={this.doneInput}></textarea>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
