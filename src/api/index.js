/* 
  1.项目中所有请求由该文件发出
  2.以后每当发请求之前，都要在该文件里添加一个方法
*/
import jsonp from 'jsonp'
import {message} from 'antd'
//引入我们自定义的myAxios
import myAxios from './myAxios'
//引入请求的基本路径
import {BASE_URL,CITY,WEATHER_AK} from '../config'


//发起登录请求
export const reqLogin = (username,password)=> myAxios.post(`${BASE_URL}/login`,{username,password})

//商品分类的请求
export const reqGetCategory = ()=>myAxios.get(`${BASE_URL}/manage/category/list`)

//天气的请求
export const reqWeather = ()=> {
  return new Promise((resolve,reject) => {
    jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${WEATHER_AK}`,(err,data) => {
      if(err){
        message.error('请求失败,请联系管理员')
        return new Promise(() => {})
      }else{
        const {dayPictureUrl,temperature,weather} = data.results[0].weather_data[0]
        let weatherObj = {dayPictureUrl,temperature,weather}
        resolve(weatherObj)
      }
    })
  })
}

//添加商品分类的请求
export const reqAddCategory = ({categoryName}) => myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName})

//修改商品分类的请求
export const reqUpdateCategory = ({categoryName,categoryId}) => myAxios.post(`${BASE_URL}/manage/category/update`,{categoryName,categoryId})

//请求商品分类数据
export const reqGetProductList = (pageNum,pageSize)=>myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})

//搜索商品
export const reqSearchProduct = (pageNum,pageSize,searchType,keyword)=>myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyword}})

//更新商品状态
export const updateProductStatue = (productId,status) => myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})

//根据商品的ID获取商品
export const getProdById = (productId)=>myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})

