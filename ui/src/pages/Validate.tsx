import * as React from "react";
import {Alert, Button, Card, Result, Spin, Table} from "antd";
import {assign, Machine} from "xstate";
import axios from "axios";
import {url} from "../tag/url";
import {useMachine} from "@xstate/react";
import {Document as File} from "../models/Document"
import Match from "../shared/Match";
import {LoadingOutlined} from "@ant-design/icons";
import {ColumnProps} from "antd/es/table";
import {ImageDetail} from "../models/ImageDetail";
import {Marker} from "react-image-marker";
import TagImageValidate from "./TagImageValidate";
import {useState} from "react";

const Validate: React.VFC = () => {

    const [validateState, send] = useMachine(documentValidateMachine())

    const [docId, setDocId] = useState<number>(0)

    const columns : ColumnProps<File>[] = [
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
        {
            title: 'Validate',
            key: 'validate',
            render: (record: File) => (
                <Button type="primary" onClick={
                    () => {
                        setDocId(record.id)
                        send({
                            type: 'OPEN',
                            payload: {
                                documentId: record.id
                            }
                        })
                    }
                }> Validate </Button>
            )
        }
    ];

    const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>

    return(
    <>
        <Match on={['loading', 'opening', 'saving', 'deleting']} state={validateState}>
            <Spin indicator={antIcon} tip="Loading...">
                <Alert message="Please wait" type="info"/>
            </Spin>
        </Match>

        <Match on={ ['idle']} state={validateState}>
            <Table dataSource={validateState.context.documents.filter(d=>d.documentType==='image/jpeg')} columns={columns} />
        </Match>

        <Match on={ ['validate']} state={validateState}>
            <TagImageValidate  docId={docId}
                               documentDetails={validateState.context.documentDetails}
                               markers={validateState.context.markers}
                               onClose={()=> send({type: 'CANCEL'})}
                               onDelete={(decumentDetailId:number) => send({type: 'DELETE', payload:{detailId: decumentDetailId}})}
                               onSave={(decumentDetailId:number) => send({type: 'SAVE', payload:{detailId: decumentDetailId}})}
                               urlImage={url(docId)}
                               visible={true}/>
        </Match>

        <Match on={['rejected']} state={validateState}>
            <Result
                status="error"
                title="Loading data failed"
                subTitle="Please try again. If Problem persis contact administrator"
                extra={
                    <Button
                        onClick={() => {
                            send({
                                type: 'RETRY'
                            })
                        }}
                    >
                        Retry
                    </Button>
                }
            />
        </Match>

    </>)
}

interface DocumentValidateMachineContext {
    documents: Array<File>
    documentDetails: ImageDetail[]
    markers: Marker[]
}

interface DocumentValidateMachineSchema {
    context: DocumentValidateMachineContext
    states: {
        loading: {}
        idle: {}
        opening: {}
        validate: {}
        saving: {}
        deleting: {}
        rejected: {}
    }
}

type DocumentValidateMachineEvent =
    | { type: 'RETRY' }
    | { type: 'LOAD' }
    | { type: 'OPEN', payload: {documentId: number}}
    | { type: 'CANCEL'}
    | { type: 'SAVE', payload: {detailId: number}}
    | { type: 'DELETE', payload: {detailId: number}}



const documentValidateMachine = () =>
    Machine<DocumentValidateMachineContext, DocumentValidateMachineSchema, DocumentValidateMachineEvent>(
        {
            id: 'documentValidate-machine',
            context: {
                documents: [],
                documentDetails: [],
                markers: []
            },
            initial: 'loading',
            on: {
                RETRY: 'loading'
            },
            states: {
                loading: {
                    invoke: {
                        id: 'loading',
                        src: 'loadData',
                        onDone: {
                            target: 'idle',
                            actions: assign((context, event) => {
                                return {
                                    documents: event.data.data,
                                    documentDetails: [],
                                    markers: []
                                }
                            })
                        },
                        onError: {
                            target: 'rejected'
                        }
                    }
                },
                idle: {
                    on: {
                        RETRY: {
                            target: 'loading'
                        },
                        OPEN: {
                            target: 'opening'
                        }
                    }
                },
                opening: {
                    invoke: {
                        id: 'opening',
                        src: 'openValidate',
                        onDone: {
                            target: 'validate',
                            actions: assign((context, event) => {
                                return {
                                    documents: context.documents,
                                    documentDetails: event.data.data,
                                    markers: event.data.data.map((detail: ImageDetail) => {
                                        return {left: detail.x, top: detail.y} as Marker
                                    })
                                }
                            })

                        },
                        onError: {
                            target: 'idle'
                        }
                    }
                },
                validate:{
                    on:{
                        SAVE: {
                            target: 'saving'
                        },
                        CANCEL: {
                            target: 'idle'
                        },
                        DELETE: {
                            target: 'deleting'
                        }

                    }
                },
                deleting : {
                    invoke: {
                        id: 'deleting',
                        src: 'deleteValidation',
                        onDone: {
                            target: 'loading'
                        },
                        onError: {
                            target: 'validate'
                        }
                    }
                },
                saving:{
                    invoke: {
                        id: 'saving',
                        src: 'saveValidation',
                        onDone: {
                            target: 'loading'
                        },
                        onError: {
                            target: 'validate'
                        }
                    }
                },
                rejected: {
                    on: {
                        RETRY: {
                            target: 'loading'
                        }
                    }
                }
            }
        },
        {
            services: {
                loadData: (_, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    const url = `http://${process.env.REACT_APP_SERVER_NAME}/document/new`
                    return async () => axios
                        .get(url, {headers: {"Authorization": `Bearer ${token}`}})
                        .then((ret) => Promise.resolve(ret)
                        )
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                },
                openValidate: (_, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    let docId : number = 0
                    if (event.type === 'OPEN') {
                        docId = event.payload.documentId
                    }
                    const url = `http://${process.env.REACT_APP_SERVER_NAME}/document/${docId}/details/new`
                    return async () => axios
                        .get(url, {headers: {"Authorization": `Bearer ${token}`}})
                        .then((ret) => Promise.resolve(ret)
                        )
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                },
                saveValidation: (_, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    let detailId : number = 0
                    if (event.type === 'SAVE') {
                        detailId = event.payload.detailId
                    }
                    const url = `http://${process.env.REACT_APP_SERVER_NAME}/documentDetail/${detailId}/validate`
                    return async () => axios
                        .patch(url, {headers: {"Authorization": `Bearer ${token}`}})
                        .then((ret) => Promise.resolve(ret)
                        )
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                },
                deleteValidation: (id, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    let detailId
                    if (event.type === 'DELETE')
                        detailId = event.payload.detailId;
                    return axios.delete(`http://${process.env.REACT_APP_SERVER_NAME}/documentDetail/${detailId}`,
                        {headers: {'Authorization': `Bearer ${token}`}})
                }
            }
        }
    )

export default Validate

