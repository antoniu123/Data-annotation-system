import { LocationPoint } from "./LocationPoint";


export const getAbsoluteOffset = (el:HTMLElement) : LocationPoint => {
    let x = 0,
        y = 0;
    do {
        x += el.offsetLeft;
        y += el.offsetTop;
    } 
    while (el === el.offsetParent);
    return {
        x: x,
        y: y
    };
};
