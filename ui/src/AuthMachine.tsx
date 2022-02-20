import { notification } from "antd"
import axios from "axios"
import { differenceInMilliseconds, isAfter, subMinutes } from 'date-fns'
import jwtDecode from "jwt-decode"
import { assign, Machine } from "xstate"
import { TokenDecoded } from "./models/TokenDecoded"
import { default as bcrypt } from 'bcryptjs'

export interface AuthMachineContext {
    jwt?: string
    authResult?: TokenDecoded
    message?: string
}
  
export interface AuthMachineSchema {
    context: AuthMachineContext
    states: {
      loginDisplayed: {}
      automaticLogin: {}
      tryLogin: {}
      registerDisplayed: {}
      tryRegister: {}
      registerFailed: {}
      forgetDisplayed: {}
      tryRecover: {}
      changePasswordDisplayed: {}
      tryChangePassword: {}
      loginSuccess: {}
      loginFailed: {}
    }
  }
  
export type AuthMachineEvent =
    | { type: 'RETRY' }
    | { type: 'LOGIN'; payload: { username: string; password: string } }
    | { type: 'REGISTER'; payload: { username: string; email: string, password: string} }
    | { type: 'RECOVER'; payload: {email: string}}
    | { type: 'MOVE_REGISTER'}
    | { type: 'MOVE_LOGIN'}
    | { type: 'MOVE_RECOVER'}
    | { type: 'MOVE_CHANGE_PASSWORD'}
    | { type: 'ABORT'}
    | { type: 'CHANGE_PASSWORD'; payload: { userId: number, oldPassword: string, password: string } }
    | { type: 'LOGOUT' }
  
