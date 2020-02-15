import React from "react";
import css from "./Calendar.module.scss";
const db = window.db;

export default class Calendar extends React.Component {
  constructor() {
    super();
    this.state = {
      weeks: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      // info: Mon Oct 27 2020 00:00:00 GMT+0800 (中国标准时间); date: 27; str: "2020-10-27"; todos
      days: [],
      today: null,
      calendar: [],
      curTodo: null
    };
  }
  componentDidMount = () => {
    this.setDaysData(this.getStartDateStr());
    this.setState({ today: this.getDateStr(new Date()) });
  };
  // 传入一个Date类型的参数，返回形如"2000-10-27"的字符串
  getDateStr = (dateInfo) => {
    return `${dateInfo.getFullYear()}-${dateInfo.getMonth() + 1}-${dateInfo.getDate()}`;
  };
  getStartDateStr = () => {
    let curDateInfo = new Date();
    let curDate = curDateInfo.getDate();
    // 当前是周几
    let curDay = curDateInfo.getDay();
    // 获取当前页面的起始日期
    let previousDayCnt = 6 + curDay;
    let startDateInfo = new Date(curDateInfo.setDate(curDate - previousDayCnt));
    return this.getDateStr(startDateInfo);
  };
  setDaysData = (startDateStr) => {
    let days = this.state.days;
    let startDate = Number(startDateStr.split("-")[2]);
    for (let i = 0; i < 35; ++i) {
      days.push({ info: new Date(new Date(startDateStr).setDate(startDate + i)) });
    }
    for (let day of days) {
      let curDayInfo = day.info;
      day.date = curDayInfo.getDate();
      day.str = this.getDateStr(curDayInfo);
      let curTodo = db
        .get("calendar")
        .find({ date: day.str })
        .value();
      day.todos = curTodo ? curTodo.todos : [];
    }
    this.setState({ days: days });
    console.log(this.state.days);
  };
  showEditArea = (e) => {
    console.log(e);
    let curSpan = e.currentTarget;
    curSpan.contentEditable = "true";
    curSpan.style.backgroundColor = "whitesmoke";
    curSpan.style.color = "black";
    curSpan.focus();
  };
  doneEditTodo = (e) => {
    let curSpan = e.currentTarget;
    curSpan.contentEditable = "false";
    curSpan.style.backgroundColor = "transparent";
    curSpan.style.color = "";
    this.updateDatabase(curSpan.parentNode);
  };
  addTodoItem = () => {
    let curTodo = this.state.curTodo;
    console.log(curTodo);
    let newSpan = document.createElement("span");
    newSpan.onblur = this.doneEditTodo;
    newSpan.ondblclick = this.showEditArea;
    newSpan.oncontextmenu = this.addToMenu;
    newSpan.contentEditable = "true";
    newSpan.setAttribute("data-done", "false");
    newSpan.style.backgroundColor = "whitesmoke";
    newSpan.style.color = "black";
    curTodo.appendChild(newSpan);
    newSpan.focus();
  };
  // 右键每个方框时弹出的主菜单
  showMenu = (e) => {
    this.setState({ curTodo: e.currentTarget.children[1] });
    let menu = document.querySelector("ul");
    menu.style.display = "block";
    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";
    console.log(e.clientX);
  };
  hideMenu = () => {
    let menu = document.querySelector("ul");
    menu.style.display = "none";
    this.hideDoneMenu();
  };
  hideDoneMenu = () => {
    let menu = document.querySelector("ul");
    menu.children[2].style.display = "none";
    menu.children[3].style.display = "none";
  };
  addToMenu = (e) => {
    this.setState({ curTodoItem: e.currentTarget });
    let curSpan = e.currentTarget;
    let menu = document.querySelector("ul");
    if (curSpan.dataset.done === "true") {
      menu.children[3].style.display = "block";
      menu.children[2].style.display = "none";
    } else {
      menu.children[3].style.display = "none";
      menu.children[2].style.display = "block";
    }
  };
  doneTodo = () => {
    let curSpan = this.state.curTodoItem;
    curSpan.dataset.done = "true";
    curSpan.className = css.bodyItemTodoDone;
    this.updateDatabase(curSpan.parentNode);
  };
  undoneTodo = () => {
    let curSpan = this.state.curTodoItem;
    curSpan.dataset.done = "false";
    curSpan.className = css.bodyItemTodoUndone;
    this.updateDatabase(curSpan.parentNode);
  };
  updateDatabase = (curTodo) => {
    // 更新数据库
    let newTodos = [];
    for (let item of curTodo.children) {
      newTodos.push({ content: item.innerText, done: item.dataset.done });
    }
    console.log(newTodos);
    let previousData = db.get("calendar").find({ date: curTodo.dataset.datestr });
    if (previousData.value()) {
      console.log("existed~");
      previousData.assign({ todos: newTodos }).write();
    } else {
      console.log(db.get("calendar"));
      db.get("calendar")
        .push({
          date: curTodo.dataset.datestr,
          todos: newTodos
        })
        .write();
    }
  };

  render() {
    return (
      <div className={css.calendar} onClick={this.hideMenu}>
        <ul className={css.menu}>
          <li onClick={this.addTodoItem}>增加新项目</li>
          <li>删除全部</li>
          <li onClick={this.doneTodo} className={css.menuDone}>
            标记为已完成
          </li>
          <li onClick={this.undoneTodo} className={css.menuDone}>
            标记为未完成
          </li>
        </ul>
        <div className={css.header}>
          {this.state.weeks.map((item, index) => {
            return (
              <span className={css.headerItem} key={index}>
                {item}
              </span>
            );
          })}
        </div>
        <div className={css.body}>
          {this.state.days.map((item, index) => {
            return (
              <div
                className={`${css.bodyItem} ${item.str === this.state.today ? css.today : ""}`}
                key={item.info}
                onContextMenu={this.showMenu}
              >
                <div className={css.bodyItemHeader}>
                  <span className={css.bodyItemHeaderDate}>{item.date}</span>
                </div>
                <div className={css.bodyItemTodo} data-index={index} data-datestr={item.str}>
                  {item.todos.map((todo, index) => {
                    return (
                      <span
                        key={index}
                        className={`${todo.done === "true" ? css.bodyItemTodoDone : css.bodyItemTodoUndone}`}
                        data-done={todo.done === "true"}
                        onDoubleClick={this.showEditArea}
                        onBlur={this.doneEditTodo}
                        onInput={this.editTodo}
                        onContextMenu={this.addToMenu}
                      >
                        {todo.content}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
