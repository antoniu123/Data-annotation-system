import React from 'react';
import {Alert, Button, Form, Input, Layout, Modal, notification, Result, Spin} from 'antd';
import {Route, Switch, withRouter} from 'react-router-dom'
import {LoadingOutlined} from '@ant-design/icons'
import About from './pages/About';
import {createAuthMachine} from './AuthMachine';
import {useMachine} from '@xstate/react';
import Match from './shared/Match';
import {Footer} from 'antd/lib/layout/layout';
import Navbar from './shared/Navbar';
import Dashboard from './pages/Dashboard';
import FileUpload from './shared/FileUpload';
import Projects from "./pages/Projects";
import {Roles} from "./models/Roles";
import Users from "./pages/Users";
import Validate from "./pages/Validate";
import HomeNew from "./HomeNew";

const { Header, Content } = Layout

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

interface UserContextInterface {
  userId: number,
  email: string,
  username: string
  roles: Roles[]
}

export const UserContext = React.createContext<UserContextInterface | null>(null);

const App: React.VFC = () => {
  
  const [authState, send] = useMachine(createAuthMachine())

  const onSubmitLogin = (values: any) => {
    send({
      type: 'LOGIN',
      payload: {
        username: values.username,
        password: values.password
      }
    })
  }

  const onChangePassword = () => {
    send({
      type: 'MOVE_CHANGE_PASSWORD'
      }
    )
  }

  const onSubmitRegister = (values: any) => {
    if (values.password!==values.confirm){
      notification.error({
        message: 'Info',
        description: "Password need to be the same"
      })
      return
    }
    send({
      type: 'REGISTER',
      payload: {
        username: values.username,
        email: values.email,
        password: values.password
      }
    })
  } 
  
  const onSubmitChangePassword = (values: any) => {
    send({
      type: 'CHANGE_PASSWORD',
      payload: {
        userId: authState.context.authResult?.jti ? authState.context.authResult.jti : 0,
        oldPassword: values.oldPassword,
        password: values.password
      }
    })
  }  

  const onSubmitRecovery = (values: any) => {
    send({
      type: 'RECOVER',
      payload: {
        email: values.email
      }
    })
  }  

  const moveRegister = () => {
    send({
      type: 'MOVE_REGISTER'
    })
  }

  const moveLogin = () => {
    send({
      type: 'MOVE_LOGIN'
    })
  }

  const back = () => {
    send({
      type: 'ABORT'
    })
  }

  const moveRecover = (values: any) => {
    send({
      type: 'MOVE_RECOVER'
    })
  }

  const logOut = () => {
    send({
      type: 'LOGOUT'
    })
  }

  return (
    <>
      <Match on={['loginDisplayed']} state={authState}>
        <Modal visible={true} footer={null} closable={false}>
          <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                  Sign in to your account
                </h2>
              </div>
              <Form onFinish={onSubmitLogin} className="mt-8 space-y-6" action="#" method="POST" autoComplete="off">
                <Input type="hidden" name="remember" value="true"/>
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <Form.Item
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your username!'
                        }
                      ]}
                    >
                      <Input placeholder="Username" className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your password!'
                          }
                        ]}
                      >
                      <Input placeholder="Password" type="password" required 
                        className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
                    </Form.Item>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Input id="remember-me" name="remember-me" type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                    <label className="block ml-2 text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-indigo-600 hover:text-indigo-500" onClick={moveRecover}>
                      Forgot your password?
                    </div>
                  </div>
                </div>

                <div className="-space-y-px rounded-md shadow-sm">
                    <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Sign in
                    </button>
                    <br/>
                    <button onClick={moveRegister} className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Register
                    </button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </Match>

      <Match on={['registerDisplayed']} state={authState}>
        <Modal visible={true} footer={null} closable={false}>
          <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                  Register your account
                </h2>
              </div>
              <Form onFinish={onSubmitRegister} className="mt-8 space-y-6" action="#" method="POST" autoComplete="off">
                <Input type="hidden" name="remember" value="true"/>
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <Form.Item
                      name="username"
                      rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 3, message: 'Username must be minimum 3 characters' },
                        { max: 20, message: 'Username must be maximum 20 characters' }
                      ]}
                    >
                      <Input placeholder="Username" className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                        name="password"
                        rules={[
                          { required: true, message: 'Please input your password!' },
                          { min: 6, message: 'Password must be minimum 6 characters' },
                          { max: 40, message: 'Password must be maximum 40 characters' }
                        ]}
                      >
                      <Input placeholder="Password" type="password" required 
                        className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                        name="confirm"
                        rules={[
                          {
                            required: true,
                            message: 'Please confirm your password!'
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                          }),
                        ]}
                        
                      >
                      <Input placeholder="Repeat Password" type="password" required 
                        className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, type: "email", message: 'Please input your valid email!' }
                      ]}
                    >
                      <Input placeholder="Email" className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                    </Form.Item>
                  </div>
                </div>

                <div>
                  <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Register
                  </button>
                  <br/>
                  <button onClick={moveLogin} className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Log In
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </Match>

      <Match on={['forgetDisplayed']} state={authState}>
        <Modal visible={true} footer={null} closable={false}>
          <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                  Recovery your account
                </h2>
              </div>
              <Form onFinish={onSubmitRecovery} className="mt-8 space-y-6" action="#" method="POST" autoComplete="off">
                <Input type="hidden" name="remember" value="true"/>
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, type: "email", message: 'Please input your valid email!' }
                      ]}
                    >
                      <Input placeholder="Email" className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                    </Form.Item>
                  </div>
                </div>

                <div>
                  <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Recovery
                  </button>
                  <br/>
                  <button onClick={moveLogin} className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Log In
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </Match>

      <Match on={['changePasswordDisplayed']} state={authState}>
        <Modal visible={true} footer={null} closable={false}>
          <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div>
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                  Change your password
                </h2>
              </div>
              <Form onFinish={onSubmitChangePassword} className="mt-8 space-y-6" action="#" method="POST" autoComplete="off">
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <Form.Item
                      name="oldPassword"
                      rules={[
                        { required: true, message: 'Please input your old password!' }
                      ]}
                    >
                      <Input placeholder="Old Password" type="password" required className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                        name="password"
                        rules={[
                          { required: true, message: 'Please input your password!' },
                          { min: 6, message: 'Password must be minimum 6 characters' },
                          { max: 40, message: 'Password must be maximum 40 characters' }
                        ]}
                      >
                      <Input placeholder="Password" type="password" required 
                        className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                        name="confirm"
                        rules={[
                          {
                            required: true,
                            message: 'Please confirm your password!'
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                          }),
                        ]}
                        
                      >
                      <Input placeholder="Repeat Password" type="password" required 
                        className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
                    </Form.Item>
                  </div>
                </div>

                <div>
                  <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Change Password
                  </button>
                  <br/>
                  <button onClick={back} className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Abort
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </Match>

      <Match on={['tryLogin', 'tryRegister', 'trylogout', 'tryChangePassword']} state={authState}>
        <Spin indicator={antIcon} tip="Loading...">
          <Alert message="Please wait" type="info" />
        </Spin>
      </Match>
       
      <Match on={['loginSuccess']} state={authState}>
        <UserContext.Provider value={
                                     {userId: authState.context.authResult?.jti ? authState.context.authResult?.jti : 0, 
                                      email: authState.context.authResult?.iss ? authState.context.authResult?.iss : "",
                                      username: authState.context.authResult?.sub? authState.context.authResult?.sub: "",
                                      roles: authState.context.authResult?.roles && authState.context.authResult?.roles.length > 0 ?
                                          authState.context.authResult?.roles : []
                                     }
                                    }>
          <Header>
            <Navbar roles={authState.context.authResult?.roles ?? []} 
                    user={authState.context.authResult?.sub} logOut={logOut} changePassword={onChangePassword}/>
          </Header>  
          <Layout className="p-0 m-0 bg-gradient-to-b from-blue-400 via-red-200 to-green-700">
            <Content
              className="site-layout-background"
              style={{
                margin: '10px 10px',
                padding: 5,
                minHeight: 600
              }}>
              <Switch>
                <Route path={'/'} exact component={() => <HomeNew />} />
                {!authState.context.authResult?.roles.includes(Roles.VALIDATOR) &&
                  <Route path={'/dashboard'} exact component={() => <Dashboard/>}/>
                }
                {!authState.context.authResult?.roles.includes(Roles.VALIDATOR) &&
                  <Route path={'/projects'} exact component={() => <Projects/>}/>
                }
                { authState.context.authResult?.roles.includes(Roles.ADMIN) &&
                  <Route path={'/users'} exact component={() => <Users/>}/>
                }
                { authState.context.authResult?.roles.includes(Roles.VALIDATOR) &&
                <Route path={'/validate'} exact component={() => <Validate/>}/>
                }
                { (authState.context.authResult?.roles.includes(Roles.ADMIN) || authState.context.authResult?.roles.includes(Roles.USER)) &&
                <Route path={'/upload'} exact component={() => <FileUpload initialState={"fillName"} initialErrorMessage={""}/>} />
                }

                <Route path={'/about'} exact component={() => <About />} />  
              </Switch>
            </Content>
            </Layout>
          <Footer style={{ textAlign: 'center' }}>Bogdan Antoniu</Footer>
        </UserContext.Provider>  
      </Match>  

      <Match on={['loginFailed']} state={authState}>
        <Result
              status="403"
              title="Invalid username/password"
              subTitle="Please try to log again. If Problem persis contact administrator"
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    send({
                      type: 'RETRY'
                    })
                  }}
                >
                  Try Log in Again
                </Button>
              }
            />
      </Match> 

      <Match on={['registerFailed']} state={authState}>
        <Result
              status="403"
              title="No registration due to an error"
              subTitle= {authState.context.message}
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    send({
                      type: 'RETRY'
                    })
                  }}
                >
                  Try Register in Again
                </Button>
              }
            />
      </Match>  
    </>
  );
}

export default withRouter(App)
