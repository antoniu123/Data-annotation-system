import {useMachine} from "@xstate/react"
import {Alert, Button, Card, Form, Input, Modal, Result, Select, Space, Spin, Table} from "antd"
import {ColumnProps} from "antd/lib/table"
import axios from "axios"
import {ReactElement, useState} from "react"
import ImageMarker, {Marker, MarkerComponentProps} from "react-image-marker"
import {assign, Machine} from "xstate"
import {ImageDetail} from "../models/ImageDetail"
import Match from "./Match"
import LineTo from 'react-lineto';


const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 20, offset: 4}
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

    const selectorName: string[] = ["1-Head", "2-Neck", "3-SpineShoulder", "4-ShoulderLeft", "5-ShoulderRight",
        "6-ElbowLeft", "7-ElbowRight", "8-WristLeft", "9-WristRight", "10-ThumbLeft",
        "11-ThumbRight", "12-HandLeft", "13-HandRight", "14-HandTipLeft", "15-HandTipRight",
        "16-SpineMid", "17-SpineBase", "18-HipLeft", "19-HipRight", "20-KneeLeft",
        "21-KneeRight", "22-AnkleLeft", "23-AnkleRight", "24-FootLeft", "25-FootRight"]

    const {Option} = Select;

    const [formTag] = Form.useForm()
    const [formMove] = Form.useForm()

    const [tagState, send] = useMachine(createTagImageMachine(docId))

    const existingNames = tagState.context.documentDetails.map(detail => detail.name)

    const [addEditVisible, setAddEditVisible] = useState(false);

    // const [moveVisible, setMoveVisible] = useState(false);

    const [, setMarkers] = useState<Array<Marker>>([]);

    const [displayedMarkers, setDisplayedMarkers] = useState<Array<Marker>>([]);

    const [newImageDetails, setNewImageDetails] = useState<Array<ImageDetail>>([]);

    const drawLines = (imageDetails: ImageDetail[], str: string) => {
        let x: ReactElement[] = []
        if (imageDetails.map(detail => detail.name).filter(name => name !== '-').length > 0) { // normal loading
            if (imageDetails.filter(e => e.name === "1-Head").length > 0 && imageDetails.filter(e => e.name === "2-Neck").length > 0) {
                x[0] = <LineTo key="0" delay={500} borderColor="red" from={`0`} to={`1`} within={str}/>
            }
            if (imageDetails.filter(e => e.name === "2-Neck").length > 0 && imageDetails.filter(e => e.name === "3-SpineShoulder").length > 0) {
                x[1] = <LineTo key="1" delay={500} borderColor="red" from={`1`} to={`2`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "3-SpineShoulder").length > 0 && imageDetails.filter(e => e.name === "4-ShoulderLeft").length > 0) {
                x[2] = <LineTo key="2" delay={500} borderColor="red" from={`2`} to={`3`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "3-SpineShoulder").length > 0 && imageDetails.filter(e => e.name === "5-ShoulderRight").length > 0) {
                x[3] = <LineTo key="3" delay={500} borderColor="red" from={`2`} to={`4`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "3-SpineShoulder").length > 0 && imageDetails.filter(e => e.name === "16-SpineMid").length > 0) {
                x[4] = <LineTo key="4" delay={500} borderColor="red" from={`2`} to={`15`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "4-ShoulderLeft").length > 0 && imageDetails.filter(e => e.name === "6-ElbowLeft").length > 0) {
                x[5] = <LineTo key="5" delay={500} borderColor="red" from={`3`} to={`5`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "6-ElbowLeft").length > 0 && imageDetails.filter(e => e.name === "8-WristLeft").length > 0) {
                x[6] = <LineTo key="6" delay={500} borderColor="red" from={`5`} to={`7`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "8-WristLeft").length > 0 && imageDetails.filter(e => e.name === "10-ThumbLeft").length > 0) {
                x[7] = <LineTo key="7" delay={500} borderColor="red" from={`7`} to={`9`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "8-WristLeft").length > 0 && imageDetails.filter(e => e.name === "12-HandLeft").length > 0) {
                x[8] = <LineTo key="8" delay={500} borderColor="red" from={`7`} to={`11`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "12-HandLeft").length > 0 && imageDetails.filter(e => e.name === "14-HandTipLeft").length > 0) {
                x[9] = <LineTo key="9" delay={500} borderColor="red" from={`11`} to={`13`}
                               within={str}/>
            }
            if (imageDetails.filter(e => e.name === "5-ShoulderRight").length > 0 && imageDetails.filter(e => e.name === "7-ElbowRight").length > 0) {
                x[10] = <LineTo key="10" delay={500} borderColor="red" from={`4`} to={`6`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "7-ElbowRight").length > 0 && imageDetails.filter(e => e.name === "9-WristRight").length > 0) {
                x[11] = <LineTo key="11" delay={500} borderColor="red" from={`6`} to={`8`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "9-WristRight").length > 0 && imageDetails.filter(e => e.name === "11-ThumbRight").length > 0) {
                x[12] = <LineTo key="12" delay={500} borderColor="red" from={`8`} to={`10`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "9-WristRight").length > 0 && imageDetails.filter(e => e.name === "13-HandRight").length > 0) {
                x[13] = <LineTo key="13" delay={500} borderColor="red" from={`8`} to={`12`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "13-HandRight").length > 0 && imageDetails.filter(e => e.name === "15-HandTipRight").length > 0) {
                x[14] = <LineTo key="14" delay={500} borderColor="red" from={`12`} to={`14`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "16-SpineMid").length > 0 && imageDetails.filter(e => e.name === "17-SpineBase").length > 0) {
                x[15] = <LineTo key="15" delay={500} borderColor="red" from={`15`} to={`16`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "17-SpineBase").length > 0 && imageDetails.filter(e => e.name === "18-HipLeft").length > 0) {
                x[16] = <LineTo key="16" delay={500} borderColor="red" from={`16`} to={`17`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "17-SpineBase").length > 0 && imageDetails.filter(e => e.name === "19-HipRight").length > 0) {
                x[17] = <LineTo key="17" delay={500} borderColor="red" from={`16`} to={`18`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "18-HipLeft").length > 0 && imageDetails.filter(e => e.name === "20-KneeLeft").length > 0) {
                x[18] = <LineTo key="18" delay={500} borderColor="red" from={`17`} to={`19`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "19-HipRight").length > 0 && imageDetails.filter(e => e.name === "21-KneeRight").length > 0) {
                x[19] = <LineTo key="19" delay={500} borderColor="red" from={`18`} to={`20`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "20-KneeLeft").length > 0 && imageDetails.filter(e => e.name === "22-AnkleLeft").length > 0) {
                x[20] = <LineTo key="20" delay={500} borderColor="red" from={`19`} to={`21`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "22-AnkleLeft").length > 0 && imageDetails.filter(e => e.name === "24-FootLeft").length > 0) {
                x[21] = <LineTo key="21" delay={500} borderColor="red" from={`21`} to={`23`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "21-KneeRight").length > 0 && imageDetails.filter(e => e.name === "23-AnkleRight").length > 0) {
                x[22] = <LineTo key="22" delay={500} borderColor="red" from={`20`} to={`22`}
                                within={str}/>
            }
            if (imageDetails.filter(e => e.name === "23-AnkleRight").length > 0 && imageDetails.filter(e => e.name === "25-FootRight").length > 0) {
                x[23] = <LineTo key="23" delay={500} borderColor="red" from={`22`} to={`24`}
                                within={str}/>
            }
        } else { //csv loading
            if (imageDetails.length > 2 && imageDetails[0] !== undefined && imageDetails[1] !== undefined) {
                x[0] = <LineTo key="0" delay={500} borderColor="red" from={`0`} to={`1`} within={str}/>
            }
            if (imageDetails.length > 3 && imageDetails[1] !== undefined && imageDetails[2] !== undefined) {
                x[1] = <LineTo key="1" delay={500} borderColor="red" from={`1`} to={`2`}
                               within={str}/>
            }
            if (imageDetails.length > 4 && imageDetails[2] !== undefined && imageDetails[3] !== undefined) {
                x[2] = <LineTo key="2" delay={500} borderColor="red" from={`2`} to={`3`}
                               within={str}/>
            }
            if (imageDetails.length > 5 && imageDetails[2] !== undefined && imageDetails[4] !== undefined) {
                x[3] = <LineTo key="3" delay={500} borderColor="red" from={`2`} to={`4`}
                               within={str}/>
            }
            if (imageDetails.length > 6 && imageDetails[2] !== undefined && imageDetails[5] !== undefined) {
                x[4] = <LineTo key="4" delay={500} borderColor="red" from={`2`} to={`15`}
                               within={str}/>
            }
            if (imageDetails.length > 7 && imageDetails[3] !== undefined && imageDetails[5] !== undefined) {
                x[5] = <LineTo key="5" delay={500} borderColor="red" from={`3`} to={`5`}
                               within={str}/>
            }
            if (imageDetails.length > 8 && imageDetails[5] !== undefined && imageDetails[7] !== undefined) {
                x[6] = <LineTo key="6" delay={500} borderColor="red" from={`5`} to={`7`}
                               within={str}/>
            }
            if (imageDetails.length > 9 && imageDetails[7] !== undefined && imageDetails[9] !== undefined) {
                x[7] = <LineTo key="7" delay={500} borderColor="red" from={`7`} to={`9`}
                               within={str}/>
            }
            if (imageDetails.length > 10 && imageDetails[7] !== undefined && imageDetails[11] !== undefined) {
                x[8] = <LineTo key="8" delay={500} borderColor="red" from={`7`} to={`11`}
                               within={str}/>
            }
            if (imageDetails.length > 11 && imageDetails[11] !== undefined && imageDetails[13] !== undefined) {
                x[9] = <LineTo key="9" delay={500} borderColor="red" from={`11`} to={`13`}
                               within={str}/>
            }
            if (imageDetails.length > 12 && imageDetails[4] !== undefined && imageDetails[6] !== undefined) {
                x[10] = <LineTo key="10" delay={500} borderColor="red" from={`4`} to={`6`}
                                within={str}/>
            }
            if (imageDetails.length > 13 && imageDetails[6] !== undefined && imageDetails[8] !== undefined) {
                x[11] = <LineTo key="11" delay={500} borderColor="red" from={`6`} to={`8`}
                                within={str}/>
            }
            if (imageDetails.length > 14 && imageDetails[8] !== undefined && imageDetails[10] !== undefined) {
                x[12] = <LineTo key="12" delay={500} borderColor="red" from={`8`} to={`10`}
                                within={str}/>
            }
            if (imageDetails.length > 15 && imageDetails[8] !== undefined && imageDetails[12] !== undefined) {
                x[13] = <LineTo key="13" delay={500} borderColor="red" from={`8`} to={`12`}
                                within={str}/>
            }
            if (imageDetails.length > 16 && imageDetails[12] !== undefined && imageDetails[14] !== undefined) {
                x[14] = <LineTo key="14" delay={500} borderColor="red" from={`12`} to={`14`}
                                within={str}/>
            }
            if (imageDetails.length > 17 && imageDetails[15] !== undefined && imageDetails[16] !== undefined) {
                x[15] = <LineTo key="15" delay={500} borderColor="red" from={`15`} to={`16`}
                                within={str}/>
            }
            if (imageDetails.length > 18 && imageDetails[16] !== undefined && imageDetails[17] !== undefined) {
                x[16] = <LineTo key="16" delay={500} borderColor="red" from={`16`} to={`17`}
                                within={str}/>
            }
            if (imageDetails.length > 19 && imageDetails[16] !== undefined && imageDetails[18] !== undefined) {
                x[17] = <LineTo key="17" delay={500} borderColor="red" from={`16`} to={`18`}
                                within={str}/>
            }
            if (imageDetails.length > 20 && imageDetails[17] !== undefined && imageDetails[19] !== undefined) {
                x[18] = <LineTo key="18" delay={500} borderColor="red" from={`17`} to={`19`}
                                within={str}/>
            }
            if (imageDetails.length > 21 && imageDetails[18] !== undefined && imageDetails[20] !== undefined) {
                x[19] = <LineTo key="19" delay={500} borderColor="red" from={`18`} to={`20`}
                                within={str}/>
            }
            if (imageDetails.length > 22 && imageDetails[19] !== undefined && imageDetails[21] !== undefined) {
                x[20] = <LineTo key="20" delay={500} borderColor="red" from={`19`} to={`21`}
                                within={str}/>
            }
            if (imageDetails.length > 23 && imageDetails[21] !== undefined && imageDetails[23] !== undefined) {
                x[21] = <LineTo key="21" delay={500} borderColor="red" from={`21`} to={`23`}
                                within={str}/>
            }
            if (imageDetails.length > 24 && imageDetails[20] !== undefined && imageDetails[22] !== undefined) {
                x[22] = <LineTo key="22" delay={500} borderColor="red" from={`20`} to={`22`}
                                within={str}/>
            }
            if (imageDetails.length > 25 && imageDetails[22] !== undefined && imageDetails[24] !== undefined) {
                x[23] = <LineTo key="23" delay={500} borderColor="red" from={`22`} to={`24`}
                                within={str}/>
            }
        }
        return <>{x.map((currentValue, index, arr) => currentValue)}</>
    }

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
        let displayedMarkers : Marker[] = []
        tagState.context.markers.forEach((value) => {
            const myLeft : Number = (value.left as number * 100) / 1920
            const myTop : Number = (value.top as number * 100) / 1080
            const result : Marker = {
                left : myLeft,
                top: myTop
            }
            displayedMarkers.push(result)
        })
        setDisplayedMarkers(displayedMarkers)
    }

    const onFinish = (values: any) => {
        let newDetails: ImageDetail[] = []
        values.items.forEach(
            (value: any, index: number) => {
                console.log(value)
                newDetails.push({
                    id: undefined as unknown as number, name: value.name,
                    description: value.description, x: value.x, y: value.y
                })

            }
        );

        send({type: 'SAVE', payload: {documentDetails: newDetails}})
        // onRefresh(tagState.context.documentDetails.length + newDetails.length)
        setNewImageDetails([])
        setAddEditVisible(false)
        formTag.resetFields()
    }


    const columns: ColumnProps<ImageDetail>[] = [
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
        },
        {
            title: 'Move',
            key: 'move',
            render: (record: ImageDetail) => (
                <Button type="primary" onClick={
                    () => {
                        formMove.resetFields()
                        send({
                            type: 'MOVE', payload: {documentDetail: record}
                        })
                    }
                }> Move </Button>
            )
        }
    ];
    return (
        <div>
            <Match
                on={['loadingDocumentDetails', 'deletingDocumentDetail', 'movingDocumentDetail', 'savingDocumentsDetails']}
                state={tagState}>
                <Spin>
                    <Alert message="Please wait for loading" type="info"/>
                </Spin>
            </Match>

            <Match on={['loadResolved']} state={tagState}>
                <Modal className="content-center" visible={visible} onCancel={()=>{
                    onClose()
                    onRefresh(tagState.context.documentDetails.length)
                }} width={800} title={null}
                       footer={null} maskClosable={false}>
                    <div
                        onClick={() => setAddEditVisible(true)}
                        className="abc" onLoad={putMarkers}>
                        {/*Image zone*/}
                        <ImageMarker
                            src={urlImage}
                            markers={displayedMarkers}
                            onAddMarker={(marker: Marker) => {
                                setMarkers([...displayedMarkers, marker])
                                marker.left = marker.left as number + 1.1
                                marker.top = marker.top as number + 0.65
                                const newDetail: ImageDetail = {
                                    id: undefined as unknown as number,
                                    name: '',
                                    description: '',
                                    x: marker.left as number,
                                    y: marker.top as number
                                }
                                setNewImageDetails([...newImageDetails, newDetail])
                            }}
                            markerComponent={CustomMarker}
                        />
                        <>{drawLines(tagState.context.documentDetails, "abc")}</>
                    </div>
                    {/*Records detail zone */}
                    <Card title="These are our tag records data" bordered={true}
                          style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.0)'}}
                    >
                        <>
                            {tagState.context.documentDetails.length > 0 ?
                                <Table rowKey="id"
                                       dataSource={tagState.context.documentDetails.sort((a, b) => a.id - b.id)}
                                       columns={columns}
                                       scroll={{ y: 200 }}
                                       size="small"/> :
                                null}
                        </>
                    </Card>
                    {/*Editing detail zone*/}
                    <Modal className="w-3/12" visible={addEditVisible} onCancel={() => setAddEditVisible(false)}
                           width={400}
                           maskClosable={false}
                           closable={true} footer={null}>
                        <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                            <div className="text-2xl text-center">
                                <p> Saving tag details</p>
                            </div>
                            <Form className="px-4" name="dynamic_form_item" {...formItemLayoutWithOutLabel}
                                  form={formTag}
                                  onFinish={onFinish} autoComplete="off"
                            >
                                <Form.List name="items" initialValue={newImageDetails}>
                                    {(fields, {add, remove}) => (
                                        <>
                                            {fields.map((field) => (

                                                <Space
                                                    key={field.key}
                                                    style={{display: "flex", marginBottom: 8}}
                                                    align="baseline"
                                                >
                                                    <Form.Item className="w-48"
                                                               {...field}
                                                               name={[field.name, "name"]}
                                                               fieldKey={[field.fieldKey, "name"]}
                                                               rules={[{required: true}]}
                                                    >
                                                        <Select size={'middle'}>
                                                            {selectorName.filter(name => !existingNames.includes(name))
                                                                .map((selector: string) => (
                                                                    <Option key={selector}
                                                                            value={selector}>{selector}</Option>
                                                                ))
                                                            }
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item className="w-48"
                                                               {...field}
                                                               name={[field.name, "description"]}
                                                               fieldKey={[field.fieldKey, "description"]}
                                                               rules={[{required: true}]}
                                                    >
                                                        <Input placeholder="description"/>
                                                    </Form.Item>
                                                </Space>

                                            ))}
                                        </>
                                    )}
                                </Form.List>
                                <Form.Item className="px-40">
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Space>
                    </Modal>
                </Modal>
            </Match>

            <Match on={['moveDocumentDetail']} state={tagState}>
                {/*Moving zone*/}
                {tagState.context.currentDetailForMoving &&
                    <Modal visible={true} closable={true} maskClosable={false}
                           onOk={() => {
                               let myDetail: ImageDetail = {} as ImageDetail
                               if (tagState.context.currentDetailForMoving) {
                                   if (formMove.getFieldValue('x') && formMove.getFieldValue('y')){
                                       myDetail = {
                                           ...tagState.context.currentDetailForMoving,
                                           x: formMove.getFieldValue('x') as number,
                                           y: formMove.getFieldValue('y') as number
                                       }
                                       send({type: 'DO_MOVE', payload: {documentDetail: myDetail}})
                                   }
                               }
                           }}
                           onCancel={() => {
                               send({type: 'CANCEL_MOVE'})
                           }}
                    >
                        <div style={{
                            padding: '40px'
                        }}>
                            <Form form={formMove}>
                                <Form.Item
                                    key={tagState.context.currentDetailForMoving?.x}
                                    label="X"
                                    name="x"
                                    initialValue={tagState.context.currentDetailForMoving?.x}
                                    rules={[{required: true, message: 'Please input x'}]}
                                >
                                    <Input width={100}/>
                                </Form.Item>

                                <Form.Item
                                    key={tagState.context.currentDetailForMoving?.y}
                                    label="Y"
                                    name="y"
                                    initialValue={tagState.context.currentDetailForMoving?.y}
                                    rules={[{required: true, message: 'Please input y'}]}
                                >
                                    <Input width={100}/>
                                </Form.Item>
                            </Form>
                        </div>
                    </Modal>
                }
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
    currentDetailForMoving?: ImageDetail
}

