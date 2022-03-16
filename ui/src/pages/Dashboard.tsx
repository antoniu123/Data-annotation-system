import * as React from 'react'
import { Alert, Button, Col, Result, Row, Spin, } from 'antd'
import { assign, Machine } from 'xstate'
import { useMachine } from '@xstate/react'
import { LoadingOutlined } from '@ant-design/icons'
import { Document } from '../models/Document'
import Match from '../shared/Match'
import ImageCard from '../shared/ImageCard'
import '../css/card.css'
import { UserContext } from '../App'
import axios from 'axios'
import VideoCard from '../shared/VideoCard'
import TextCard from '../shared/TextCard'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

function getRandom(min:number, max:number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}  

const urlImage = (id: number) : string => {
  return `http://${process.env.REACT_APP_SERVER_NAME}/document/`+ id
}

const urlVideo = (id: number) : string => {
  return `http://${process.env.REACT_APP_SERVER_NAME}/video/mp4/`+ id
}

const urlText = (id: number) : string => {
  return `http://${process.env.REACT_APP_SERVER_NAME}/text/`+ id
}

const Dashboard: React.VFC = () => {

  const userContext = React.useContext(UserContext);

  const [documentState, send] = useMachine(createDocumentMachine(userContext && userContext.userId ? userContext.userId : 0))

  return (
    <>
      <Match on={['loading']} state={documentState}>
        <Spin indicator={antIcon} tip="Loading...">
          <Alert message="Please wait" type="info" />
        </Spin>
      </Match>

      <Match on={['idle']} state={documentState}>
        <div>
          {documentState.context.documents.length === 0 && (
            <div className="text-center">
              <h2>No documents found at the moment</h2>
            </div>
          )}
         
          <div>
            
              <main className="section">
                <section className="container">
                  <div>
                    <Row className="font-extrabold" >Images</Row>
                    <Row gutter={[16, 16]}>
                      {documentState.context.documents
                        .filter(doc => doc.documentType === 'image/jpeg' || doc.documentType === 'image/png' )
                        .sort((a,b)=>a.id-b.id)
                        .map((document, index) => (                        
                          <Col key={index} xs={{ span: 6, offset: 1 }} lg={{ span: 4, offset: 2 }}>
                            <ImageCard key={index} id={document.id} title={document.name} urlImage={urlImage(document.id)} /> 
                          </Col>                        
                      ))}
                     </Row>
                  </div>                 
                </section>
                <section className="container">
                  <div>
                    <Row className="font-extrabold">Videos</Row>
                    <Row gutter={[16, 16]}>
                      {documentState.context.documents
                        .filter(doc=> doc.documentType === 'video/mp4')
                        .map((document, index) => (                        
                          <Col key={index} xs={{ span: 6, offset: 1 }} lg={{ span: 4, offset: 2 }}>
                            <VideoCard key={index} title={document.name} details={getRandom(1,20)} order={document.id} 
                             urlVideo={urlVideo(document.id)} />
                          </Col>                        
                      ))}
                     </Row>
                  </div>   
                </section>
                <section className="container">
                  <div>
                    <Row className="font-extrabold">Text Files</Row>
                    <Row gutter={[16, 16]}>
                      {documentState.context.documents
                        .filter(doc => doc.documentType === 'text/plain' || doc.documentType === 'application/x-sql')
                        .map((document, index) => (                        
                          <Col key={index} xs={{ span: 6, offset: 1 }} lg={{ span: 4, offset: 2 }}>
                             <TextCard key={index} title={document.name} details={getRandom(1,20)} order={document.id} textUrl={urlText(document.id)} /> 
                          </Col>                        
                      ))}
                     </Row>
                  </div>   
                </section>
              </main>                       
          </div>
        </div>    
      </Match>

      <Match on={['displayDetail']} state={documentState}>
        {/* <TripDetails
          food={tripForDetail}
          onClose={() => {
            send({
              type: 'CLOSE_DETAIL'
            })
            setTripForDetail({} as Trip)
          }}
        /> */}
      </Match>

      <Match on={['rejected']} state={documentState}>
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

export default Dashboard

interface DocumentMachineContext {
  documents: Array<Document>
  countDetails: number[]
}

interface DocumentMachineSchema {
  context: DocumentMachineContext
  states: {
    loading: {}
    idle: {}
    displayDetail: {}
    rejected: {}
  }
}

type DocumentMachineEvent =
  | { type: 'RETRY' }
  | { type: 'OPEN_DETAIL' }
  | { type: 'CLOSE_DETAIL' }

const createDocumentMachine = (userId : number) =>
  Machine<DocumentMachineContext, DocumentMachineSchema, DocumentMachineEvent>(
    {
      id: 'document-machine',
      context: {
        documents: [],
        countDetails: []
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
                  countDetails: []
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
            OPEN_DETAIL: {
              target: 'displayDetail'
            }
          }
        },
        displayDetail: {
          on: {
            CLOSE_DETAIL: {
              target: 'loading'
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
        loadData: (_,event) => {
          const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
          const url = `http://${process.env.REACT_APP_SERVER_NAME}/userId/${userId}/documents`
          return async () => axios
                .get(url, { headers: {"Authorization" : `Bearer ${token}`} })
                .then((ret) => Promise.resolve(ret)               
                )
                .catch((err) => {
                  return Promise.reject(err)
                })
        }
      }
    }
  )
