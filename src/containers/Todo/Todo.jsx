import React from "react";
import css from "./Todo.module.scss";
const db = window.db;

export default class Todo extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      dones: [],
      undones: []
    };
  }
  componentDidMount = () => {
    let todoinfo = db.get("todo").value();
    this.setState({
      todos: todoinfo.todos,
      dones: todoinfo.dones,
      undones: todoinfo.undones
    });
  };
  updateDatabase = () => {
    db.get("todo")
      .assign({ todos: this.state.todos, dones: this.state.dones, undones: this.state.undones })
      .write();
  };
  addTodo = (e) => {
    let inputBar = e.currentTarget;
    if (e.keyCode === 13 && inputBar.value.trim()) {
      let { todos, undones } = this.state;
      todos.push(inputBar.value);
      undones.push(inputBar.value);
      this.setState({
        todos: todos,
        undones: undones
      });
      this.updateDatabase();
      inputBar.value = "";
    }
  };
  checkTodo = (e) => {
    let curTodoSpan = e.currentTarget.nextSibling;
    let curTodo = e.currentTarget.nextSibling.innerText;
    let { dones, undones } = this.state;
    console.log("curTodo:", curTodo);
    if (e.currentTarget.checked) {
      curTodoSpan.className = css.todoItemTextDone;
      dones.push(curTodo);
      undones.splice(undones.indexOf(curTodo), 1);
    } else {
      curTodoSpan.className = css.todoItemText;
      undones.push(curTodo);
      dones.splice(dones.indexOf(curTodo), 1);
    }
    this.setState({ dones: dones, undones: undones });
    this.updateDatabase();
    console.log(this.state.todos, this.state.dones, this.state.undones);
  };
  delTodo = (e) => {
    let curTodo = e.currentTarget.parentNode.children[1].innerText;
    console.log(curTodo);
    let { todos, dones, undones } = this.state;
    console.log(todos.indexOf(curTodo));
    todos.splice(todos.indexOf(curTodo), 1);
    // 如果删除的是已完成事件
    if (e.currentTarget.parentNode.children[0].checked) {
      dones.splice(dones.indexOf(curTodo), 1);
    } else {
      undones.splice(undones.indexOf(curTodo), 1);
    }
    this.setState({ todos: todos, dones: dones, undones: undones });
    this.updateDatabase();
    console.log(this.state.todos, this.state.dones, this.state.undones);
  };
  changeTodo = (e) => {
    e.currentTarget.style.display = "none";
    e.currentTarget.nextSibling.style.display = "inline";
    e.currentTarget.nextSibling.focus();
  };
  doneChangeTodo = (e) => {
    if (!e.keyCode || e.keyCode === 13) {
      let curInput = e.currentTarget;
      let curSpan = e.currentTarget.previousSibling;
      let curChecked = curSpan.previousSibling.checked;

      let { todos, dones, undones } = this.state;
      todos[todos.indexOf(curSpan.innerText)] = curInput.value;
      if (curChecked) {
        dones[dones.indexOf(curSpan.innerText)] = curInput.value;
      } else {
        undones[undones.indexOf(curSpan.innerText)] = curInput.value;
      }
      this.setState({ todos: todos, dones: dones, undones: undones });
      this.updateDatabase();

      curSpan.style.display = "inline";
      curSpan.innerText = curInput.value;
      curInput.style.display = "none";
      console.log(this.state.todos, this.state.dones, this.state.undones);
    }
  };
  showDelIcon = (e) => {
    e.currentTarget.children[3].style.display = "inline";
  };
  hideDelIcon = (e) => {
    e.currentTarget.children[3].style.display = "none";
  };
  render() {
    return (
      <div className={css.todo}>
        <input className={css.todoInputArea} placeholder="What needs to be done?" onKeyDown={this.addTodo} />
        {this.state.todos.map((item, index) => {
          return (
            <div key={index} className={css.todoItem} onMouseOver={this.showDelIcon} onMouseOut={this.hideDelIcon}>
              <input
                className={css.todoItemInput}
                type="checkbox"
                onClick={this.checkTodo}
                defaultChecked={this.state.dones.indexOf(item) === -1 ? false : true}
              />
              <label
                className={this.state.dones.indexOf(item) === -1 ? css.todoItemText : css.todoItemTextDone}
                onKeyDown={this.changeTodo}
                onDoubleClick={this.changeTodo}
              >
                {item}
              </label>
              <input
                className={css.todoItemTextEditing}
                defaultValue={item}
                onBlur={this.doneChangeTodo}
                onKeyDown={this.doneChangeTodo}
              />
              <span className={css.todoItemDel} onClick={this.delTodo}>
                ×
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}
