import React from "react";
import css from "./Timetable.module.scss";

export default class Timetable extends React.Component {
  constructor() {
    super();
    this.state = {
      hours: [
        "0:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
        "5:00",
        "6:00",
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "24:00"
      ],
      // 
      days: [
        { day: "周一", todos: [] },
        { day: "周二", todos: [] },
        { day: "周三", todos: [] },
        { day: "周四", todos: [] },
        { day: "周五", todos: [] },
        { day: "周六", todos: [] },
        { day: "周日", todos: [] }
      ],
      // 每10px检测鼠标
      perHeight: 15,

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
    let days = this.state.days;
    let startDate = Number(startDateStr.split("-")[2]);
    for (let i = 0; i < 7; ++i) {
      days[i].info = new Date(new Date(startDateStr).setDate(startDate + i));
      days[i].date = days[i].info.getDate();
    }
    this.setState({ days: days });
    console.log(days);
  };

  // startBlock = (e) => {
  //   if (e.button === 0) {
  //     // 计算起始点相对于父格子的高度
  //     let perHeight = this.state.perHeight;
  //     let curGrid = e.currentTarget;
  //     let newBlock = document.createElement("span");
  //     let curGridY = Math.ceil(curGrid.getBoundingClientRect().y);
  //     let curMouseY = e.clientY;
  //     let newBlockTop = Math.ceil((curMouseY - curGridY) / perHeight - 1) * perHeight;
  //     // 计算起始的时间
  //     let curGridHour = e.currentTarget.dataset.hour;
  //     let startHour = curGridHour.split(":")[0] + ":" + (newBlockTop === 0 ? "00" : newBlockTop);
  //     console.log(startHour);

  //     newBlock.className = css.block;
  //     newBlock.style.top = newBlockTop + "px";
  //     curGrid.appendChild(newBlock);

  //     this.setState({
  //       curState: "createBlock",
  //       curGridY: curGridY,
  //       newBlock: newBlock,
  //       newBlockTop: newBlockTop
  //     })
  //   }
  // };
  startBlock = (e) => {
    let curGrid = e.currentTarget;
    console.log(curGrid.getBoundingClientRect())
  }

  // stretchBlock = (e) => {
  //   if (this.state.curState === "createBlock") {
  //     let perHeight = this.state.perHeight;
  //     let curGridY = this.state.curGridY;
  //     let curMouseY = e.clientY;
  //     let newBlock = this.state.newBlock;
  //     let newBlockTop = this.state.newBlockTop;
  //     let newBlockHeight = Math.ceil((curMouseY - curGridY) / perHeight) * perHeight - newBlockTop;
  //     newBlock.style.height = newBlockHeight + "px";
  //   }

  // }
  // endBlock = (e) => {
  //   this.setState({
  //     curState: ""
  //   })
  // }
  render() {
    return (
      <div className={css.timetable}>
        <div className={css.header}>
          <div className={css.headerTime}></div>
          <div className={css.headerDays}>
            {this.state.days.map((item) => {
              return (
                <div key={item.info} className={css.headerDaysItem}>
                  <div className={css.headerDaysItemDay}>{item.day}</div>
                  <div className={css.headerDaysDate}>{item.date}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={css.body}>
          <div className={css.bodyTime}>
            {this.state.hours.map((item) => {
              return (
                <div key={item} className={css.bodyTimeItem}>
                  {item}
                </div>
              );
            })}
          </div>
          <div className={css.bodyGrid}>
            {this.state.days.map((item) => {
              return (
                <div className={css.bodyGridCol} key={item.day}>
                  {this.state.hours.map((hour) => {
                    return (
                      <div
                        className={css.bodyGridColItem}
                        key={hour}
                        onMouseDown={this.startBlock}
                        onMouseUp={this.endBlock}
                        onMouseMove={this.stretchBlock}
                        data-hour={hour}
                        data-time={item.info}
                      >
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