export const createAuthMachine = () =>
    Machine<AuthMachineContext, AuthMachineSchema, AuthMachineEvent>(
      {
        id: 'auth-machine',
        context: {
          authResult: undefined,
          jwt: undefined,
          message: undefined
        },
        initial: 'loginDisplayed',
        states: {
          loginDisplayed: {
            always: { target: 'automaticLogin', cond: 'existValidLocalStorage'},
            on: {
              LOGIN: {
                target: 'tryLogin'
              },
              MOVE_REGISTER: {
                target: 'registerDisplayed'   
              },
              MOVE_RECOVER: {
                target: 'forgetDisplayed'   
              }
            }
          },
          automaticLogin:{
            invoke: {
              id: 'tryLogin',
              src: 'performAutomaticLogin',
              onDone: {
                target: 'loginSuccess',
                actions: assign((context, event) => {
                    const decoded = jwtDecode<TokenDecoded>(event.data)
                    return {
                      authResult: decoded,
                      jwt: event.data,
                      message: 'login OK'
                    }
                })
              },
              onError: {
                target: 'loginFailed'
              }
            }
          },
          tryLogin: {
            invoke: {
              id: 'tryLogin',
              src: 'performAuthentication',
              onDone: {
                target: 'loginSuccess',
                actions: assign((context, event) => {
                    const decoded = jwtDecode<TokenDecoded>(event.data.token)
                    window.localStorage.setItem('jwt', JSON.stringify(event.data.token))
                    return {
                      authResult: decoded,
                      jwt: event.data.token,
                      message: 'login OK'
                    }
                })
              },
              onError: {
                target: 'loginFailed'
              }
            }
          },
          loginFailed:{
            on : {
              RETRY: {
                target: 'loginDisplayed'
              }
            }  
          },
          registerDisplayed: {
            on: {
              REGISTER: {
                target: 'tryRegister'
              },
              MOVE_LOGIN: {
                target: 'loginDisplayed'
              }
            }
          },
          tryRegister: {
            invoke: {
              id: 'tryRegister',
              src: 'performRegistration',
              onDone: {
                target: 'loginDisplayed'
              },
              onError: {
                target: 'registerFailed',
                actions: assign((context, event) => {
                  return {
                    authResult: undefined,
                    jwt: undefined,
                    message: event.data
                  }
              })
              }
            }
          },
          registerFailed:{
            on : {
              RETRY: {
                target: 'registerDisplayed'
              }
            }  
          },
          forgetDisplayed: {
            on: {
              RECOVER: {
                target: 'tryRecover'
              },
              MOVE_LOGIN: {
                target: 'loginDisplayed'
              }
            }
          },
          tryRecover: {
            invoke: {
              id: 'tryRecover',
              src: 'performRecovery',
              onDone: {
                target: 'loginDisplayed'
              },
              onError: {
                target: 'forgetDisplayed',
                actions: assign((context, event) => {
                  return {
                    authResult: undefined,
                    jwt: undefined,
                    message: event.data
                  }
              })
              }
            }
          },
          changePasswordDisplayed:{
            on: {
              CHANGE_PASSWORD: {
                target: 'tryChangePassword'
              },
              ABORT: {
                target: 'loginSuccess'
              }
            }
          },
          tryChangePassword: {
            invoke: {
              id: 'tryChangePassword',
              src: 'performChangePassword',
              onDone: {
                target: 'loginSuccess'
              },
              onError: {
                target: 'loginSuccess'
              }
            }
          },
          loginSuccess: {
            always: [
              { target: 'loginDisplayed', cond: 'hasNoToken'},
              { target: 'loginDisplayed', cond: 'shouldRefreshToken'}
            ],
            after: {
              token_refresh_time: {
                target: 'loginDisplayed', actions: 'logout'
              }
            },
            on: {
              LOGOUT: {
                target: 'loginDisplayed', actions: 'logout'
              },
              MOVE_CHANGE_PASSWORD: {
                target: 'changePasswordDisplayed'
              }
            }
          }
        }
      },
      {
        actions: {
          logout: assign((context, event) => {
            window.localStorage.removeItem('jwt')
            return {
              authResult: undefined,
              jwt: undefined,
              message: undefined
            }
          })
        },
        guards: {
          existValidLocalStorage: (context) => {
            const item = window.localStorage.getItem('jwt')
            const rec =  item ? JSON.parse(item) : null
            if (rec) {
              try{
                const decoded = jwtDecode<TokenDecoded>(rec)
                const now = new Date()
                const expireTime = decoded.exp * 1000
                const timeForRenewingToken = subMinutes(new Date(expireTime), 1)
                if (!isAfter(now, timeForRenewingToken)){
                  return true
                }
                else {
                  window.localStorage.removeItem('jwt')
                  return false  
                }
              }
              catch (error) {
                console.error(error)
                window.localStorage.removeItem('jwt')
                return false
              }
            }              
            return false   
          },
          hasNoToken: (context) => !context.jwt,
          shouldRefreshToken: (context) => {
            if (!context?.authResult?.exp) {
              return true
            }
            const now = new Date()
            const expireTime = context.authResult.exp * 1000
            const timeForRenewingToken = subMinutes(new Date(expireTime), 1)
            if (isAfter(now, timeForRenewingToken)){
               window.localStorage.removeItem('jwt')
               return true
            }
            return false
          }
        },
        delays: {
          token_refresh_time: (context,event)=>{
            if (!context?.authResult?.exp){
              return 1
            }
            const now = new Date()
            const expireTime = context.authResult.exp * 1000
            const timeForRenewingToken = subMinutes(new Date(expireTime), 1)
            return differenceInMilliseconds(timeForRenewingToken, now)
          }
        },
        services: {
            performRegistration: (id, event) => {
                let username = ''
                let password = ''
                let email = ''
                let roles : String[] = []
                if (event.type === 'REGISTER') {
                    username = event.payload.username
                    email = event.payload.email
                    password = event.payload.password
                    roles =  ["ROLE_USER"] // implicit any register is an USER
                }
                const url = `http://${process.env.REACT_APP_SERVER_NAME}/api/auth/signup`
                const body = {
                    username: username,
                    email: email,
                    password: password,
                    roles: roles
                }
                return async () => axios({
                                        method: 'post',
                                        url: url,
                                        data: body
                                    })
                                    .then((ret) => {
                                        if (ret.data && ret.data.message ) {
                                            notification.info({
                                              message: 'Info',
                                              description: ret.data.message
                                            })
                                            return Promise.resolve(ret.data)
                                        }                     
                                        else{
                                            notification.error({
                                              message: 'Error',
                                              description: "Register unsuccessfully"
                                            })
                                            return Promise.reject("error on registering")     
                                        }                                
                                        })
                                    .catch((err) => {
                                        if (err.response.data.message){
                                          notification.error({
                                            message: 'Error',
                                            description: err.response.data.message
                                          })
                                          return Promise.reject(err.response.data.message)
                                        }
                                        return Promise.reject(err.response.data)
                                      })
            },
            performAuthentication: (id, event) => {
                let username = ''
                let password = ''
                if (event.type === 'LOGIN') {
                username = event.payload.username
                password = event.payload.password
                }
                const url = `http://${process.env.REACT_APP_SERVER_NAME}/api/auth/signin`
                const body = {
                    username: username,
                    password: password
                }
                return async () => axios({
                                    method: 'post',
                                    url: url,
                                    data: body
                                })
                                .then((ret) => {
                                    if (ret.data && ret.data.token) {
                                        notification.info({
                                          message: 'Info',
                                          description: "Login successfull"
                                        })
                                        return Promise.resolve(ret.data)
                                    }                     
                                    else{
                                        notification.error({
                                          message: 'Info',
                                          description: "Login unsuccessfully"
                                        })
                                        return Promise.reject("unauthorized")     
                                    }                                
                                    })
                                .catch((err) => Promise.reject(err))
            },
            performAutomaticLogin: (id, event) => {
               const token = window.localStorage.getItem("jwt")
               if (token) {
                  return Promise.resolve(JSON.parse(token))
               }
               return Promise.reject("unauthorized")
            },
            performRecovery: (id, event) => {
                let email = ''
                if (event.type === 'RECOVER') {
                    email = event.payload.email
                }
                const url = `http://${process.env.REACT_APP_SERVER_NAME}/api/auth/recovery`
                const body = {
                    email: email
                }
                return async () => axios({
                                        method: 'post',
                                        url: url,
                                        data: body
                                    })
                                    .then((ret) => {
                                        if (ret.data && ret.data.message ) {
                                            notification.info({
                                              message: 'Info',
                                              description: ret.data.message
                                            })
                                            return Promise.resolve(ret.data)
                                        }                     
                                        else{
                                            notification.error({
                                              message: 'Error',
                                              description: "Register unsuccessfully"
                                            })
                                            return Promise.reject("error on registering")     
                                        }                                
                                        })
                                    .catch((err) => {
                                        if (err.response.data.message){
                                          notification.error({
                                            message: 'Error',
                                            description: err.response.data.message
                                          })
                                          return Promise.reject(err.response.data.message)
                                        }
                                        notification.error({
                                          message: 'Error',
                                          description: err
                                        })
                                        return Promise.reject(err)
                                      })
            },
            performChangePassword: (id, event) => {
              let oldPassword = ''
              let password = ''
              let userId = 0
              const token = JSON.parse(window.localStorage.getItem("jwt") ?? "")
              if (event.type === 'CHANGE_PASSWORD') {
                 userId = event.payload.userId
                 oldPassword = event.payload.oldPassword
                 password = event.payload.password
              }
              //check old password
              const urlVerifyPassword = `http://${process.env.REACT_APP_SERVER_NAME}/api/auth/passwordverify/${userId}`
              axios
                .get(urlVerifyPassword, { headers: {"Authorization" : `Bearer ${token}`} })
                .then((ret) => {
                  if (!bcrypt.compareSync(oldPassword, ret.data.password )) {
                    notification.error({message: 'Error', description: "Password doesn't match"})
                    return Promise.reject("Error on checking old password")
                  }
                  else{
                    notification.info({message: 'Info', description: "Old Password checked successfully"})
                  }                             
                })
                .catch((err) => {
                  notification.error({message: 'Error', description: err})
                  return Promise.reject(err)
                })
              //if it is ok then change it
              const url = `http://${process.env.REACT_APP_SERVER_NAME}/api/auth/passwordchange/${userId}`
              const body = {
                password: password
              }
              const config = {
                headers: { Authorization: `Bearer ${token}` }
              }
              return async () => axios.post(url,
                                      body,
                                      config)
                                  .then((ret) => {
                                      if (ret.data && ret.data.message ) {
                                          notification.info({
                                            message: 'Info',
                                            description: ret.data.message
                                          })
                                          return Promise.resolve(ret.data.message)
                                      }                     
                                      else{
                                          notification.error({
                                            message: 'Error',
                                            description: "Password not changed due to an error"
                                          })
                                          return Promise.reject("Password not changed due to an error")     
                                      }                                
                                      })
                                  .catch((err) => {
                                      if (err.response.data.message){
                                        notification.error({
                                          message: 'Error',
                                          description: err.response.data.message
                                        })
                                        return Promise.reject(err.response.data.message)
                                      }
                                      notification.error({
                                        message: 'Error',
                                        description: err
                                      })
                                      return Promise.reject(err)
                                    })                
            }
          }
        }
    )