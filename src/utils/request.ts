import {notification} from 'antd'
import { extend } from 'umi-request'
const baseUrl ="http://localhost:3000"
type ICodeMessage = {
  [index:number]:string
}
const codeMessage: ICodeMessage = {
  200:'服务器成功返回请求的数据',
  204:'删除数据成功',
  404:'发出去的请求针对的是服务器不存在的记录，服务器没有进行操作',
  500:'服务器发生错误，请检查服务器',
  502:'网关错误',
}
/**
 * 异常处理
 */
interface IError {
  response:any
}
const errorHandler = (error: IError) =>{

  const {response} = error
  if(!response){
    notification.error({
     message:'网络异常',
     description:'您的网络发生异常，无法连接服务器',
    })
    return
  }
  if(response && response.status){
    const {status, url} = response;
    const errorText = codeMessage[status] || response.status.Text;
    notification.error({
      message:`请求错误 ${status}: ${url}`,
      description: errorText
    })
  }
}

const request = extend({
  prefix: baseUrl,
  errorHandler,
  //credentials:'include'
})

export default request
