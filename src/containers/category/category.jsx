import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Card,Button,Table,message,Modal,Form,Input,Icon} from 'antd';
import {reqGetCategory,reqAddCategory,reqUpdateCategory} from '../../api'
import {createSaveCategoryAction} from '../../redux/action_creators/category_action';
const {Item} = Form

@connect(
  state => ({}),
  {saveCategory:createSaveCategoryAction}
)
@Form.create()
class Category extends Component{

  state = {
    categoryList:[],  //商品分类数据
    isLoading:true,   //是否加载
    visible: false,   //是否展示弹窗
    operType:'',    //操作类型
    modalCurrrentValue:'',   //弹窗显示的值,用于数据回显
    modalCurrentId:''   //当前数据的id

  }

  componentDidMount(){
    this.getCategory()
  }

  //用于设置点击添加分类
  showAdd = ()=>{
    this.setState({
      visible:true,
      operType:'add',
      modalCurrrentValue:'',
      modalCurrentId:''
    })
  }

  //用于设置点击修改分类
  showUpdate = (item)=>{
    const {_id,name} = item
    this.setState({
      visible:true,
      operType:'update',
      modalCurrrentValue:name,
      modalCurrentId:_id
    })
  }
  

  //请求商品分类
  getCategory = async()=>{
    let result = await reqGetCategory()
    //取消isloading
    this.setState({isLoading:false})
    //从result解构赋值
    let {status,data,msg} = result
    //如果返回的状态为0,代表数据成功,将数据设置进状态中
    if (status === 0) {
      this.setState({categoryList:data.reverse()})
      //将数据存入redux
      this.props.saveCategory(data)
    }
    //否则数据请求出错,提示错误
    else message.error(msg,1)
  }

  //真正用于处理添加分类的请求
  addCategory = async(values)=>{
    console.log(values)
    let result = await reqAddCategory(values)
    const {status,data,msg} = result
    if (status === 0) {
      message.success('商品添加成功')
      //原则:尽量不直接修改元数据
      let categoryList = [...this.state.categoryList]
      //向数据的开始位置追加输入的数据
      categoryList.unshift(data)
      //设置新数据维护进状态
      this.setState({categoryList,visible:false})
      //重置表单
      this.props.form.resetFields()
    }
    if (status === 1) message.error(msg,1)

  }

  //真正用于处理修改分类的请求
  updateCategory = async(categoryObj)=>{
    let result = await reqUpdateCategory(categoryObj)
    const {status,msg} = result
    if(status===0) {
      message.success('成功修改了商品的分类',1)
      //重新请求商品列表
      this.getCategory()
      //关闭弹窗
      this.setState({visible:false})
      //重置表单
      this.props.form.resetFields()
    }else{
      message.error(msg,1)
    }


  }


  //点击确定按钮
  handleOk = () => {
    //校验数据
    const {operType} = this.state
    this.props.form.validateFields((err,values)=>{
      if(err) message.warning('信息输入有误,请重新输入',1)
      if(operType==='add') this.addCategory(values)
      if(operType==='update') {
        const categoryName = values.categoryName
        const categoryId = this.state.modalCurrentId
        const categoryObj = {categoryName,categoryId}
        this.updateCategory(categoryObj)
      }
    })
  };

  //点击取消按钮
  handleCancel = () => {
    this.setState({
      visible: false,
    });
    //重置表单
    this.props.form.resetFields()
  };

  
  render(){
    const {operType,visible} = this.state
    const {getFieldDecorator} = this.props.form
    const columns = [
      {
        title: '商品分类',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        key: 'age',
        render:(item)=> {return <Button type='link' onClick={()=>{this.showUpdate(item)}}>修改分类</Button>},
        width:'25%',
      }
    ]
    return (
      <div>
        <Card extra={<Button type='link' onClick={this.showAdd}><Icon type="plus-circle" />添加分类</Button>}>
          <Table 
            dataSource={this.state.categoryList} 
            columns={columns} 
            bordered 
            pagination={{pageSize:5,showQuickJumper:true}}
            rowKey='_id'
            loading={this.state.isLoading}
          />
        </Card>
        <Modal
          title={operType === 'add' ? '添加分类':'修改分类'}
          visible={visible}
          okText='确定'
          cancelText='取消'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className='login-form'>
            <Item>
              {getFieldDecorator('categoryName', {
                  initModalValue:this.state.modalCurrrentValue,
                  rules: [
                    {required: true, message: '用户名必须输入！'},
                  ],
                })(
                  <Input placeholder="请输入商品分类名"/>,
                )}
            </Item>
          </Form>
          
        </Modal>
      </div>
      
    )
  }
}
export default Category