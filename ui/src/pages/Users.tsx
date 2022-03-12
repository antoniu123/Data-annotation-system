import {assign, Machine} from "xstate";
import axios from "axios";
import {useMachine} from "@xstate/react";
import * as React from "react";
import {UserContext} from "../App";
import {Alert, Button, Result, Select, Spin, Table} from "antd";
import Match from "../shared/Match";
import {LoadingOutlined} from "@ant-design/icons";

const {Option} = Select;

type myRole = {
    id: number,
    name: string
}

type myUser = {
    id: number
    username: string
    email: string
    roles: myRole[]
}

const Users: React.VFC = () => {
    const userContext = React.useContext(UserContext);
    const myUsername: string = userContext && userContext.username ? userContext.username : ''

    const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>

    const [userState, send] = useMachine(createUserMachine(userContext && userContext.userId ? userContext.userId : 0))

    const drop = (userId: number, initialValue: string) => (
        <Select defaultValue={initialValue} style={{width: 120}} onChange={(e) => {
            console.log('valoare dupa ', e)
            send({type: 'SAVE', payload: {userId: userId, userRole: e}})
        }}>
            <Option value="ROLE_ADMIN">ADMIN</Option>
            <Option value="ROLE_VALIDATOR">VALIDATOR</Option>
            <Option value="ROLE_USER">
                USER
            </Option>
        </Select>
    );

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            key: 'roles',
            render: (value: myRole[], record: myUser) => drop(record.id, value[0].name)
        }
    ];

    return (
        <>
            <Match on={['loading', 'saving']} state={userState}>
                <Spin indicator={antIcon} tip="Loading...">
                    <Alert message="Please wait" type="info"/>
                </Spin>
            </Match>

            <Match on={['idle']} state={userState}>
                <Table rowKey={record => record.id}
                       dataSource={userState.context.users.filter(user => user.username !== myUsername)}
                       columns={columns}/>;
            </Match>

            <Match on={['rejected']} state={userState}>
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
        </>)
}

interface UserMachineContext {
    users: Array<myUser>
}

interface UserMachineSchema {
    context: UserMachineContext
    states: {
        loading: {}
        idle: {}
        saving: {}
        rejected: {}
    }
}

type UserMachineEvent =
    | { type: 'RETRY' }
    | { type: 'LOAD' }
    | { type: 'SAVE', payload: { userId: number, userRole: string } }


const createUserMachine = (userId: number) =>
    Machine<UserMachineContext, UserMachineSchema, UserMachineEvent>(
        {
            id: 'user-machine',
            context: {
                users: []
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
                                    users: event.data.data
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
                        SAVE: {
                            target: 'saving'
                        }
                    }
                },
                saving: {
                    invoke: {
                        id: 'saving',
                        src: 'saveRole',
                        onDone: {
                            target: 'loading'
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
            services: {
                loadData: (_, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    const url = `http://${process.env.REACT_APP_SERVER_NAME}/users`
                    return async () => axios
                        .get(url, {headers: {"Authorization": `Bearer ${token}`}})
                        .then((ret) => Promise.resolve(ret)
                        )
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                },
                saveRole: (_, event) => {
                    const token = JSON.parse(window.localStorage.getItem("jwt") ?? '')
                    let body = {}
                    if (event.type === 'SAVE') {
                        body = {
                            ...event.payload
                        }
                    }
                    const url = `http://${process.env.REACT_APP_SERVER_NAME}/user`
                    return async () => axios
                        .post(url, body, {headers: {"Authorization": `Bearer ${token}`}})
                        .then((ret) => Promise.resolve(ret)
                        )
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                }
            }
        }
    )

export default Users