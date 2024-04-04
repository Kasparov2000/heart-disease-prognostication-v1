import React, { useEffect, useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {Id} from "../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
interface SeriesData {
    name: string;
    data: { x: number; y: number }[];
}

const ApexChart: React.FC<{patientId: Id<'patients'>}> = ({patientId}) => {
    const fetchedData = useQuery(api.records.getPatientRecords, { patientId });
    const [series, setSeries] = useState<SeriesData[]>([]);

    useEffect(() => {
        if (fetchedData) {
            const riskData = fetchedData.map(record => ({
                x: record._creationTime, // Make sure this is a valid datetime format
                y: record.risk
            }));
            setSeries([{
                name: 'Risk Over Time',
                data: riskData
            }]);
        }
    }, [fetchedData]);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
        },
        title: {
            text: 'Patient Risk Over Time',
            align: 'left'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
            },
        },
        yaxis: {
            title: {
                text: 'Risk Level'
            }
        },
        xaxis: {
            type: 'datetime',
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val) {
                    return val.toFixed(2);
                }
            }
        }
    };

    if (!fetchedData) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="area" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default ApexChart;
