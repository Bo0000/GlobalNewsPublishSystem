import React, { useContext, useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { Table, Button, Modal,Form,Input } from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal
export default function NewsCategory(props) {
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get(`/categories`).then(res => {
      const list = res.data
      setDataSource(list)
    })
  }, [])
  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} style={{width:"200px"}}/>
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  const handleSave = (record) => {
    setDataSource(dataSource.map(item=>{
      if(item.id===record.id){
        return {
          id:item.id,
          value:record.title,
          title:record.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`,{
      value:record.title,
      title:record.title
    })
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '????????????',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '????????????',
        handleSave:handleSave,
      }),
      width:"50%"
    },
    {
      title: "??????",
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} style={{ "marginRight": "5px" }} />
        </div>
      }
    }
  ]

  const showConfirm = (item) => {
    confirm({
      title: '??????????????????????',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        pagination={{
          pageSize: 5
        }} />
    </div>
  )
}
