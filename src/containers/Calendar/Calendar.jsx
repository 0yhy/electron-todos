import React from "react";
import css from "./Calendar.module.scss";
const db = window.db;

export default class Calendar extends React.Component {
  constructor() {
    super();
    this.state = {
      weeks: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      // info: Mon Oct 27 2020 00:00:00 GMT+0800 (中国标准时间); date: 27; str: "2020-10-27"; todos
      days: [],
      today: "",
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
  // 根据今天的日期获取当前显示的第一天日期的字符串形式
  getStartDateStr = () => {
    let curDateInfo = new Date();
    let curDate = curDateInfo.getDate();
    // 当前是周几 如果是周日得到的结果为0 要进行转换
    let curDay = curDateInfo.getDay();
    curDay = curDay ? curDay : 7;
    // 获取当前页面的起始日期
    let previousDayCnt = 6 + curDay;
    let startDateInfo = new Date(curDateInfo.setDate(curDate - previousDayCnt));
    return this.getDateStr(startDateInfo);
  };
  // 根据当前页的起始日期初始化state中的days数据
  setDaysData = (startDateStr) => {
    let days = new Array();
    let startDate = Number(startDateStr.split("-")[2]);
    // 一页显示5排7列 共35天
    for (let i = 0; i < 35; ++i) {
      days.push({ info: new Date(new Date(startDateStr).setDate(startDate + i)) });
    }
    // 设置days的每一项
    for (let day of days) {
      let curDayInfo = day.info;
      day.date = curDayInfo.getDate();
      day.str = this.getDateStr(curDayInfo);
      // 根据数据库数据中的todos来初始化days.todos
      let curTodo = db
        .get("calendar")
        .find({ date: day.str })
        .value();
      // 如果这一天在数据库里没有信息，则设置为空数组 否则是null/undefined的话map时会出现错误
      day.todos = curTodo ? curTodo.todos : [];
    }
    this.setState({ days: days });
  };
  // 双击todo项，显示编辑框
  showEditArea = (e) => {
    let curSpan = e.currentTarget;
    this.setState({ curTodo: curSpan.parentNode });
    curSpan.contentEditable = "true";
    curSpan.style.backgroundColor = "whitesmoke";
    curSpan.style.color = "black";
    curSpan.focus();
  };
  // 监测更改todo项时的回车键 回车直接添加新项目
  editTodo = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.addTodo();
    }
  };
  // 监测输入框的blur事件 blur后更新数据库
  doneEditTodo = (e) => {
    let curSpan = e.currentTarget;
    curSpan.contentEditable = "false";
    curSpan.style.backgroundColor = "transparent";
    curSpan.style.color = "";
    this.updateDatabase(curSpan.parentNode);
  };
  // 增加todo新项目
  addTodo = () => {
    let curTodo = this.state.curTodo;
    let newSpan = document.createElement("span");
    newSpan.onblur = this.doneEditTodo;
    newSpan.ondblclick = this.showEditArea;
    newSpan.oncontextmenu = this.addToMenu;
    newSpan.onkeydown = this.editTodo;
    newSpan.contentEditable = "true";
    newSpan.setAttribute("data-done", "false");
    newSpan.style.backgroundColor = "whitesmoke";
    newSpan.style.color = "black";
    curTodo.appendChild(newSpan);
    newSpan.focus();
  };
  // 删除todo项 同时更新数据库
  delTodo = () => {
    let curSpan = this.state.curTodoItem;
    let curTodo = curSpan.parentNode;
    curSpan.remove();
    this.updateDatabase(curTodo);
  };
  // 删除所有的todo 同时更新数据库
  delAllTodo = () => {
    let curTodo = this.state.curTodo;
    curTodo.innerHTML = "";
    this.updateDatabase(curTodo);
  };
  // 右键每个方框时弹出的主菜单
  showMenu = (e) => {
    this.setState({ curTodo: e.currentTarget.children[1] });
    let menu = document.querySelector("ul");
    // 判断显示的菜单个数 以调整菜单现实的位置
    let subMenuShowCnt = 2;
    for (let submenu of menu.children) {
      if (submenu.style.display === "block") {
        ++subMenuShowCnt;
      }
    }
    // 计算待出现菜单的高度和宽度
    const menuWidth = 120;
    const menuHeight = 41 * subMenuShowCnt;
    let pageWidth = document.body.clientWidth;
    let pageHeight = document.body.clientHeight;
    let x = e.clientX;
    let y = e.clientY;
    if (menuWidth + x > pageWidth) {
      x = pageWidth - menuWidth;
    }
    if (menuHeight + y > pageHeight) {
      y = pageHeight - menuHeight;
    }
    menu.style.display = "block";
    menu.style.left = x + "px";
    menu.style.top = y + "px";
  };
  // 左键任意地方隐藏菜单
  hideMenu = () => {
    let menu = document.querySelector("ul");
    menu.style.display = "none";
    this.hideSubMenu();
  };
  // 隐藏主菜单的同时也要隐藏子菜单
  hideSubMenu = () => {
    let menu = document.querySelector("ul");
    const hidingMenus = [1, 3, 4];
    for (let i of hidingMenus) {
      menu.children[i].style.display = "none";
    }
  };
  // 根据右键点击的todo项加入相应的子菜单
  addToMenu = (e) => {
    this.setState({ curTodoItem: e.currentTarget });
    let curSpan = e.currentTarget;
    let menu = document.querySelector("ul");
    if (curSpan.dataset.done === "true") {
      menu.lastChild.style.display = "block";
      menu.lastChild.previousSibling.style.display = "none";
    } else {
      menu.lastChild.style.display = "none";
      menu.lastChild.previousSibling.style.display = "block";
    }
    menu.children[1].style.display = "block";
  };
  // 将todo项标记为完成 同时更新数据库
  doneTodo = () => {
    let curSpan = this.state.curTodoItem;
    curSpan.dataset.done = "true";
    curSpan.className = css.bodyItemTodoDone;
    this.updateDatabase(curSpan.parentNode);
  };
  // 将todo项标记为未完成 同时更新数据库
  undoneTodo = () => {
    let curSpan = this.state.curTodoItem;
    curSpan.dataset.done = "false";
    curSpan.className = css.bodyItemTodoUndone;
    this.updateDatabase(curSpan.parentNode);
  };
  // 更新数据库
  updateDatabase = (curTodo) => {
    let newTodos = [];
    for (let item of curTodo.children) {
      newTodos.push({ content: item.innerText, done: item.dataset.done });
    }
    let previousData = db.get("calendar").find({ date: curTodo.dataset.datestr });
    if (previousData.value()) {
      previousData.assign({ todos: newTodos }).write();
    } else {
      db.get("calendar")
        .push({
          date: curTodo.dataset.datestr,
          todos: newTodos
        })
        .write();
    }
  };
  goToPage = (i) => {
    let curStartDateInfo = this.state.days[0].info;
    let curStartDate = curStartDateInfo.getDate();
    let newStartDateInfo = new Date(curStartDateInfo.setDate(curStartDate + i));
    this.setDaysData(this.getDateStr(newStartDateInfo));
  };
  lastPage = () => {
    this.goToPage(-35);
  };
  nextPage = () => {
    this.goToPage(35);
  };

