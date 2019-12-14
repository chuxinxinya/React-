import React,{Component} from 'react'
import {connect} from "react-redux";
import {Link,withRouter} from 'react-router-dom'
import {Menu,Icon} from 'antd';
import './css/left_nav.less'
import menuList from '../../../config/menu_config'
import {creatSaveTitleAction} from '../../../redux/action_creators/menu_action'
import logo from '../../../static/imgs/logo.png'
const {Item,SubMenu} = Menu;

@connect(
  state => ({}),
  {saveTitle:creatSaveTitleAction}
)
@withRouter
 class LeftNav extends Component{

  createMenu = (target)=>{
   return target.map((item)=>{
      if (!item.children) {
        return (
          <Item key={item.key} onClick={()=>{
            this.props.saveTitle(item.title)
          }}>
            <Link to={item.path}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link> 
          </Item>
        )
      }else{
        return (
          <SubMenu
            key= {item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.createMenu(item.children)}
          </SubMenu>
        )
      }
    })
  }

  render(){
    
    return (
      <div>
        <header  className='leftHeader'>
          <img src={logo} alt="logo"/>
          <h3>商品管理系统</h3>
        </header>
        <Menu
          defaultSelectedKeys={this.props.location.pathname.split('/').reverse()[0]}
          defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
          style={{height:'calc(100vh - 80px)'}}
        >
          {this.createMenu(menuList)}
        </Menu>
      </div>
)
  }
}

export default LeftNav