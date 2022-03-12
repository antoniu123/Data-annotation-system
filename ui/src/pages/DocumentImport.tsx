import {UploadOutlined} from '@ant-design/icons'
import {useMachine} from '@xstate/react'
import {Form, Modal, notification, Progress} from 'antd'
import Upload, {RcFile, UploadChangeParam} from 'antd/lib/upload'
import React from 'react'
import {assign, createMachine} from 'xstate'
import {Card, CardSection} from '../shared/Card'

const DocumentImport: React.VFC<{documentId: number, initialErrorMessage: string, close: ()=> void}> = ({
  documentId,
  initialErrorMessage= '',
  close
}) => {
  const [form] = Form.useForm();
  const availableExtensions = [".csv"]
  const [uploadState, send] = useMachine(createUploadMachine(initialErrorMessage))
  const token = JSON.parse(window.localStorage.getItem("jwt") ?? "")

  const props = {
    name: 'file',
    multiple: true,
    headers: {
      "Authorization":`Bearer ${token}`
    },
    action: `http://${process.env.REACT_APP_SERVER_NAME}/document/${documentId}/import`,
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
          payload: 'File extension can be only .csv'
        })
        notification.error({
          message: 'Error',
          description: 'File extension can be only .csv'
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
    accept: '.csv',
    showUploadList: false
  }
  return (
    <Modal visible={true} onCancel={()=>close()} maskClosable={false} footer={null}>
      <div className="flex-grow align-middle">
        <Card className="h-full content-center" >
          <CardSection >
            <div className="px-4 py-2 border rounded-md border-full-text-base">
              <div className="mx-auto text-center">
                <Upload {...props}>
                  <UploadOutlined
                      className="text-full-text-base"
                      style={{fontSize: '32px'}}/>
                  <p className="text-fill-accent-medium">
                      Add file or drop file here
                  </p>
                  <p>
                    Files .csv - max size 100 MB
                  </p>
                </Upload>
              </div>
            </div>
          </CardSection>
        </Card>
        <Card className="h-full">
           <CardSection >
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
    </Modal>
  )
}

export default DocumentImport

interface ImportMachineContext {
  fileName: string
  percent: number
  errorMessage: string
}

export type ImportMachineEvent =
    | { type: 'SUCCESS', payload: string }
    | { type: 'UPLOAD' , payload: string }
    | { type: 'ERROR', payload: string }
    | { type: 'UPLOADING', payload: string }
    | { type: 'UPDATE_PROGRESS', payload: string }

const createUploadMachine = (
  _initialErrorMessage?: string
) =>  createMachine<ImportMachineContext, ImportMachineEvent>(
    {
      id: 'file-import-machine',
      initial: "init",
      context:{
        fileName: '',
        percent: 0,
        errorMessage: ''
      },
      states: {
        init:{
          entry: assign({ percent: (_context,event) => parseInt(event.payload,10)}),
          always:[
            {target:'idle'}
          ]
        },
        idle: {
          on:{
            UPLOAD:{
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
          after: {
            3000: { target: 'reset' }
          }
        },
        reset:{
          entry: assign({ percent: (_context,event) => 0}),
          always: [
            { target: 'idle'}
          ]
        },
        error: {
          always: [
            { target: 'idle'}
          ]
        }
      }
  })