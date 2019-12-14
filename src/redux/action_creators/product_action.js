import {SAVE_PROD_List} from '../action_types'

//创建保存用户信息的action
export const creatSaveProductAction = (value)=> {
  return {type:SAVE_PROD_List,data:value}
}