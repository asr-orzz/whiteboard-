
import rough from "roughjs/bin/rough";
import { getArrowHeadsCoordinates } from "./math";

const gen = rough.generator();

export const CreateElement = (id, x1, y1, x2, y2, { type,stroke,fill,size }) => {
  const element = {
    id,
    x1,
    y1,
    x2,
    y2,
  };
  let options = {
    seed: id + 1, 
  };
  if(stroke){
    options.stroke=stroke
  }
  if(fill){
    options.fill=fill
  }
  if(size){
    options.strokeWidth=size
  }
  switch (type) {
    case "Line":
      element.roughElement = gen.line(x1, y1, x2, y2, options);
      return element;
    case "Rectangle":
      element.roughElement = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
      return element;
    case "Circle":
        element.roughElement = gen.ellipse((x1+x2)/2,(y1+y2)/2, x2 - x1, y2 - y1, options);
        return element;
    case "Arrow":{
        const {x3,y3,x4,y4}=getArrowHeadsCoordinates(x1,y1,x2,y2);
        const points=[[x1,y1],[x2,y2],[x3,y3],[x2,y2],[x4,y4]];
        element.roughElement=gen.linearPath(points,options);
        return element;
    }
    default:
      throw new Error("Type not recognized");
  }
};