  render() {
    return (
      <div className={css.calendar} onClick={this.hideMenu}>
        <ul className={css.menu}>
          <li onClick={this.addTodo}>增加新项目</li>
          <li onClick={this.delTodo} className={css.menuHide}>
            删除该项
          </li>
          <li onClick={this.delAllTodo}>删除全部</li>
          <li onClick={this.doneTodo} className={css.menuHide}>
            标记为已完成
          </li>
          <li onClick={this.undoneTodo} className={css.menuHide}>
            标记为未完成
          </li>
        </ul>

        <div className={css.header}>
          <div className={css.headerTitle}>
            <span className={css.headerTitleDate}>{`今天是${this.state.today.split("-")[0]}年${
              this.state.today.split("-")[1]
            }月${this.state.today.split("-")[2]}日`}</span>
            <div className={css.headerTitleMenu}>
              <div title="上一页" onClick={this.lastPage}>
                <img src={require("../../assets/icon/up.png")} />
              </div>
              <div title="下一页" onClick={this.nextPage}>
                <img src={require("../../assets/icon/down.png")} />
              </div>
            </div>
          </div>
          <div className={css.headerWeek}>
            {this.state.weeks.map((item, index) => {
              return (
                <span className={css.headerWeekItem} key={index}>
                  {item}
                </span>
              );
            })}
          </div>
        </div>
        <div className={css.body}>
          {this.state.days.map((item, index) => {
            return (
              <div className={`${css.bodyItem}`} key={item.info} onContextMenu={this.showMenu}>
                <div className={css.bodyItemHeader}>
                  <span
                    className={`${item.date === 1 ? css.bodyItemHeader1stDay : ""} ${
                      item.str === this.state.today ? css.today : ""
                    }`}
                  >
                    {item.date === 1 ? `${this.state.months[item.str.split("-")[1] - 1]}` : item.date}
                  </span>
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
                        onKeyDown={this.editTodo}
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
