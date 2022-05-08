import axios from "axios";
import { BsTag } from "react-icons/bs";
import ReactPlayer from "react-player";
import '../css/card.css'
import {useEffect, useState} from "react";
import {Card, Form, InputNumber, Modal} from "antd";

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
    const extract = (id:number, nrFrames:number) => {
      const token = JSON.parse(window.localStorage.getItem("jwt") ?? "")
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
           nrFrames: nrFrames
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
            <ReactPlayer url={urlVideo} controls={true} width="40%" height="30%"/>   
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
                   if (form.getFieldValue('nrFrames') !== undefined){
                       extract(order, form.getFieldValue('nrFrames'))
                       setDisplayModal(false)
                       form.resetFields()
                       refresh()
                   }
               }}
               >
            <div style={styleCard}>
                <Card title="Capture Frames" bordered={false} style={{ width: 450 }}>
                    <Form form={form} labelCol={{span: 8}}
                          wrapperCol={{span: 16}}
                          initialValues={{
                              nrFrames: undefined
                          }}>
                        <Form.Item label="Number of Frames" name="nrFrames">
                            <InputNumber min={1} max={10}/>
                        </Form.Item>
                    </Form>
                </Card>
            </div>

        </Modal>
      </div>
    );
  };
  
  export default VideoCard;
