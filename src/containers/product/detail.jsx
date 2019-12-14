import React, { Component } from 'react'
import {connect} from "react-redux";
import {Button,Card,Icon,List, message} from "antd";
import {getProdById,reqGetCategory} from '../../api'
import './detail.less'
const {Item} = List


@connect(
  state => ({
    productList:state.productList,
    categoryList:state.categoryList
  })
)
class Detail extends Component {

  state = {
    imgs:[],
    name:'',
    desc:'',
    price:'',
    categoryId:'',
    categoryName:'',
    detail:'',
    isLoading:true
  }

  componentDidMount(){
    //获取id
    let {id} = this.props.match.params
    //尝试从redux中读取
    const reduxProductList = this.props.productList
    const reduxCategoryList = this.props.categoryList
    //遍历数据,寻找id相同的
    if (reduxProductList.length) {
      let result = reduxProductList.find((item) => item._id === id)
      if (result) {
        this.categoryId = result.categoryId
        this.setState({...result})
      }
    }
    else this.getProdById(id)
    //尝试从redux读取数据
    if (reduxCategoryList.length) {
      let result = reduxCategoryList.find(item => item._id === this.categoryId)
      if (result) this.setState({categoryName:result.name,isLoading:false})
    }
    else this.getCategorylist()
  }

  //向服务器发送请求,通过id获取商品
  getProdById = async(id)=>{
    //发请求
    let result = await getProdById(id)
    //解构赋值
    const {status,data,msg} = result
    if(status === 0) {
      //获取该商品的分类id
      this.categoryId = data.categoryId
      this.setState({...data})
    }
    else message.error(msg)
  }

  //向服务器发送请求,通过分类id获取分类名称
  getCategorylist = async()=>{
    //发送请求
    let result = await reqGetCategory()
    //解构赋值
    const {status,data,msg} = result
    //根据返回的状态判断
    if(status === 0) {
      //遍历数据寻找id相同的
      let result = data.find((item) => item._id === this.categoryId)
      if(result) this.setState({categoryName:result.name,isLoading:false})
    }
    else message.error(msg)
  }

  render() {
    return (
      <Card title={
        <div className='left-top'>
          <Button type='link' size='small' onClick={()=>{this.props.history.goBack()}}>
            <Icon type="arrow-left" style={{fontSize:'20px'}} />
          </Button>
          <span>商品详情</span>
        </div>
        
        
      }>
      <List isLoading={this.state.isLoading}>
        <Item>
          <span className='prod_title'>商品名称:</span>
          <span>{this.state.name}</span>
        </Item>
        <Item>
          <span className='prod_title'>商品描述:</span>
          <span>{this.state.desc}</span>
        </Item>
        <Item>
          <span className='prod_title'>商品价格:</span>
          <span>{this.state.price}</span>
        </Item>
        <Item>
          <span className='prod_title'>所属分类:</span>
          <span>{this.state.categoryName}</span>
        </Item>
        <Item>
          <span className='prod_title'>商品图片:</span>
          {
            this.state.imgs.map((item,index)=>{
              return <img key={index} src={'/upload/'+item} alt='商品图片'/>
            })
          }
        </Item>
        <Item>
          <span className='prod_title'>商品详情:</span>
          <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
        </Item>
      </List>
    </Card>
    )
  }
}

export default Detail
