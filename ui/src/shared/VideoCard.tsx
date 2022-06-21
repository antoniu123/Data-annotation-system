import axios from "axios";
import { BsTag } from "react-icons/bs";
import ReactPlayer from "react-player";
import '../css/card.css'
import {useEffect,  useState} from "react";
import {Card, Checkbox, Form, InputNumber, Modal, notification} from "antd"
import {CheckboxChangeEvent} from "antd/es/checkbox";

const styleCard:React.CSSProperties = {
    padding: '30px',
    background: '#ececec'
}

interface VideoCardProps {
    id: number
    title: string
    details: number
    order: number
    urlVideo: string
    refresh: () => void
}
const VideoCard : React.VFC<VideoCardProps> = ({ id, title, details, order, urlVideo , refresh}) => {

    const [displayModal, setDisplayModal] = useState(false)

    const [cnt, setCnt] = useState(0)

    const [allFrames, setAllFrames] = useState<boolean>(false)

    useEffect(() => {
        const textUrl = `http://${process.env.REACT_APP_SERVER_NAME}/document/${id}/count`

        const getText = async () => {
            const result = await axios.get(textUrl)
                .then(response => response)
                .catch(err => {
                    console.error(err)
                    return err
                })
            setCnt(result.data)
        };

        getText()
    },[id]);


    const [form] = Form.useForm();
    const extract = (id:number, nrFrames:number, allFrames: boolean) => {
      const token = JSON.parse(window.localStorage.getItem("jwt") ?? "")
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
           nrFrames: nrFrames,
           allFrames: allFrames
        }
      }
      
      const data = {}
  
      const url = `http://${process.env.REACT_APP_SERVER_NAME}/video/extract/${order}`
      axios.post(url, data, config)
      .then(response => { 
        console.error(response) 
        return response
      })
      .catch(err => { 
          console.error(err) 
          return err
      })
      setTimeout(()=>refresh(), 500);
    };


    return (
      <div className="wrapper wrapperAnime">
        <div className="header">
          <div className="wrapper">
            <ReactPlayer url={urlVideo} controls={true} width="80%" height="60%"/>
          </div>
          <div className="badgeWrapper">
            <div
              className="primaryBadge badgeAnime"
              onClick={()=>setDisplayModal(true)}
            >
              <BsTag />
              <span
                className="counter group-hover:text-white"
              >
                {cnt}
              </span>
            </div>
          </div>
        </div>
        <div className="textWrapper">
          <h1 className="text">{`${title}`}</h1>
        </div>
        <Modal visible={displayModal} maskClosable={false}
               closable={true}
               onCancel={()=>setDisplayModal(false)}
               onOk={()=>{
                   if (form.getFieldValue('nrFrames') !== 0 || allFrames){
                       extract(order, form.getFieldValue('nrFrames'), allFrames)
                       setDisplayModal(false)
                       form.resetFields()
                       refresh()
                   }
                   else {
                       notification.error({
                           message: 'Error',
                           description: 'No input for getting frames'
                       })
                   }
               }}
               >
            <div style={styleCard}>
                <Card title="Capture Frames" bordered={false} style={{ width: 450 }}>
                    <Form form={form} labelCol={{span: 8}}
                          wrapperCol={{span: 16}}
                          initialValues={{
                              nrFrames: 0
                          }}>
                        <Form.Item label="Number of Frames" name="nrFrames">
                            <InputNumber min={1} max={100}/>
                        </Form.Item>
                        <Checkbox defaultChecked={allFrames} onChange={(e:CheckboxChangeEvent)=> {
                            setAllFrames(e.target.checked)
                            if (e.target.checked) {
                                form.setFieldsValue({
                                    nrFrames: 0
                                });
                            }
                        }
                        }>
                            All Frames
                        </Checkbox>
                    </Form>
                </Card>
            </div>

        </Modal>
      </div>
    );
  };
  
  export default VideoCard;