interface TagImageMachineSchema {
    context: TagImageMachineContext
    states: {
        loadingDocumentDetails: {}
        loadResolved: {}
        loadRejected: {}
        deletingDocumentDetail: {}
        moveDocumentDetail: {}
        movingDocumentDetail: {}
        savingDocumentsDetails: {}
    }
}

type TagImageMachineEvent = | { type: 'RETRY' } |
    { type: 'DELETE'; payload: { documentDetailId: number } } |
    { type: 'MOVE'; payload: { documentDetail: ImageDetail } } |
    { type: 'CANCEL_MOVE' } |
    { type: 'DO_MOVE'; payload: { documentDetail: ImageDetail } } |
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
                                    documentDetails: event.data.data.sort((a: ImageDetail, b: ImageDetail) => a.id - b.id),
                                    markers: event.data.data.sort((a: ImageDetail, b: ImageDetail) => a.id - b.id).map((detail: ImageDetail) => {
                                        return {left: detail.x, top: detail.y} as Marker
                                    })
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
                    MOVE: {
                        target: 'moveDocumentDetail'
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
                        target: 'loadResolved'
                    },
                    onError: {
                        target: 'loadResolved'
                    }
                }
            },
            moveDocumentDetail: {
                entry: assign((context, event) => {
                    return {
                        ...context,
                        currentDetailForMoving: event.type === 'MOVE' ? event.payload.documentDetail : undefined as unknown as ImageDetail
                    }
                }),
                on: {
                    CANCEL_MOVE: {
                        target: 'loadResolved'
                    },
                    DO_MOVE: {
                        target: 'movingDocumentDetail'
                    }
                }
            },
            movingDocumentDetail: {
                invoke: {
                    src: 'saveSingleDocumentDetail',
                    onDone: {
                        target: 'loadingDocumentDetails',
                        actions: assign((context, event) => {
                            return {
                                ...context,
                                currentDetailForMoving: undefined as unknown as ImageDetail
                            }
                        })
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
                    {headers: {'Authorization': `Bearer ${token}`}})
            },
            saveDocumentDetails: (id, event) => {
                const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                if (event.type === 'SAVE')
                    return axios.post(`http://${process.env.REACT_APP_SERVER_NAME}/document/${docId}/detail`,
                        event.payload.documentDetails, {headers: {'Authorization': `Bearer ${token}`}})
                return Promise.reject(() => "incorect type of event")
            },
            saveSingleDocumentDetail: (id, event) => {
                const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                if (event.type === 'DO_MOVE')
                    return axios.post(`http://${process.env.REACT_APP_SERVER_NAME}/document/${docId}/detail`,
                        [event.payload.documentDetail], {headers: {'Authorization': `Bearer ${token}`}})
                return Promise.reject(() => "incorect type of event")
            }
        }
    }
)