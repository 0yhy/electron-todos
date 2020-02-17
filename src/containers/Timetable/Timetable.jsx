import React from "react";
import css from "./Timetable.module.scss";

export default class Timetable extends React.Component {
  constructor() {
    super();
    this.state = {
      weeks: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      days: []
    };
  }
  componentDidMount = () => {
    this.setDaysData(this.getStartDateStr());
  };
  getDateStr = (dateInfo) => {
    return `${dateInfo.getFullYear()}-${dateInfo.getMonth() + 1}-${dateInfo.getDate()}`;
  };
  getStartDateStr = () => {
    let curDateInfo = new Date();
    let curDate = curDateInfo.getDate();
    let curDay = curDateInfo.getDay();
    curDay = curDay ? curDay : 7;
    // 获取当前页面的起始日期
    let previousDayCnt = curDay - 1;
    let startDateInfo = new Date(curDateInfo.setDate(curDate - previousDayCnt));
    return this.getDateStr(startDateInfo);
  };
  setDaysData = (startDateStr) => {
    let days = new Array();
    let startDate = Number(startDateStr.split("-")[2]);
    for (let i = 0; i < 7; ++i) {
      days.push({ info: new Date(new Date(startDateStr).setDate(startDate + i)) });
    }
    console.log(days);
  };
  render() {
    return (
      <div className={css.timetable}>
        <div className={css.header}></div>
      </div>
    );
  }
}
