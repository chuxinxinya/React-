import {SAVE_PROD_List} from '../action_types'

//初始化userInfo数据
let initState = ''

export default function test(preState=initState,action) {
  const {type,data} = action
  let newState
  switch (type) {
    case SAVE_PROD_List: //保存user和token
      newState = data
      return newState 
    default:
      return preState
  }
}