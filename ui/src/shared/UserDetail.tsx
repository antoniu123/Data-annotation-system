import { Button, Menu } from 'antd';
import React from 'react';
import { UserContext } from '../App';
import { Roles } from '../models/Roles';

interface UserMenuProps {
    roles: Roles[]
    logOut: () => void
    changePassword: () => void
}

const UserMenu: React.VFC<UserMenuProps> = ({roles, logOut, changePassword}) => {
  const userContext = React.useContext(UserContext);

  return(
      <>
        <p className="font-bold">{userContext?.email}</p>
        <p className="font-bold align-middle">{roles}</p> 
        <br/>   
        <div className="block text-gray-900 transition-colors duration-100 rounded text-normal hover:bg-purple-500 hover:text-white">  
            <div>
                <Menu className="font-bold">
                    <Menu.Item key="1" danger onClick={changePassword}>
                        Change Password
                    </Menu.Item>
                </Menu> 
                <Button className="relative flex justify-center w-full text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                    onClick={logOut}
                    >Log Out
                </Button>     
            </div>
        </div>
    </>
  )
}

export default UserMenu