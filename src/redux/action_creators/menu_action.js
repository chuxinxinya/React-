import {SAVE_TITLE} from '../action_types'

//创建保存用户信息的action
export const creatSaveTitleAction = (value)=> {
  return {type:SAVE_TITLE,data:value}
}