import React,{Component} from 'react'
import {connect} from "react-redux";
import {Card,Select,Button,Icon,Input,Table, message} from 'antd'
import {creatSaveProductAction} from '../../redux/action_creators/product_action'
import {reqGetProductList,reqSearchProduct,updateProductStatue} from '../../api'
import {PAGE_SIZE} from "../../config";
const {Option} = Select;

@connect(
  state => ({}),
  {saveProduct:creatSaveProductAction}
)
class Product extends Component{

  state = {
    productList:[],
    current:'',
    total:'',
    searchType:'productName',
    keyword:''
  }

  componentDidMount(){
    this.getproductList()
  }

  //获取商品数据
  getproductList = async(number=1)=>{
    let result
    const {searchType,keyword} = this.state
    //判断实例身上isSearch
    if (this.isSearch) result = await reqSearchProduct(number,PAGE_SIZE,searchType,keyword)
    //发送请求
    else result = await reqGetProductList(number,PAGE_SIZE)
    //解构赋值
    let {status,data} = result
    if (status === 0) {
      this.setState({
        productList:data.list,
        current:data.pageNum,
        total:data.total
      })
      //保存进redux
      this.props.saveProduct(data.list)
    }
    else message.error('获取商品失败')
  }

  //更新商品状态
  updateProduct = async({_id,status})=>{
    //从状态中将数据取出
    let productList = [...this.state.productList]
    //判断状态,更改状态
    if(status === 1) status = 2
    else status = 1
    //发送请求
    let result = await updateProductStatue(_id,status)
    //判断
    if(result.status === 0) {
      message.success('更新商品状态成功')
      productList = productList.map((item)=>{
        if (item._id === _id) {
          item.status = status
        }
        return item
      })
      //设置状态
      this.setState({productList})
    }
    else message.error('更新商品状态失败')
  }

  SearchProduct = ()=>{
    this.isSearch = true
    this.getproductList()
  }


  render(){
    const dataSource = this.state.productList
    
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        width:'9%',
        align:'center',
        render:price => '￥'+price
      },
      {
        title: '状态',
        //dataIndex: 'status',
        key: 'status',
        width:'10%',
        align:'center',
        render:(item)=>{
          return (
            <div>
              <Button type={item.status === 1 ? 'danger':'primary'} onClick={()=>{this.updateProduct(item)}}>
                {item.status === 1 ? '下架':'上架'}
              </Button><br/>
              <span>{item.status === 1 ? '在售':'停售'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        //dataIndex: 'prod',
        key: 'prod',
        width:'10%',
        align:'center',
        render:(item)=>{
          return (
            <div>
              <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button><br/>
              <Button type='link' onClick={()=>{this.props.history.push('/admin/prod_ahout/product/add_update/rtyuiocgh')}}>修改</Button>
            </div>
          )
        }
      },
    ];
    
    return (
      <Card 
        title={
          <div>
            <Select defaultValue="productName">
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input 
              placeholder="关键字" 
              style={{width:'25%',margin:'0px 10px'}}
              allowClear
              onChange={event => this.setState({keyword:event.target.value})}
            />
            <Button type='primary' onClick={this.SearchProduct}>搜索</Button>
          </div>
        } 
        extra={<Button type='primary' onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}>
          <Icon type="plus" 
        />
          添加商品
        </Button>}
      >
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          bordered 
          rowKey='_id'
          pagination={{
            total:this.state.total,
            pageSize:PAGE_SIZE,
            current:this.state.current,
            onChange:this.getproductList
          }}
            
          
        />;
    </Card>
    )
  }
}
export default Product