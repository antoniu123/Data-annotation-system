

const createMark = (x: number, y: number, point:number) => {

    const pointName = 'point-' + point

    const pointerStyle : React.CSSProperties = {
       position: 'absolute',
       left: `${x}`,
       top: `${y}`,
       width: '5px',
       height: '5px',
       borderRadius: '50%',
       border: '3px solid #75BA9E'
    }

    return (
        <div id={pointName}>
            <span style={pointerStyle}>
                point
            </span>
        </div>
    )
}   

export default createMark