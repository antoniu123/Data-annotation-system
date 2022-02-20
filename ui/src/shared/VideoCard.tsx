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
              <BsTag />
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