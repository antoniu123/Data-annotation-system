import { UploadOutlined } from '@ant-design/icons'
import { useMachine } from '@xstate/react'
import { Col, Form, Input, notification, Progress, Row } from 'antd'
import Upload, { RcFile, UploadChangeParam } from 'antd/lib/upload'
import React from 'react'
import { assign, createMachine } from 'xstate'
import { Card, CardSection } from './Card'

const FileUpload: React.VFC<{initialState: string, initialErrorMessage: string}> = ({
  initialState = 'fillName', 
  initialErrorMessage= ''
}) => {
  const [form] = Form.useForm();
  const availableExtensions = [".jpg", ".jpeg", ".mp4", ".avi", ".txt", ".sql", ".png"]
  const [uploadState, send] = useMachine(createUploadMachine(initialState, initialErrorMessage))
  const token = JSON.parse(window.localStorage.getItem("jwt") ?? "")
  let interestName:string | undefined = form.getFieldValue("name")

  const validateUpload = (_values: any) => {
    send({
      type: 'FILE_NAME_COMPLETED',
      payload: '0'
    })
  }

  const props = {
    name: 'file',
    multiple: true,
    headers: {
      "Authorization":`Bearer ${token}`
    },
    action: `http://${process.env.REACT_APP_SERVER_NAME}/upload?name=${interestName}`,
    beforeUpload: (file: RcFile) => {
      const extension:string = file.name.slice(file.name.lastIndexOf('.'))
      if (file.size > 100000000) {
        send({
           type: 'ERROR',
           payload: 'File larger than 100M'
        })
        notification.error({
          message: 'Error',
          description: 'File larger than 100M'
        })
        form.resetFields()
        return false
      }
      if (!availableExtensions.includes(extension) ) {
        send({
          type: 'ERROR',
          payload: 'File extension can be only .jpg, .jpeg, .mp4, .avi, .txt, .sql, .png' 
        })
        notification.error({
          message: 'Error',
          description: 'File extension can be only .jpg, .jpeg, .mp4, .avi, .txt, .sql, .png'
        })
        form.resetFields()
        return false
      }
      send({
        type: 'UPLOADING',
        payload: file.name
      })
      return true
    },
    onChange(info: UploadChangeParam) {
      if (uploadState.matches('idle')){
        send({
          type: 'UPLOAD',
          payload: ''
        })
      }
      if(info.event){
        send({
          type: 'UPDATE_PROGRESS',
          payload: info.event.percent.toFixed(2)
        })
        form.resetFields()
      }
      if(info.file){
        send({
          type: 'SET_FILENAME',
          payload: info.file.name
        })
      }
      if (info.file.response) {
        send({
          type: 'ERROR',
          payload: info.file.response.message
        })
        form.resetFields()
      }
    },  
    onSuccess(){
      form.resetFields()
      send({
        type: 'SUCCESS',
        payload: ''
      })      
    },
    accept: '.jpg,.jpeg,.txt,.sql,.mp4,.avi',
    showUploadList: false
  }
  return (
    <>
      <div className="flex-grow w-1/2 align-middle">
        <Card className="h-full">
          <CardSection>
          <Row>
            <Col xs={{ span: 6, offset: 1 }} lg={{ span: 8, offset: 2 }}>
              <Form form={form} onFinish={validateUpload} className="mt-8 space-y-6" action="#" method="POST" autoComplete="off">
                    <div className="-space-y-px rounded-md shadow-sm">
                      <div>
                        <Form.Item
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your interest name!'
                            }
                          ]}
                        >
                          <Input placeholder="Interest Name"
                                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                        </Form.Item>
                      </div>
                    </div>  
                    <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Validate Interest Name
                    </button>
              </Form>
          </Col>
          <Col xs={{ span: 6, offset: 1 }} lg={{ span: 10, offset: 2 }}>
            <div className="px-4 py-2 border rounded-md border-full-text-base">
              <div className="mx-auto text-center">
                <Upload disabled={uploadState.matches('fillName') || form.getFieldValue("name") === undefined} {...props}>
                  <UploadOutlined 
                      className="text-full-text-base" 
                      style={{fontSize: '32px'}}/>
                  <p className="text-fill-accent-medium">
                      Add file or drop file here     
                  </p>
                  <p>
                    Files .jpg, .jpeg, .mp4, .avi, .txt, .sql, .png - max size 100 MB 
                  </p>
                </Upload>  
              </div>
            </div>
          </Col>
          </Row>  
          </CardSection>  
        </Card>
      </div> 

      <div className="flex-grow w-1/2 align-middle">
            <Card className="h-full">
               <CardSection>
                 <p>
                   Last file uploaded : {uploadState.context.fileName}
                 </p>
                 <Progress status={uploadState.matches('error') ? 'exception' 
                                                                : uploadState.matches('success') ? 'success' 
                                                                                                : 'active'}
                  percent={uploadState.context.percent}    

                 />
               </CardSection>
            </Card> 
        </div>
    </>
  )
}

export default FileUpload

interface UploadMachineContext {
  fileName: string
  percent: number
  errorMessage: string
}

export type UploadMachineEvent =
    | { type: 'SUCCESS', payload: string }
    | { type: 'UPLOAD' , payload: string }
    | { type: 'FILE_NAME_COMPLETED', payload: string }
    | { type: 'ERROR', payload: string }  
    | { type: 'UPLOADING', payload: string }
    | { type: 'UPDATE_PROGRESS', payload: string }  
    | { type: 'SET_FILENAME', payload: string }  
    
const createUploadMachine = (
  initialState?: string,
  _initialErrorMessage?: string
) =>  createMachine<UploadMachineContext, UploadMachineEvent>(
    {
      id: 'file-upload-machine',
      initial: initialState ?? 'fillName',
      context:{
        fileName: '',
        percent: 0,
        errorMessage: ''
      },
      states: {
        fillName: {
          on: {
            FILE_NAME_COMPLETED: {
              target: 'idle',
              actions: assign({ percent: (_context,event) => parseInt(event.payload,10)})
            }
          }
        },
        idle: {
          on: {
            UPLOADING:{
              target: 'uploading',
              actions: assign({ fileName: (_context,event) => event.payload})
          
            },
            ERROR:{
              target: 'error',
              actions: assign({ errorMessage: (_context,event) => event.payload})
            }
          }
        },
        uploading: {
          on:{
            SUCCESS: {
              target: 'success'
            },
            ERROR: {
              target: 'error',
              actions: assign({ errorMessage: (_context,event) => event.payload})
              },
            UPDATE_PROGRESS: {
              target: 'uploading',
              actions: assign({ percent: (_context,event) => parseInt(event.payload,10)})
            }
          }
        },
        success: {
          always: [
            { target: 'fillName'}
          ]
        },
        error: {
          always: [
            { target: 'fillName'}
          ]                
        }
      }
  })