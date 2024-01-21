import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, notification } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { createOrder, IOrderItem, updateOrder } from '../../../api/order'

export enum ModalType {
  Edit,
  Add,
}
interface IOrderModal {
    type: ModalType, 
    onClose: ()=>void,
    payload: IOrderItem | null,
}
const OrderModal: React.FC<IOrderModal> = (props) => {
  const {payload, onClose, type} = props
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm()

  useEffect(()=>{
    if(!!payload){
      form.setFieldsValue(payload)
      return
    }
    console.log('ismodalopen',isModalOpen)
    if(isModalOpen){
      form.resetFields(undefined)
      return
    }
  },[payload,isModalOpen])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields()
    .then(async (values)=>{
      let info: string;
      if(type === ModalType.Edit && Boolean(payload)){
        info = "订单更新成功"
        await updateOrder({...values,orderId: payload!.orderId})
      }else{
        info = "订单创建成功"
        await createOrder(values)
      }
      notification.success({
        message:'success',
        description: info,
      })
      setIsModalOpen(false);
      onClose()
    })
    .catch(error=>{
      console.log('error',error)
    })
  };

  const handleCancel = () => {
    onClose()
    setIsModalOpen(false);
  };
  const open = isModalOpen || Boolean(payload) 
  console.log('payload',payload)
  return (
    <>
      <Button type="primary" onClick={showModal}>
        新建订单
      </Button>
      <Modal 
        title="新建订单" 
        open={open} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical" >
          <Form.Item label="订单名称" name="orderName"  rules={[{required:true,message:"请输入订单名称"}]} tooltip="This is a required field">
              <Input placeholder="请输入订单名称" />
          </Form.Item>
          <Form.Item label="金额" name="amount" rules={[{required:true,message:"请输入订单金额"}]}tooltip="This is a required field">
            <InputNumber style={{width:'100%'}} placeholder="请输入订单金额" />
          </Form.Item>
          <Form.Item
            label="订单描述"
            name="orderDescription"
            tooltip={{ title: 'Tooltip with customize icon', icon: <InfoCircleOutlined /> }}
          >
            <Input placeholder="请输入订单备注" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(OrderModal);
