import React,{Component} from 'react'

export default class App extends Component{

  state = {
    count:0
  }

  /*
  思路:获取当前状态中的count值,获取选择框中的值,判断进行加减
  */
  //加法
  increment = () => {
    //获取选择框中的值
    let {value} = this.refs.selectNumber
    //获取状态中的值
    let {count} = this.state
    //设置状态中的值
    this.setState({count:count+value*1})
  }
  //减法
  decrement = () => {
    //获取选择框中的值
    let {value} = this.refs.selectNumber
    //获取状态中的值
    let {count} = this.state
    //设置状态中的值
    this.setState({count:count-value*1})
  }
  //计数加法
  incrementIfOdd = () => {
    let {value} = this.refs.selectNumber
    let {count} = this.state
    if(count%2 === 1){
      this.setState({count:count+value*1})
    }
  }
  //异步加
  incrementAsync = () => {
    let {value} = this.refs.selectNumber
    let {count} = this.state
    setTimeout(() => {
      this.setState({count:count+value*1})
    }, 1000);
  }
  render(){
    let {count} = this.state
    return (
      <div>
        <h3>当前计数为{count}</h3>
        <select ref='selectNumber'>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.incrementIfOdd}>incrementIfOdd</button>
        <button onClick={this.incrementAsync}>increment async</button>
      </div>
    )
  }
}