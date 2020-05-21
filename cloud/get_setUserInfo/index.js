// 云函数入口文件
const cloud = require('wx-server-sdk')
const md5 = require('md5-node')

cloud.init()
//定义数据库变量
const db = cloud.database()
const userTable = db.collection('users')
const _ = db.command

// 云函数入口函数,根据传递的参数update(更新用户微信信息),getself(获取用户微信信息),setSelf(设置用户微信信息),getOthers(获取其他用户所有信息)
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("云函数入口事件：")
  // console.log(event)
  // console.log(context)
  //更新用户微信信息
  if(event.update == true){
    try{
      return await userTable.doc(md5(wxContext.OPENID)).update({
        data:{wxUserInfo:_.set(event.wxUserInfo)}
      })
    } catch(e){
      console.error(e)
    }
  }
  //获取用户微信信息并返回
  else if(event.getSelf == true){
    console.log("开始查询")
    try{
      return await userTable.doc(md5(wxContext.OPENID)).field({openid:false}).get()
    } catch(e){
      console.error(e)
    }
  }
  //添加用户微信信息
  else if(event.setSelf == true){
    try{
      console.log("开始注册",event)
      return await userTable.add({
        data:{
          _id: md5(wxContext.OPENID),
          openid: wxContext.OPENID,
          wxUserInfo: event.wxUserInfo,
          staffUserInfo: {},
          userType: event.userType
        }
      })
    } catch (e){
      console.error(e)
    }
  }
  
}