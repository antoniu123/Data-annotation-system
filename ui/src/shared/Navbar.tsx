import {UserOutlined} from '@ant-design/icons';
import {Popover} from 'antd';
import React from 'react';
import {Roles} from '../models/Roles';
import UserDetail from './UserDetail';

interface NavbarProps {
    roles: Roles[]
    user: string | undefined
    logOut: () => void
    changePassword: () => void 
}

const Navbar : React.VFC<NavbarProps> = ({roles, user, logOut, changePassword}) => {
    return (
        <div>
            <nav className="bg-blue">
                <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* Hamburger Menu */}
                            <button className="inline-flex items-center justify-center p-2 text-white rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg className="hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                            {/* Logo */}
                            <div className="flex items-center flex-shrink-0">
                                {/* <img className="block w-auto h-8 lg:hidden" src="./sbcr-logo-transparent-white-bg.png" alt="Surf Break Costa Rica Logo"></img>
                                <img className="hidden w-auto h-8 lg:block" src="./sbcr-logo-transparent-white-bg.png" alt="Surf Break Costa Rica logo"></img> */}
                            </div>
                            {/* Nav Items */}
                            <div className="hidden sm:block sm:ml-6">
                                <div className="flex space-x-4">
                                    <a href="/" className="px-3 py-2 text-sm font-medium text-white rounded-md bg-turquoise hover:bg-turquoise-dark">Home</a>
                                    <a href="/dashboard" className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-turquoise hover:text-white">Dashboard</a>
                                    <a href="/projects" className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-turquoise hover:text-white">Projects</a>
                                    <a href="/upload" className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-turquoise hover:text-white">Upload</a>
                                    <a href="/about" className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-turquoise hover:text-white">Contact</a>
                                    { roles.includes(Roles.ADMIN) &&
                                        <a href="/users" className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-turquoise hover:text-white">Users</a>
                                    }
                                    { roles.includes(Roles.VALIDATOR) &&
                                    <a href="/validate" className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-turquoise hover:text-white">Validate</a>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {/* Notification Icon */}
                            {/* <button className="p-1 text-white rounded-full bg-turquoise hover:bg-turquoise-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">View notifications</span>
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button> */}
                            <div className="flex flex-row items-center px-4 py-2 text-sm font-medium text-white rounded-md bg-turquoise hover:bg-turquoise-dark">
                                <div>
                                    {/* <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg> */}
                                    <UserOutlined />
                                </div>
                                <div>
                                    <Popover content={<UserDetail 
                                                        roles={roles}
                                                        logOut={logOut}
                                                        changePassword={changePassword}
                                                        />}>
                                        <div>{user}</div>
                                    </Popover>
                                </div>  
                            </div>
                        </div>
                        
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar