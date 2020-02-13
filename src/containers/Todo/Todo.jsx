import React from "react";
import css from "./Todo.module.scss";

export default class Todo extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: ["吃饭", "睡觉", "打豆豆"],
      dones: [],
      undones: ["吃饭", "睡觉", "打豆豆"]
    };
  }
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
      inputBar.value = "";
    }
  };
  checkTodo = (e) => {
    let curTodoSpan = e.currentTarget.nextSibling;
    let curTodo = e.currentTarget.nextSibling.innerText;
    let { dones, undones } = this.state;
    if (e.currentTarget.checked) {
      curTodoSpan.className = "done";
      dones.push(curTodo);
      undones.splice(undones.indexOf(curTodo), 1);
    } else {
      curTodoSpan.className = "";
      undones.push(curTodo);
      dones.splice(dones.indexOf(curTodo), 1);
    }
    this.setState({ dones: dones, undones: undones });
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
  };
  showDelIcon = (e) => {
    e.currentTarget.children[2].style.display = "inline";
  };
  hideDelIcon = (e) => {
    e.currentTarget.children[2].style.display = "none";
  };
  render() {
    return (
      <div className={css.todo}>
        <input className={css.inputArea} placeholder="What needs to be done?" onKeyDown={this.addTodo} />
        {this.state.todos.map((item, index) => {
          return (
            <div key={index} className={css.todoItem} onMouseOver={this.showDelIcon} onMouseOut={this.hideDelIcon}>
              <input className={css.todoItemInput} type="checkbox" onClick={this.checkTodo} />
              <span>{item}</span>
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
