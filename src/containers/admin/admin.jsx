import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Route,Switch,Redirect} from 'react-router-dom'
import { Layout } from 'antd';
import {createDeleteUserInfoAction} from '../../redux/action_creators/login_action'
//import {reqCategoryList} from "../../api";
import './css/admin.less'
import Header from './header/header'
import LeftNav from './left_nav/left_nav'
import Home from '../../component/home/home';
import Category from '../category/category';
import Product from '../product/product'
import Detail from '../product/detail.jsx'
import AppUpdate from '../product/add_update'
import User from '../user/user';
import Role from '../role/role';
import Bar from '../bar/bar';
import Line from '../line/line';
import Pie from '../pie/pie';
const { Footer, Sider, Content } = Layout;

@connect(
  state => ({userInfo:state.userInfo}),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
)
class Admin extends Component{

  //在render里，若想实现跳转，最好用<Redirect>
  render(){
    //从redux中获取user和isLogin
    const {isLogin} = this.props.userInfo
    if(!isLogin){
      return <Redirect to="/login"/>
    }else{
      return (
        <Layout className='admin'>
          <Sider className='sider'>
            <LeftNav/>
          </Sider>
          <Layout>
            <Header className='header'>Header</Header>
            <Content className='content'>
              <Switch>
                <Route path='/admin/home' component={Home}/>
                <Route path='/admin/prod_about/category' component={Category}/>
                <Route path='/admin/prod_about/product' component={Product} exact/>
                <Route path='/admin/prod_about/product/detail/:id' component={Detail}/>
                <Route path='/admin/prod_about/product/add_update' component={AppUpdate} exact/>
                <Route path='/admin/prod_about/product/add_update/:id' component={AppUpdate}/>
                <Route path='/admin/user' component={User}/>
                <Route path='/admin/role' component={Role}/>
                <Route path='/admin/charts/bar' component={Bar}/>
                <Route path='/admin/charts/line' component={Line}/>
                <Route path='/admin/charts/pie' component={Pie}/>
                <Redirect to='/admin/home'/>
              </Switch>
            </Content>
            <Footer className='footer'>推荐使用谷歌浏览器,可以获得更佳的页面体验</Footer>
          </Layout>
        </Layout>
      )
    }
  }
}

//从redux中获取状态和操作状态的方法
export default Admin