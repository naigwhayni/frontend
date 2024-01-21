import { SearchOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { IOrderQuery } from '../../../api/order';

const { Search } = Input;

const options = [
  {
    value: 'orderName',
    label: '订单名称',
  },
  {
    value: 'orderId',
    label: '订单ID',
  },
];

interface ISearch{
  onSearch: (param: IOrderQuery) => void
}

const CustomSearch: React.FC<ISearch> = (props: ISearch) => {
  const [searchKey, setSearchKey] = useState('orderName')
  const {onSearch} = props
  const handleSearch = useCallback((e: string)=>{
    onSearch({[searchKey]: e})
  },[searchKey])
  const onSearchKeyChange = useCallback((e: string)=>{
    setSearchKey(e)
  },[])
  return (
    <Space direction="vertical" size="middle">
      <Space.Compact>
        <Select style={{width:'150px'}} defaultValue= {searchKey}options={options} onChange={onSearchKeyChange} />
        <Input.Search placeholder="请输入查询条件" onSearch={handleSearch} />
      </Space.Compact>
    </Space>
  );
}

export default CustomSearch;
