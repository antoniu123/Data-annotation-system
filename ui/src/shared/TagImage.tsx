import { useMachine } from "@xstate/react"
import { Alert, Button, Form, Input, Modal, Result, Space, Spin, Table } from "antd"
import { ColumnProps } from "antd/lib/table"
import axios from "axios"
import { useState } from "react"
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker"
import { assign, Machine } from "xstate"
import { ImageDetail } from "../models/ImageDetail"
import Match from "./Match"
import LineTo from 'react-lineto';


// const formItemLayout = {
//     labelCol: {
//       span: 6
//     },
//     wrapperCol: {
//       span: 5
//     }
//   }
  
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 }
    }
  }

interface TagImageProps {
    docId: number
    urlImage: string
    visible: boolean
    onClose: () => void
    onRefresh: (cnt: number) => void
}

const TagImage: React.FC<TagImageProps> = ({docId, urlImage, visible, onClose, onRefresh}) => {

    const [tagState, send] = useMachine(createTagImageMachine(docId))
         
    const [addEditVisible, setAddEditVisible] = useState(false);

    const [markers, setMarkers] = useState<Array<Marker>>([]);

    const [newImageDetails, setNewImageDetails] = useState<Array<ImageDetail>>([]);
    
    const CustomMarker = (props: MarkerComponentProps) => {
        return (
            <div className={`${props.itemNumber} hover:`}>
                *
            </div>
            // <p className={`custom-marker ${props.itemNumber}`}>
            //     {tagState.context.documentDetails[props.itemNumber as number] ? 
            //       tagState.context.documentDetails[props.itemNumber as number].name : props.itemNumber}
            // </p>
        );
    };

    const putMarkers = () => {
        setMarkers(tagState.context.markers)
    }

    const onFinish = (values: any) => {
        let newDetails: ImageDetail[] = []
        values.items.forEach(
            (value:any,index:number) => {
                console.log(value)
                newDetails.push({id: undefined as unknown as number, name: value.name, 
                        description: value.description, x: value.x, y: value.y})
                
            }
        );

        send({type: 'SAVE', payload: { documentDetails: newDetails}})
        onRefresh(tagState.context.documentDetails.length + newDetails.length)
        setNewImageDetails([])
        setAddEditVisible(false)        
    }


    const columns: ColumnProps<ImageDetail>[]= [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'X',
            dataIndex: 'x',
            key: 'x',
        },
        {
            title: 'Y',
            dataIndex: 'y',
            key: 'y',
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (record: ImageDetail) => (
                <Button danger onClick={
                    () => {
                        send({
                            type: 'DELETE', payload: {documentDetailId: record.id}
                        })
                        onRefresh(tagState.context.documentDetails.length - 1)
                    }
                }> Delete </Button>
            )
        }
    ];
    return (
        <div>
            <Match on={['loadingDocumentDetails', 'deletingDocumentDetail']} state={tagState}>        
                <Spin>
                    <Alert message="Please wait for loading" type="info"/>
                </Spin>
            </Match>

            <Match on={['loadResolved']} state={tagState} >
                <Modal visible={visible} onCancel={onClose} width={800} title={null} footer={null}>
                    <div className="abc" onLoad={putMarkers}>
                        <ImageMarker
                            src={urlImage}
                            markers={markers}
                            onAddMarker={(marker: Marker) => {
                                setMarkers([...markers, marker])
                                const newDetail:ImageDetail = {
                                    id: undefined as unknown as number,
                                    name: '',
                                    description: '',
                                    x: marker.left as number,
                                    y: marker.top as number
                                }
                                setNewImageDetails([...newImageDetails,  newDetail])
                            }}
                            markerComponent={CustomMarker}
                        />
                        { markers.map((marker,index,array)=>(
                            <>
                               {index > 0 && (
                                  <LineTo delay={500} borderColor="red" from={`${index-1}`} to={`${index}`} within="abc"/>
                                )}
                            </>
                        ))
                        }
                        { markers.length > 2 && (
                            <LineTo delay={500} borderColor="red" from="0" to={`${markers.length-1}`} within="abc"/>
                        )}
                    </div>
                    <Modal visible={addEditVisible} onCancel={()=>setAddEditVisible(false)} 
                           width={600} title={"saving tag details ..."} 
                           closable={true} footer={null}>
                        <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={onFinish}>                      
                            <b>Tag Items</b>
                            <br/>
                            <Form.List name="items" initialValue={newImageDetails}>
                            {(fields, { add, remove }) => (
                                <>
                                {fields.map((field) => (
                                    <Space
                                    key={field.key}
                                    style={{ display: "flex", marginBottom: 8 }}
                                    align="baseline"
                                    >
                                    <Form.Item
                                        {...field}
                                        name={[field.name, "name"]}
                                        fieldKey={[field.fieldKey, "name"]}
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="name" />
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, "description"]}
                                        fieldKey={[field.fieldKey, "description"]}
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="description" />
                                    </Form.Item>
                                    </Space>
                                ))}
                                </>
                            )}
                            </Form.List>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <p className={"center_text"}>These are our tag records data</p>
                    <Button type="primary" onClick={
                        () => {
                            setAddEditVisible(true)
                        }
                    } disabled={newImageDetails.length === 0}>Add
                    </Button>
                    { tagState.context.documentDetails.length > 0 ?
                    <Table rowKey="id" dataSource={tagState.context.documentDetails} columns={columns} size="small"/> :
                    null }
                    {/* <AddEditTag key={documentDetailId}
                                  truckId={documentDetailId}
                                  visible={addEditVisible}
                                  onSubmit={() => setAddEditVisible(false)}
                                  onCancel={() => setAddEditVisible(false)}
                                  onRefresh={() => refresh()}
                    /> */}
                </Modal>     
            </Match>

            <Match on={['loadRejected']} state={tagState}>
                <Result
                    status="error"
                    title="Loading failed"
                    extra={<Button size="large" type="primary" onClick={() => {
                        send({
                            type: 'RETRY'
                        })
                    }}>Try Again</Button>}
                />                
            </Match>
        </div>
    )
    

}

