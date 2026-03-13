// import { AnalyticsDaily } from "../../models/external/analyticsDailyMetric.model";;
// import { Parser} from "json2csv";
// import fs from "fs";

// export const generateReport = async (type:string)=> {
//     let data;
//     if(type === 'daily') {
//         data = await AnalyticsDaily.findAll({
//             order: [["date","DECS"]],
//             limit: 1
//         })
//     };
//     if(type === 'monthly') {
//         data = await AnalyticsDaily.findAll();
//     }
//     const json= data?.map(d => d.toJSON());
//     const parser = new Parser();
//     const csv = parser.parser(json);

//     fs.writeFileSync('reports/${type}-report.csv',csv)
// }
