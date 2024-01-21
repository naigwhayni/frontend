import React, { useCallback, useState, useEffect, useMemo } from 'react'
import {Button,Table, Popconfirm, Space} from 'antd'
import CustomSearch from './components/CustomSearch'
import OrderModal,{ModalType} from './components/OrderModal'
import { orderQueryBy, IOrderQuery, IOrderItem, deleteOrder } from '../../api/order'
import { ColumnsType } from 'antd/es/table'


function Order(){
  const [orderQuery,setOrderQuery] = useState({page:1,pageSize:5})
  const [orderData, setOrderData] = useState([])
  const [modalType,setModalType] = useState(ModalType.Add)
  const [currentOrder, setCurrentOrder] = useState<IOrderItem | null>(null)
  const [paginationData, setPaginationData] = useState({defaultCurrent: 1, defaultPageSize: 5})
  const handleSearch = useCallback((query:IOrderQuery )=>{
    const {orderName,orderId} = query
    setOrderQuery((orderQuery) => ({...orderQuery,orderName,orderId}))
  },[])
  const handleClose = useCallback(()=>{
    // refresh after addding new order
    setCurrentOrder(null)
    setOrderQuery((orderQuery) => ({...orderQuery}))
  },[])
  useEffect(()=>{
    orderQueryBy(orderQuery)
    .then(res =>{
      const {data, ...pagination} = res
      setOrderData(data)
      setPaginationData(pagination)
    })
  },[orderQuery])
  const handleDelete = useCallback(async (id: number)=>{
    await deleteOrder(id)
    setOrderQuery((orderQuery)=>({...orderQuery}))
  },[])
  const handleEdit = useCallback((orderItem: IOrderItem)=>{
    setModalType(ModalType.Edit)
    setCurrentOrder(orderItem)
  },[])
  const handlePageChange = useCallback((current: number)=>{
    setOrderQuery((orderQuery)=>({...orderQuery,page: current}))
  },[])
  const orderColumns:ColumnsType<IOrderItem> = [
    {
      title:'id',
      dataIndex: 'orderId',
    },
    {
      title:'订单名称',
      dataIndex: 'orderName',
    },
    {
      title:'金额',
      dataIndex: 'amount',
    },
    {
      title:'描述',
      dataIndex: 'orderDescription',
    },
   {
    title: 'operation',
    dataIndex: 'operation',
    render: (_, record: IOrderItem) =>
      orderData.length >= 1 ? (
        <Space>
          <Popconfirm title="确定要删除？" onConfirm={() => handleDelete(record.orderId)}>
            <a>删除</a>
          </Popconfirm>
          <a onClick={()=>{handleEdit(record)}}>编辑</a>
        </Space>
      ) : null,
    },
  ]
  return (
    <div className="container">
      <header className="header">
         <OrderModal type={modalType} payload={currentOrder} onClose={handleClose}/>
         <CustomSearch onSearch={handleSearch}/>
       </header>
      <Table 
        columns={orderColumns}
        bordered 
        dataSource={orderData}
        rowKey={row => row.orderId}
        pagination={{...paginationData,onChange: handlePageChange}}
      />
    </div>
  )
}

export default Order;
