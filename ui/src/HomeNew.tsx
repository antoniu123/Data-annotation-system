import * as React from 'react'
import {Line, LiquidConfig} from '@ant-design/charts'
import { Bar, Liquid} from '@ant-design/plots'
import {BarConfig} from "@ant-design/plots/es/components/bar";
import {useEffect, useState} from "react";
import axios from "axios";
import {DetailCountPerDocument} from "./models/DetailCountPerDocument";
import {PercentPerUserRole} from "./models/PercentPerUserRole";
import {OccurencesPerTag} from "./models/OcccurencesPerTag";
import {NumberOfDocumentsPerStatus} from "./models/NumberOfDocumentsPerStatus"


const HomeNew: React.VFC = () => {
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

    const getNumberForRole = (role:string) => {
        if (userPercent.length > 0)
            return userPercent.filter(res => res.type === role).length > 0 ? userPercent.filter(res => res.type === role)[0].value : 0
        else
            return 0
    }

    const getNumberStatus = (status:string) => {
        if (numberPerStatus.length > 0)
            return numberPerStatus.filter(res => res.type === status).length > 0 ? numberPerStatus.filter(res => res.type === status)[0].value : 0
        else
            return 0
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
        <main>

            <div className="flex flex-col md:flex-row">
                <section>
                    <div id="main" className="main-content flex-1 bg-gray-100 mt-12 md:mt-2 pb-24 md:pb-5">

                        <div className="bg-gray-800 pt-1">
                            <div
                                className="rounded-tl-3xl bg-gradient-to-r from-blue-900 to-gray-800 p-1 shadow text-2xl text-white">
                                <h1 className="font-bold pl-2">Analytics</h1>
                            </div>
                        </div>

                        <div className="flex flex-wrap">
                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div
                                    className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5">
                                    <div className="flex flex-row items-center">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-green-600"><i
                                                className="fa fa-wallet fa-2x fa-inverse"></i></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h2 className="font-bold uppercase text-gray-600">Users with ROLE_ADMIN</h2>
                                            <p className="font-bold text-3xl">{getNumberForRole('ROLE_ADMIN')} <span className="text-green-500"><i
                                                className="fas fa-caret-up"></i></span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div
                                    className="bg-gradient-to-b from-pink-200 to-pink-100 border-b-4 border-pink-500 rounded-lg shadow-xl p-5">
                                    <div className="flex flex-row items-center">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-pink-600"><i
                                                className="fas fa-users fa-2x fa-inverse"></i></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h2 className="font-bold uppercase text-gray-600">Users with ROLE_USER</h2>
                                            <p className="font-bold text-3xl">{getNumberForRole('ROLE_USER')} <span className="text-pink-500"><i
                                                className="fas fa-exchange-alt"></i></span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div
                                    className="bg-gradient-to-b from-yellow-200 to-yellow-100 border-b-4 border-yellow-600 rounded-lg shadow-xl p-5">
                                    <div className="flex flex-row items-center">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-yellow-600"><i
                                                className="fas fa-user-plus fa-2x fa-inverse"></i></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h2 className="font-bold uppercase text-gray-600">Users with ROLE_VALIDATOR</h2>
                                            <p className="font-bold text-3xl">{getNumberForRole('ROLE_VALIDATOR')}<span className="text-yellow-600"><i
                                                className="fas fa-caret-up"></i></span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div
                                    className="bg-gradient-to-b from-blue-200 to-blue-100 border-b-4 border-blue-500 rounded-lg shadow-xl p-5">
                                    <div className="flex flex-row items-center">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-blue-600"><i
                                                className="fas fa-server fa-2x fa-inverse"></i></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h2 className="font-bold uppercase text-gray-600">COUNT NEW STATUS</h2>
                                            <p className="font-bold text-3xl">
                                                {getNumberStatus('NEW')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div
                                    className="bg-gradient-to-b from-indigo-200 to-indigo-100 border-b-4 border-indigo-500 rounded-lg shadow-xl p-5">
                                    <div className="flex flex-row items-center">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-green-800"><i
                                                className="fas fa-tasks fa-2x fa-inverse"></i></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h2 className="font-bold uppercase text-gray-600">COUNT VALIDATED STATUS</h2>
                                            <p className="font-bold text-3xl">
                                                {getNumberStatus('VALIDATED')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div
                                    className="bg-gradient-to-b from-red-200 to-red-100 border-b-4 border-red-500 rounded-lg shadow-xl p-5">
                                    <div className="flex flex-row items-center">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-red-600"><i
                                                className="fas fa-inbox fa-2x fa-inverse"></i></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h2 className="font-bold uppercase text-gray-600">COUNT DELETED STATUS</h2>
                                            <p className="font-bold text-3xl">
                                                {getNumberStatus('DELETED')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-row flex-wrap flex-grow mt-2">

                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div className="bg-white border-transparent rounded-lg shadow-xl">
                                    <div
                                        className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                                        <p className="font-bold uppercase text-gray-600">Tag Progress Percent</p>
                                    </div>
                                    <div className="p-5">
                                        <canvas id="chartjs-7" className="chartjs" width="40px"
                                                height="20px"/>
                                        {completedPercent &&
                                            <div style={{backgroundColor: 'white'}}>
                                                <Liquid {...configLiquid} />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div className="bg-white border-transparent rounded-lg shadow-xl">
                                    <div
                                        className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                                        <h2 className="font-bold uppercase text-gray-600">Count per each document Detail</h2>
                                    </div>
                                    <div className="p-5">
                                        <canvas id="chartjs-0" className="chartjs" width="40px"
                                                height="20px"/>
                                            {dataBar1 && dataBar1.length > 0 && <div style={{backgroundColor: 'white'}}>
                                                    <Bar {...dataConfig1} />
                                                </div>
                                            }
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 xl:w-1/3 p-3">
                                <div className="bg-white border-transparent rounded-lg shadow-xl">
                                    <div
                                        className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                                        <h2 className="font-bold uppercase text-gray-600">Tags per document</h2>
                                    </div>
                                    <div className="p-5">
                                        <canvas id="chartjs-1" className="chartjs" width="40px"
                                                height="20px"/>
                                        {dataLine && dataLine.length > 0 &&
                                            <div style={{backgroundColor: 'white'}}>
                                                <Line data={dataLine} {...configLine} />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default HomeNew
