// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database('kuaTopic')  //环境ID 
const kuaTopic = db.collection('kuaTopic')  //数据库-集合名称 // 云函数入口函数 
exports.main = async(event, context) => {
  try {
    return await kuaTopic.doc(event).update({
      data: event.question
    })
  } catch (e) {
    console.error(e)
  }
}