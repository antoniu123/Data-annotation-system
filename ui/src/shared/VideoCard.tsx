import axios from "axios";
import { BsTag } from "react-icons/bs";
import ReactPlayer from "react-player";
import '../css/card.css'

interface VideoCardProps {
    title: string
    details: number
    order: number
    urlVideo: string
}
const VideoCard : React.VFC<VideoCardProps> = ({ title, details, order, urlVideo }) => {
      
    const extract = async (id:number, nrFrames:number) => {
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
      await axios.post(url, data, config)
      .then(response => { 
        console.error(response) 
        return response
      })
      .catch(err => { 
          console.error(err) 
          return err
      })
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
            >
              {/* TODO need to be changed that 4*/}
              <BsTag onClick={()=>extract(order, 4)}/> 
              <span
                className="counter group-hover:text-white"
              >
                {0}
              </span>
            </div>
          </div>
        </div>
        <div className="textWrapper">
          <h1 className="text">{`${title}`}</h1>
        </div>
      </div>
    );
  };
  
  export default VideoCard;
