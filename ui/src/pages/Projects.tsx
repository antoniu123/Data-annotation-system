import {assign, Machine} from "xstate";
import {Project} from "../models/Project"
import axios from "axios";
import {ProjectDetail} from "../models/ProjectDetail";
import {Alert, Button, Card, Col, Form, Input, Modal, Result, Row, Spin, Table} from "antd";
import Match from "../shared/Match";
import * as React from "react";
import {useState} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import {useMachine} from "@xstate/react";
import {UserContext} from "../App";
import {ColumnProps} from "antd/es/table";
import ImageCard from "../shared/ImageCard";
import {Document as File} from "../models/Document"
import DocumentImport from "./DocumentImport";
import {url} from "../tag/url";
import PickDocument from "./PickDocument";


const filterData = (data?: Array<Project>) => (formatter: any) => {
    if (!data || !Array.isArray(data)) {
        return []
    }

    return data.map((item: Project) => item ? {
                text: formatter(item),
                value: formatter(item)
            }
            : {
                text: '',
                value: ''
            }
    ).sort((a, b) => a.value - b.value).filter((o, i, arr) => arr.findIndex((t) => t.text === o.text) === i)
}

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>

const Projects: React.VFC = () => {

    const userContext = React.useContext(UserContext);
    const [projectState, send] = useMachine(createProjectMachine(userContext && userContext.userId ? userContext.userId : 0))
    const refresh = () => {
        send({
            type: 'RETRY'
        })
    }
    const [formProject] = Form.useForm()
    const [formProjectDetails] = Form.useForm()
    const [showUpload, setShowUpload] = useState(false)
    const [documentId, setDocumentId] = useState(0)

    const rowSelectionProject : object = {
        type: 'radio',
        onChange: (selectedRowKeys: number, selectedRows: Project) => {
            console.log(`change: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record : Project, selected: Project) => {
            console.log('select:', record, selected);
            projectState.context.currentProject = record
        },
    };

    const rowSelectionProjectDetail : object = {
        type: 'radio',
        onChange: (selectedRowKeys: number, selectedRows: ProjectDetail) => {
            console.log(`change: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record : ProjectDetail, selected: ProjectDetail) => {
            console.log('select:', record, selected);
            projectState.context.currentProjectDetail = record
        },
    };

    const columns: ColumnProps<Project>[] = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: '5%'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Project, b: Project) => a.name.localeCompare(b.name),
            filters: filterData(projectState.context.projects)((s: Project) => s.name),
            onFilter: (value, record) => record.name === value,
            width: '20px'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a: Project, b: Project) => a.description.localeCompare(b.description),
            filters: filterData(projectState.context.projects)((s: Project) => s.description),
            onFilter: (value, record) => record.description === value,
            width: '20px'
        },
        {
            title: 'Owner',
            dataIndex: ['owner', 'username'],
            key: 'owner',
            sorter: (a: Project, b: Project) => a.ownerUsername.localeCompare(b.ownerUsername),
            filters: filterData(projectState.context.projects)((s: Project) => s.ownerUsername),
            onFilter: (value, record) => record.ownerUsername === value,
            width: '20px'
        },
        {
            title: 'Edit',
            key: 'edit',
            render: (record: Project) => (
                <Button type="primary" onClick={
                    () => {
                        formProject.resetFields()
                        send({
                            type: 'ADD_EDIT_PROJECT',
                            payload: {
                                project: record
                            }
                        })
                    }
                }> Edit Project </Button>
            )
        }
    ]

    const columnDetails: ColumnProps<ProjectDetail>[] = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: '5%'
        },
        {
            title: 'Document',
            dataIndex: 'document',
            key: 'document',
            sorter: (a: ProjectDetail, b: ProjectDetail) => a.document.id - b.document.id,
            render: (value: File) => <ImageCard key={value.id} id={value.id} title={value.name}
                                                urlImage={url(value.id)}/>,
            width: '20px'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: ProjectDetail, b: ProjectDetail) => a.name.localeCompare(b.name),
            width: '20px'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a: ProjectDetail, b: ProjectDetail) => a.description.localeCompare(b.description),
            width: '20px'
        },
        {
            title: 'Subscriber',
            dataIndex: 'subscriberUsername',
            key: 'subscriber',
            sorter: (a: ProjectDetail, b: ProjectDetail) => a.subscriberUsername
                .localeCompare(b.subscriberUsername),
            width: '20px'
        },
        {
            title: 'Edit',
            key: 'edit',
            render: (record: ProjectDetail) => (
                <Button type="primary" onClick={
                    () => {
                        formProjectDetails.resetFields()
                        send({
                            type: 'ADD_EDIT_PROJECT_DETAIL',
                            payload: {projectDetail: record}
                        })
                    }
                }> Edit Project Detail</Button>
            )
        },
        {
            title: 'Export',
            key: 'export',
            render: (record: ProjectDetail) => (
                <Button type="primary" onClick={
                    () => {
                        send({
                            type: 'EXPORT', payload: {documentId: record.document.id}
                        })
                    }
                }> Export</Button>
            )
        },
        {
            title: 'Import',
            key: 'import',
            render: (record: ProjectDetail) => (
                <Button type="primary" onClick={
                    () => {
                        setDocumentId(record.document.id)
                        setShowUpload(true)
                        refresh()
                    }
                }> Import</Button>
            )
        }
    ]

    return (
        <>
            <Match on={['loading', 'savingProject', 'savingProjectDetail', 'exporting', 'savingDoc']} state={projectState}>
                <Spin indicator={antIcon} tip="Loading...">
                    <Alert message="Please wait" type="info"/>
                </Spin>
            </Match>

            <Match on={['idle']} state={projectState}>
                <>
                    <Button type="primary" onClick={
                        () => {
                            formProject.resetFields()
                            send({
                                type: 'ADD_EDIT_PROJECT',
                                payload: {
                                    project: undefined
                                }
                            })
                        }
                    }> Add Project</Button>
                    <div className="site-card-wrapper">
                        <Table rowKey="id" scroll={{x: 'calc(1200px+50%)'}} bordered
                               dataSource={projectState.context.projects}
                               rowSelection={rowSelectionProject}
                               expandable={{
                                   expandedRowRender: record =>
                                       <>
                                           <Button type="primary" onClick={
                                               () => {
                                                   formProjectDetails.resetFields()
                                                   send({
                                                       type: 'ADD_EDIT_PROJECT_DETAIL',
                                                       payload: {projectDetail: undefined}
                                                   })
                                               }
                                           }> Add Project Detail</Button>
                                           <div>Detalii document</div>
                                           <div style={{margin: 10}}>
                                               <Table rowKey="id" dataSource={record.projectDetails} pagination={false}
                                                      bordered={true}
                                                      rowSelection={rowSelectionProjectDetail}
                                                      columns={columnDetails} size="small"/>
                                           </div>
                                       </>,
                                   rowExpandable: record => record.projectDetails.length > 0,
                               }}
                               rowClassName={(record, index) => {
                                   return index % 2 ? 'shallow_gray' : 'deep_gray'
                               }}
                               columns={columns} size="small"/>
                    </div>
                    {showUpload && (<DocumentImport documentId={documentId}
                                                    initialErrorMessage='' close={() => setShowUpload(false)}/>)}
                </>
            </Match>

            <Match on={['addEditProject']} state={projectState}>
                <Modal visible={true}
                       title={projectState.context.currentProject ? projectState.context.currentProject.name : ''}
                       maskClosable={false} footer={null}
                       onCancel={() => {
                           send({type: 'CANCEL_ADD_EDIT'})
                       }}>
                    <div className="py-4">
                        <Form
                            name="basic"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 12}}
                            form={formProject}
                        >
                            <Form.Item
                                name="id"
                                hidden
                                initialValue={projectState.context.currentProject ? projectState.context.currentProject.id : undefined}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Name"
                                name="name"
                                initialValue={projectState.context.currentProject ? projectState.context.currentProject.name : undefined}
                                rules={[{required: true, message: 'Please input name!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                initialValue={projectState.context.currentProject ? projectState.context.currentProject.description : undefined}
                                rules={[{required: true, message: 'Please input description!'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <div className="px-44">
                                <Button key="back" onClick={() => {
                                    send({
                                        type: 'CANCEL_ADD_EDIT'
                                    })
                                }}>
                                    Cancel
                                </Button>
                                <Button key="submit" type="primary" onClick={() => {
                                    send({
                                        type: 'SAVE_PROJECT', payload: {
                                            id: formProject.getFieldValue('id'),
                                            name: formProject.getFieldValue('name'),
                                            description: formProject.getFieldValue('description'),
                                            ownerUsername: userContext && userContext.username ? userContext.username : ''
                                        }
                                    })
                                }}>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </Match>

            <Match on={['addEditProjectDetail']} state={projectState}>
                <Modal visible={true} maskClosable={false} title={"Add project detail"} footer={null} onCancel={() => {
                    send({type: 'CANCEL_ADD_EDIT_DETAIL'})
                }}>
                    <div className="py-4">

                        <Form
                            name="basic"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 12}}
                            form={formProjectDetails}
                        >

                            <Form.Item
                                label="#"
                                hidden
                                name="id"
                                initialValue={projectState.context.currentProjectDetail ? projectState.context.currentProjectDetail.id : undefined}
                                rules={[{required: true, message: 'Please input id!'}]}

                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Document"
                                name="documentId"
                                key={projectState.context.currentProjectDetail?.document ? projectState.context.currentProjectDetail.document.id : 0}
                                initialValue={projectState.context.currentProjectDetail ? projectState.context.currentProjectDetail.document : undefined}
                                rules={[{required: true, message: 'Please input document!'}]}
                            >
                                <Row justify="space-around" align="middle" gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Card
                                            hoverable
                                            style={{ width: 120, height: 60 }}
                                            key={projectState.context.currentProjectDetail?.document ? projectState.context.currentProjectDetail.document.id : 0}
                                            cover={<img alt="image_to_be" src={
                                                projectState.context.currentProjectDetail?.document ?
                                                url(projectState.context.currentProjectDetail.document.id) :
                                                ''
                                            } />}
                                        >
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Button key="addDoc" type="dashed" onClick={() => {
                                            send({
                                                type: 'ADD_DOC'
                                            })
                                        }}>
                                            Add Document
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Form.Item
                                label="Name"
                                name="name"
                                initialValue={projectState.context.currentProjectDetail ? projectState.context.currentProjectDetail.name : undefined}
                                rules={[{required: true, message: 'Please input name!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                initialValue={projectState.context.currentProjectDetail ? projectState.context.currentProjectDetail.description : undefined}
                                rules={[{required: true, message: 'Please input description!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <div className="px-44">
                                <Button key="back" onClick={() => {
                                    send({
                                        type: 'CANCEL_ADD_EDIT_DETAIL'
                                    })
                                }}>
                                    Cancel
                                </Button>
                                <Button key="submit" type="primary" onClick={() => {
                                    send({
                                        type: 'SAVE_PROJECT_DETAIL', payload: {
                                            id: formProjectDetails.getFieldValue('id'),
                                            name: formProjectDetails.getFieldValue('name'),
                                            description: formProjectDetails.getFieldValue('description'),
                                            document: projectState.context.currentProjectDetail?.document ?
                                                 projectState.context.currentProjectDetail.document : undefined as unknown as File,
                                            username: userContext && userContext.username ? userContext.username : ''
                                        }
                                    })
                                }}>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </Match>

            <Match on={['pickDocument']} state={projectState}>
                <PickDocument
                    documents = {projectState.context.documents.filter(doc=> !projectState.context.currentProject?.projectDetails
                            .map(detail => detail.document.id).includes(doc.id)
                    )}
                    pick={(file: File) => {
                        send({
                            type: 'SAVE_DOC',
                            payload: {document: file}
                        })
                    }}
                    close={()=> send({type: 'CANCEL_ADD_DOC'})}
                />
            </Match>

            <Match on={['rejected']} state={projectState}>
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
        </>
    )
}
export default Projects

interface ProjectMachineContext {
    projects: Array<Project>
    documents: Array<File>
    currentProject?: Project
    currentProjectDetail?: ProjectDetail
}

interface ProjectMachineSchema {
    context: ProjectMachineContext
    states: {
        loading: {}
        idle: {}
        addEditProject: {}
        savingProject: {}
        addEditProjectDetail: {}
        pickDocument:{}
        savingDoc:{}
        savingProjectDetail: {}
        exporting: {}
        rejected: {}
    }
}

type ProjectMachineEvent =
    | { type: 'RETRY' }
    | { type: 'ADD_EDIT_PROJECT', payload: { project: Project | undefined } }
    | { type: 'CANCEL_ADD_EDIT' }
    | { type: 'SAVE_PROJECT', payload: { id: number, name: string, description: string, ownerUsername: string } }
    | { type: 'ADD_EDIT_PROJECT_DETAIL', payload: { projectDetail: ProjectDetail | undefined } }
    | { type: 'CANCEL_ADD_EDIT_DETAIL' }
    | { type: 'EXPORT', payload: { documentId: number } }
    | { type: 'SAVE_PROJECT_DETAIL', payload: { id: number, name: string, description: string, document: File, username: string } }
    | { type: 'CANCEL_ADD_DOC'}
    | { type: 'ADD_DOC'}
    | { type: 'SAVE_DOC' , payload: {document: File} }

const createProjectMachine = (userId: number) =>
    Machine<ProjectMachineContext, ProjectMachineSchema, ProjectMachineEvent>(
        {
            id: 'project-machine',
            context: {
                projects: [],
                documents: [],
                currentProject: undefined,
                currentProjectDetail: undefined
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
                                console.log(event.data)
                                return {
                                    projects: event.data[0].data,
                                    documents: event.data[1].data,
                                    currentProject: undefined,
                                    currentProjectDetail: undefined
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
                        ADD_EDIT_PROJECT: {
                            target: 'addEditProject'
                        },
                        ADD_EDIT_PROJECT_DETAIL: {
                            target: 'addEditProjectDetail'
                        },
                        EXPORT: {
                            target: 'exporting'
                        }
                    }
                },
                addEditProject: {
                    entry: 'assignCurrentProject',
                    on: {
                        CANCEL_ADD_EDIT: {
                            target: 'idle'
                        },
                        SAVE_PROJECT: {
                            target: 'savingProject'
                        }
                    }
                },
                savingProject: {
                    invoke: {
                        id: 'savingProject',
                        src: 'saveProject',
                        onDone: {
                            target: 'loading',
                            actions: assign((context, event) => {
                                return {
                                    ...context,
                                    currentProject: undefined,
                                    currentProjectDetail: undefined
                                }
                            })
                        },
                        onError: {
                            target: 'addEditProject'
                        }
                    }
                },
                addEditProjectDetail: {
                    entry: 'assignCurrentProjectDetail',
                    on: {
                        CANCEL_ADD_EDIT_DETAIL: {
                            target: 'idle'
                        },
                        SAVE_PROJECT_DETAIL: {
                            target: 'savingProjectDetail'
                        },
                        ADD_DOC:{
                            target: 'pickDocument'
                        }
                    }
                },
                pickDocument:{
                    on:{
                        CANCEL_ADD_DOC: {
                            target:'addEditProjectDetail'
                        },
                        SAVE_DOC: {
                            target: 'savingDoc'
                        },
                    }
                },
                savingDoc: {
                    entry: 'onOk',
                    always: {target: 'addEditProjectDetail'}
                },
                savingProjectDetail: {
                    invoke: {
                        id: 'savingProjectDetail',
                        src: 'saveProjectDetail',
                        onDone: {
                            target: 'loading',
                            actions: assign((context, event) => {
                                return {
                                    ...context,
                                    currentProject: undefined,
                                    currentProjectDetail: undefined
                                }
                            })
                        },
                        onError: {
                            target: 'addEditProjectDetail'
                        }
                    }
                },
                exporting: {
                    invoke: {
                        id: 'exporting',
                        src: 'export',
                        onDone: {
                            target: 'loading',
                        },
                        onError: {
                            target: 'idle'
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
            actions: {
                onOk: assign((context, event) => {
                    if (event.type === 'SAVE_DOC') {
                        return {
                            ...context,
                            currentProjectDetail: {
                                id: context.currentProjectDetail ? context.currentProjectDetail.id : undefined as unknown as number,
                                document: event.payload.document ? event.payload.document : undefined as unknown as File,
                                name: context.currentProjectDetail ? context.currentProjectDetail.name : '',
                                description: context.currentProjectDetail ? context.currentProjectDetail.description : '',
                                subscriberUsername: ''
                            }
                        }
                    }
                    return {
                        ...context
                    }
                }),
                assignCurrentProject: assign((context, event) => {
                    if (event.type === 'ADD_EDIT_PROJECT') {
                        return {
                            ...context,
                            currentProject: event.payload.project,
                            currentProjectDetail: undefined
                        }
                    }
                    return {
                        ...context
                    }
                }),
                assignCurrentProjectDetail: assign((context, event) => {
                    if (event.type === 'ADD_EDIT_PROJECT_DETAIL') {
                        return {
                            ...context,
                            currentProjectDetail: event.payload.projectDetail
                        }
                    }
                    return {
                        ...context
                    }
                })
            },
            services: {
                loadData: (context, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    const urlPro = `http://${process.env.REACT_APP_SERVER_NAME}/userId/${userId}/projects`
                    const urlDoc = `http://${process.env.REACT_APP_SERVER_NAME}/userId/${userId}/documents`
                    return Promise.all([
                        axios
                            .get(urlPro, {headers: {"Authorization": `Bearer ${token}`}})
                            .then((ret) => Promise.resolve(ret)
                            )
                            .catch((err) => {
                                return Promise.reject(err)
                            }),
                        axios
                            .get(urlDoc, {headers: {"Authorization": `Bearer ${token}`}})
                            .then((ret) => Promise.resolve(ret)
                            )
                            .catch((err) => {
                                return Promise.reject(err)
                            })
                    ])
                },
                saveProject: (_, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    let body = {}
                    if (event.type === 'SAVE_PROJECT') {
                        body = {
                            ...event.payload
                        }
                    }
                    const url = `http://${process.env.REACT_APP_SERVER_NAME}/userId/${userId}/project`
                    return async () => axios
                        .post(url, body, {headers: {"Authorization": `Bearer ${token}`}})
                        .then((ret) => Promise.resolve(ret)
                        )
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                },
                saveProjectDetail: (context, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    let body = {}
                    if (event.type === 'SAVE_PROJECT_DETAIL') {
                        body = {
                            ...event.payload,
                            project: context.currentProject
                        }
                    }
                    const url = `http://${process.env.REACT_APP_SERVER_NAME}/project/${context.currentProject?.id}/detail`
                    return async () => axios
                        .post(url, body, {headers: {"Authorization": `Bearer ${token}`}})
                        .then((ret) => Promise.resolve(ret)
                        )
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                },
                export: async (context, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    let urlExport = ''
                    if (event.type === 'EXPORT')
                        urlExport = `http://${process.env.REACT_APP_SERVER_NAME}/document/${event.payload.documentId}/export`
                    const response = await axios
                        .get(urlExport, {headers: {"Authorization": `Bearer ${token}`, responseType: 'blob'}})
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    const filename = response.headers["filename"];
                    link.setAttribute("download", filename);
                    link.click();
                    return Promise.resolve(response)

                }
            }
        }
    )