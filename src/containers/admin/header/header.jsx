
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Icon,Button,Modal} from "antd";
import screenfull from 'screenfull'
import dayjs from 'dayjs'
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
import {reqWeather} from '../../../api'
import menuList from '../../../config/menu_config'
import './css/header.less'
const {confirm} = Modal;

@connect(
  state => ({
    userInfo:state.userInfo,
    title:state.title
  }),
  {deleteUser:createDeleteUserInfoAction}
)
@withRouter
class Header extends Component{

  state = {
    isFull:false,
    date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    weatherInfo:{},
    title:''
  }

  //挂载后设置定时器,全屏发生改变的事件
  componentDidMount(){
    screenfull.on('change', () => {
      this.setState({isFull:!this.state.isFull})
    });
    this.timeID=setInterval(() => {
      this.setState({date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})
    }, 1000);
    //当代码挂载到页面时,请求天气
    this.getWeather()
    this.getTitle()
  }

  //卸载前清除定时器
  componentWillUnmount(){
    clearInterval(this.timeID)
  }

  //全屏
  fullScreen = ()=>{
    screenfull.toggle();
  }

  //请求天气
  getWeather = async()=>{
    let weather = await reqWeather()
    //设置状态中的weatherinfo
    this.setState({weatherInfo:weather})
  }

  //退出登录
  logout = ()=>{
    let {deleteUser} = this.props
    confirm({
      title: '你确定删除吗?',
      content: '确定删除后,需重新登录',
      onOk() {
        deleteUser()
      },
    });
  }

  //保存title
  getTitle = ()=>{
    //从获取地址栏
    let {pathname} = this.props.location
    //截取地址栏
    let pathkey = pathname.split('/').reverse()[0]
    //判断地址栏中是否包含product
    if (pathname.indexOf('product') !== -1) pathkey='product'
    let title=''
    //遍历数据
    menuList.forEach((item)=>{
      //判断是否有二级菜单
      if(item.children instanceof Array){
       let tmp = item.children.find((citem)=>{
          return citem.key === pathkey
        })
        if(tmp) title = tmp.title
      }else{
        if (pathkey === item.key) title = item.title
      }
    })
    //将title设置进状态
    this.setState({title})
  }


  render(){
    let {isFull,weatherInfo} = this.state
    let {user} = this.props.userInfo
    return (
      <div className='header'>
        <div className='header-top'>
          <Button size='small' onClick={this.fullScreen}>
            <Icon type={isFull ? 'fullscreen-exit' : 'fullscreen'} />
          </Button>
          <span className='username'>欢迎{user.username}登录</span>
          <Button type='link' onClick={this.logout}>退出</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            {this.props.title || this.state.title}
          </div>
          <div className="header-bottom-right">
            {this.state.date}
            <img src={weatherInfo.dayPictureUrl} alt="天气信息"/>
            {weatherInfo.weather} 温度:{weatherInfo.temperature}
          </div>
        </div>
      </div>
    )
  }
}
export default Header