export default TagImage

interface TagImageMachineContext {
    documentDetails: ImageDetail[]
    markers: Marker[]
}

interface TagImageMachineSchema {
    context: TagImageMachineContext
    states: {
        loadingDocumentDetails: {}
        loadResolved: {}
        loadRejected: {}
        deletingDocumentDetail: {}
        savingDocumentsDetails: {}
    }
}

type TagImageMachineEvent = | { type: 'RETRY' } |
      { type: 'DELETE'; payload: { documentDetailId: number } } | 
      { type: 'SAVE'; payload: { documentDetails: ImageDetail[] } }

const createTagImageMachine = (docId: number) => Machine<TagImageMachineContext, TagImageMachineSchema, TagImageMachineEvent>(
    {
        id: 'tag-machine',
        context: {
            documentDetails: [],
            markers: []
        },
        initial: 'loadingDocumentDetails',
        states: {
            loadingDocumentDetails: {
                invoke: {
                    id: 'loadingDocumentDetails',
                    src: 'loadDetails',
                    onDone: {
                        target: 'loadResolved',
                        actions: assign((context, event) => {
                            if (event.data.data)
                                return {
                                    documentDetails: event.data.data,
                                    markers: event.data.data.map((detail:ImageDetail) => {return {left: detail.x, top:detail.y} as Marker})
                                }
                            else
                                return {
                                    documentDetails: [],
                                    markers: []
                                }

                        })
                    },
                    onError: {
                        target: 'loadRejected'
                    }
                }
            },
            loadResolved: {
                on: {
                    RETRY: {
                        target: 'loadingDocumentDetails'
                    },
                    DELETE: {
                        target: 'deletingDocumentDetail'
                    },
                    SAVE: {
                        target: 'savingDocumentsDetails'
                    }
                }
            },
            loadRejected: {
                on: {
                    RETRY: {
                        target: 'loadingDocumentDetails'
                    }
                }
            },
            deletingDocumentDetail: {
                invoke: {
                    id: 'deletingDocumentDetail',
                    src: 'deleteDetailData',
                    onDone: {
                        target: 'loadingDocumentDetails'
                    },
                    onError: {
                        target: 'loadingDocumentDetails'
                    }
                }
            },
            savingDocumentsDetails: {
                invoke: {
                    id: 'savingDocumentsDetails',
                    src: 'saveDocumentDetails',
                    onDone: {
                        target: 'loadingDocumentDetails'
                    },
                    onError: {
                        target: 'loadingDocumentDetails'
                    }
                }
            }
        }
    },
    {
        
        services: {
            loadDetails: () => axios.get(`http://${process.env.REACT_APP_SERVER_NAME}/document/${docId}/details/all`),
            deleteDetailData: (id, event) => {
                const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                let detailId 
                if (event.type === 'DELETE')
                   detailId = event.payload.documentDetailId;
                return axios.delete(`http://${process.env.REACT_APP_SERVER_NAME}/documentDetail/${detailId}`, 
                 { headers: {'Authorization' : `Bearer ${token}`} } )
            },                
            saveDocumentDetails : (id, event) => {
                const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                if (event.type === 'SAVE')
                        return axios.post(`http://${process.env.REACT_APP_SERVER_NAME}/document/${docId}/detail`, 
                            event.payload.documentDetails, { headers: {'Authorization' : `Bearer ${token}`} } )
                return Promise.reject(() => "incorect type of event")
            }  
        }
    }
)