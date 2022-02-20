import axios from "axios";
import { useEffect, useState } from "react";
import { BsTag } from "react-icons/bs";
import '../css/card.css'
import TagImage from "./TagImage"

interface ImageCardProps {
    title: string
    urlImage: string
    id: number
}
const ImageCard : React.VFC<ImageCardProps> = ({ id, title, urlImage }) => {
    const [tagsVisible, setTagsVisible] = useState(false)   

    const [cnt, setCnt] = useState(0)

    const textUrl = `http://${process.env.REACT_APP_SERVER_NAME}/document/${id}/count`
    
    useEffect(() => {
        const getText = async () => {
            const result = await axios.get(textUrl)
            .then(response => response)
            .catch(err => { 
                console.error(err) 
                return err
            })
            setCnt(result.data)
        };

        getText()
    },[textUrl,cnt]);

    return (
      <>
        <div className="wrapper wrapperAnime">
          <div className="header">
            <div className="imageWrapper">
              <img src={urlImage} className="image" alt="" />
            </div>
            <div className="badgeWrapper">
              <div
                className="primaryBadge badgeAnime" onClick={()=>setTagsVisible(true)}
              >
                <BsTag />
                <span
                  className="counter group-hover:text-white"
                >
                  {cnt}
                </span>
              </div>
            </div>
          </div>
          <div className="textWrapper">
            <h1 className="text">{`${title}`}</h1>
          </div>
        </div>
        { tagsVisible ?
        <TagImage docId={id} urlImage={urlImage} visible={tagsVisible} onClose={()=>setTagsVisible(false)} 
           onRefresh={(cnt:number)=> setCnt(cnt)}/> : null}
      </>
    );
  };
  
  export default ImageCard;