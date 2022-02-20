import { Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { BsTag } from "react-icons/bs";
import '../css/card.css'

const { TextArea } = Input;

interface TextCardProps {
    title: string
    details: number
    order: number
    textUrl: string
}

const TextCard : React.VFC<TextCardProps> = ({ title, details, order, textUrl }) => {
    
  const [text, setText] = useState<any>(null)

  const getText = async () => {
    const result = await axios.get(textUrl).then(response => response).catch(err => err)
    setText(result.data)
  };
   
  useEffect(() => {
    getText()
  });

  return (
    <div className="wrapper wrapperAnime">
      <div className="header">
        <div className="imageWrapper">
          <TextArea rows={8} value={text}/>
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
  
  export default TextCard;