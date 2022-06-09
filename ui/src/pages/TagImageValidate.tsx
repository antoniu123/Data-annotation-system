import {Button, Card, Modal, Table} from "antd"
import {ColumnProps} from "antd/lib/table"
import ImageMarker, {Marker, MarkerComponentProps} from "react-image-marker"
import {ImageDetail} from "../models/ImageDetail"
import LineTo from 'react-lineto';


interface TagImageValidateProps {
    docId: number
    urlImage: string
    documentDetails: ImageDetail[]
    markers: Marker[]
    visible: boolean
    onClose: () => void
    onSave: (documentDetailId: number) => void
    onDelete: (documentDetailId: number) => void
}

const TagImageValidate: React.FC<TagImageValidateProps> = ({
                                                               docId, urlImage, documentDetails, markers,
                                                               visible, onClose, onSave, onDelete
                                                           }) => {

    const CustomMarker = (props: MarkerComponentProps) => {
        return (
            <div className={`${props.itemNumber} hover:`}>
                *
            </div>
        );
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
            title: 'Validate',
            key: 'validate',
            render: (record: ImageDetail) => (
                <Button onClick={
                    () => {
                        onSave(record.id)
                    }
                }> Validate </Button>
            )
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (record: ImageDetail) => (
                <Button danger onClick={
                    () => {
                        onDelete(record.id)
                    }
                }> Delete </Button>
            )
        }
    ];
    return (
        <>
            <Modal className="content-center" visible={visible} onCancel={onClose} width={800} title={null}
                   footer={null} maskClosable={false} closable={true}>
                <div className="abc">
                    <ImageMarker
                        src={urlImage}
                        markers={markers}
                        markerComponent={CustomMarker}
                    />
                    {markers.map((marker, index, array) => (
                        <>
                            {index > 0 && (
                                <LineTo delay={500} borderColor="red" from={`${index - 1}`} to={`${index}`}
                                        within="abc"/>
                            )}
                        </>
                    ))
                    }
                    {markers.length > 2 && (
                        <LineTo delay={500} borderColor="red" from="0" to={`${markers.length - 1}`} within="abc"/>
                    )}
                </div>

                <Card title="These are our tag records data" bordered={true}
                      style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.0)'}}
                >
                    <>
                        {documentDetails.length > 0 ?
                            <Table rowKey="id" dataSource={documentDetails} columns={columns}
                                   size="small"/> :
                            null}
                    </>
                </Card>
            </Modal>
        </>
    )


}

export default TagImageValidate