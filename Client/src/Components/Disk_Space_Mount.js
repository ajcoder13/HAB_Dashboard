import { Pie } from "react-chartjs-2"; 
import{
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement,
}from "chart.js";

import { diskMountData } from "../data/Disk_Space_Mount_data";
ChartJS.register(
    Tooltip,  
    Legend,
    ArcElement,
);

const DiskMount= ()=>{
    const options={responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            position: "right",
            labels: {
                font: {
                size: 25
                }
            }
            }
        }
    };
    return<div className="pie"> 
    <Pie className= "pie" options={options} data={diskMountData}/>;
    </div>
}

export default DiskMount;