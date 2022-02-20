import {Avatar, Card} from "antd"
import {UserOutlined} from "@ant-design/icons";

const About: React.VFC = () => {

  const url = (id: number) : string => {
      return `http://${process.env.REACT_APP_SERVER_NAME}/document/`+ id
  }

  return (
      <>
          <div className="flex flex-row">
            <Card>
                <Avatar shape="square" size={128} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            </Card>
            <Card className="text-right">
              <p> Bogdan Antoniu </p>
              <p> 87-89 Prelungirea Ghencea St. </p>
              <p> Bragadiru </p>
              <p> Ilfov </p>
            </Card>
          </div>
      </>
  )
}

export default About