import * as React from 'react'
import {Line, LiquidConfig} from '@ant-design/charts'
import {Pie, Bar, Liquid} from '@ant-design/plots';
import {Col, Row} from "antd";
import {BarConfig} from "@ant-design/plots/es/components/bar";
import {useEffect, useState} from "react";
import axios from "axios";
import {DetailCountPerDocument} from "./models/DetailCountPerDocument";
import {PercentPerUserRole} from "./models/PercentPerUserRole";
import {OccurencesPerTag} from "./models/OcccurencesPerTag";
import {NumberOfDocumentsPerStatus} from "./models/NumberOfDocumentsPerStatus";


const Home: React.VFC = () => {
    const token = JSON.parse(window.localStorage.getItem("jwt") ?? "")
    const [dataLine, setDataLine] = useState<DetailCountPerDocument[]>([])
    const [userPercent, setUserPercent] = useState<PercentPerUserRole[]>([])
    const [completedPercent, setCompletedPercent] = useState<number>(0)
    const [numberOfOccurences, setNumberOfOccurences] = useState<OccurencesPerTag[]>([])
    const [numberPerStatus, setNumberPerStatus] = useState<NumberOfDocumentsPerStatus[]>([])
    useEffect(() => {
        const textUrl1 = `http://${process.env.REACT_APP_SERVER_NAME}/graphics/count`
        const textUrl2 = `http://${process.env.REACT_APP_SERVER_NAME}/graphics/roles`
        const textUrl3 = `http://${process.env.REACT_APP_SERVER_NAME}/graphics/completed`
        const textUrl4 = `http://${process.env.REACT_APP_SERVER_NAME}/graphics/occurences`
        const textUrl5 = `http://${process.env.REACT_APP_SERVER_NAME}/graphics/status`
        const getText1 = async () => {
            if (token){
                const result = await axios.get(textUrl1, {headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }})
                    .then(response => response)
                    .catch(err => {
                        console.error(err)
                        return err
                    })
                setDataLine(result.data)
            }
        }
        const getText2 = async () => {
            if (token){
                const result = await axios.get(textUrl2, {headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }})
                    .then(response => response)
                    .catch(err => {
                        console.error(err)
                        return err
                    })
                setUserPercent(result.data)
            }
        }
        const getText3 = async () => {
            if (token){
                const result = await axios.get(textUrl3, {headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }})
                    .then(response => response)
                    .catch(err => {
                        console.error(err)
                        return err
                    })
                if (result.data && result.data.length > 0)
                    setCompletedPercent(result.data[0].percent/ 100)
                else
                    setCompletedPercent(0.00)
            }
        }
        const getText4 = async () => {
            if (token){
                const result = await axios.get(textUrl4, {headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }})
                    .then(response => response)
                    .catch(err => {
                        console.error(err)
                        return err
                    })
                if (result.data && result.data.length > 0)
                    setNumberOfOccurences(result.data)
                else
                    setNumberOfOccurences([])
            }
        }
        const getText5 = async () => {
            if (token){
                const result = await axios.get(textUrl5, {headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }})
                    .then(response => response)
                    .catch(err => {
                        console.error(err)
                        return err
                    })
                if (result.data && result.data.length > 0)
                    setNumberPerStatus(result.data)
                else
                    setNumberPerStatus([])
            }
        }
        getText1()
        getText2()
        getText3()
        getText4()
        getText5()
    },[token]);

    const configLine = {
        dataLine,
        xField: 'name',
        yField: 'nr',
        point: {
            size: 3,
            shape: 'diamond',
        },
    }

    // const dataPie = [
    //     {
    //         type: 'a',
    //         value: 27,
    //     },
    //     {
    //         type: 'b',
    //         value: 25,
    //     },
    //     {
    //         type: 'c',
    //         value: 18,
    //     },
    //     {
    //         type: 'd',
    //         value: 15,
    //     },
    //     {
    //         type: 'e',
    //         value: 10,
    //     },
    //     {
    //         type: 'f',
    //         value: 5,
    //     },
    // ]
    const configPie = {
        appendPadding: 10,
        userPercent,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: (v:any) => `${(v.percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    }

    const dataBar1 = [...numberOfOccurences]
    const dataConfig1 : BarConfig= {
        data: dataBar1,
        xField: 'value',
        yField: 'type',
        seriesField: 'type',
        legend: {
            position: "top"
        },
    };

    const dataBar2 = [...numberPerStatus]
    const dataConfig2 : BarConfig= {
        data: dataBar2,
        xField: 'value',
        yField: 'type',
        seriesField: 'type',
        legend: {
            position: "top"
        },
    };

    const configLiquid: LiquidConfig = {
        percent: completedPercent,
        outline: {
            border: 4,
            distance: 8,
        },
        wave: {
            length: 128,
        },
    }

    return (
        <div>
            <main className="section">
                <section className="container">
                    <div>
                        <Row className="font-extrabold">Graphic</Row>
                        <Row gutter={[10, 10]}>
                            {userPercent && userPercent.length> 0 && <Col key={1} xs={{span: 6, offset: 1}} lg={{span: 10, offset: 1}}>
                                <div style={{backgroundColor: 'white'}}>
                                    <p className="text-center text-blue-600">Percent for each user role</p>
                                    <Pie data={userPercent} {...configPie} />
                                </div>
                            </Col>}

                            {dataBar1 && dataBar1.length > 0 && <Col key={2} xs={{span: 6, offset: 1}} lg={{span: 10, offset: 1}}>
                                <div style={{backgroundColor: 'white'}}>
                                    <p className="text-center text-blue-600">Count per each document Detail</p>
                                    <Bar {...dataConfig1} />
                                </div>
                            </Col>}

                            {dataBar2 && dataBar2.length > 0 && <Col key={2} xs={{span: 6, offset: 1}} lg={{span: 10, offset: 1}}>
                                <div style={{backgroundColor: 'white'}}>
                                    <p className="text-center text-blue-600">Document Details</p>
                                    <Bar {...dataConfig2} />
                                </div>
                            </Col>}

                            {dataLine && dataLine.length > 0 && <Col key={3} xs={{span: 6, offset: 1}} lg={{span: 4, offset: 1}}>
                                <div style={{backgroundColor: 'white'}}>
                                    <p className="text-center text-blue-600">Tags per document</p>
                                    <Line data={dataLine} {...configLine} />
                                </div>
                            </Col>}

                            {completedPercent && <Col key={4} xs={{span: 6, offset: 1}} lg={{span: 4, offset: 2}}>
                                <div style={{backgroundColor: 'white'}}>
                                    <p className="text-center text-blue-600">Tag Progress Percent</p>
                                    <Liquid {...configLiquid} />
                                </div>
                            </Col>}

                        </Row>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home
