import request from '../utils/request'
export interface IOrderQuery {
  pageSize?: number,
  page?: number,
  orderId?: number,
  orderName?: string,
  orderDescription?: string,
}
function orderQueryBy(params: IOrderQuery){
  return request('/orders',{
    method:'GET',
    params: params
  })
}
export interface IOrderItem {
  orderId:number,
  orderName:string,
  amount:number,
  orderDescription?:string,
}
function createOrder(params: IOrderItem){
  return request('/orders',{
    method:'POST',
    data: params
  })
}
function updateOrder(params: IOrderItem){
  return request(`/orders/${params.orderId}`,{
    method:'PATCH',
    data: params
  })
}
function deleteOrder(id:number){
  return request(`/orders/${id}`,{
    method: 'DELETE'
  })
}
export {orderQueryBy,createOrder,updateOrder,deleteOrder}
