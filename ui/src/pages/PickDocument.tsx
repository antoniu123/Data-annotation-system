import {Document as File} from "../models/Document"
import {Button, Card, Modal, Table} from "antd";
import * as React from "react";
import {useState} from "react";
import {url} from "../tag/url";

interface PickDocumentProps {
    documents: File[]
    pick: (doc:File) => void
    close: () => void
}

const PickDocument: React.VFC<PickDocumentProps> = ({documents, pick, close}) => {

    const [file, setFile] = useState<File|undefined>(undefined)

    const rowSelection : object = {
        type: 'radio',
        onChange: (selectedRowKeys: number) => {
            console.log(`change: ${selectedRowKeys}`);
        },
        onSelect: (record : File) => {
            console.log('select:', record);
            setFile(record)
        },
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Document',
            dataIndex: "id",
            key: 'document',
            render: (value: number) => <Card
                hoverable
                style={{ width: 120, height: 60 }}
                cover = {
                    value ? <img alt="example" src={ `${url(value)}` } />: <> </>
                }
            >
            </Card>,
            width: '20px'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'File Name',
            dataIndex: 'fileName',
            key: 'fileName',
        },
    ];

    return (
        <Modal visible={true} footer={null} title={null} maskClosable={false} closable={true} onCancel={()=>close()} width={600}>
            <Table rowKey={record => record.id}  columns={columns} rowSelection={rowSelection}
                    dataSource={documents.filter(d=>d.documentType==='image/jpeg')}
                   scroll={{ x: 400, y: undefined }}/>
            <Button onClick={()=>{
                pick(file ? file : undefined as unknown as File)
                close()
            }}>
                Ok
            </Button>
        </Modal>
    )
}

export default PickDocument