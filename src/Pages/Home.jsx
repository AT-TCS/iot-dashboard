/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import { InfluxDB } from "@influxdata/influxdb-client-browser";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#f542ef",
  "#8884d8",
  "#82ca9d",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
];

const token = import.meta.env.VITE_INFLUXDB_TOKEN;
const url = import.meta.env.VITE_INFLUX_DB_URL;
const org = import.meta.env.VITE_ORG;

let query = `from(bucket: "machineData")
|> range(start: 2021-08-01T00:00:00.000Z, stop: 2021-08-01T01:00:00.000Z)
|> unique()
|> filter(fn: (r) => r["_field"] == "oil_temp")
|> filter(fn: (r) => r._value > 41.5 and r._value < 41.8)
|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
|> yield(name: "results")`;

const canData = [
  {
    count: 391,
    id: "183",
  },
  {
    count: 390,
    id: "191",
  },
  {
    count: 390,
    id: "18E",
  },
  {
    count: 390,
    id: "17C",
  },
  {
    count: 390,
    id: "166",
  },
];

// Sample data
const sampleData = [
  {
    timeStamp: "1451624400",
    overallKw: 0.932833333,
    furnace: 0.0207,
    homeOffice: 0.442633333,
    fridge: 0.12415,
    wineCellar: 0.006983333,
  },
  {
    timeStamp: "1451624401",
    overallKw: 0.934333333,
    furnace: 0.020716667,
    homeOffice: 0.444066667,
    fridge: 0.124,
    wineCellar: 0.006983333,
  },
  {
    timeStamp: "1451624402",
    overallKw: 0.931816667,
    furnace: 0.0207,
    homeOffice: 0.442633333,
    fridge: 0.12415,
    wineCellar: 0.006983333,
  },
  {
    timeStamp: "1451624400",
    overallKw: 0.932833333,
    furnace: 0.0207,
    homeOffice: 0.442633333,
    fridge: 0.12415,
    wineCellar: 0.006983333,
  },
  {
    timeStamp: "1451624400",
    overallKw: 0.932833333,
    furnace: 0.0207,
    homeOffice: 0.446066667,
    fridge: 0.123533333,
    wineCellar: 0.006983333,
  },
];

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let res = [];
    const influxQuery = async () => {
      //create InfluxDB client
      const queryApi = await new InfluxDB({ url, token }).getQueryApi(org);
      //make query
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          //push rows from query into an array object
          res.push(o);
          console.log(res);
        },
        complete() {
          let finalData = [];

          for (let i = 0; i < res.length; i++) {
            let point = {};
            point["oil_temp"] = res[i]["oil_temp"];
            point["station_id"] = res[i]["stationID"];

            point["name"] = res[i]["_time"];
            finalData.push(point);
          }
          setData(finalData);
        },
        error(error) {
          console.error("query failed- ", error);
        },
      });
    };
    influxQuery();
  }, []);

  return (
    <div>
      <Outlet />
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" domain={["dataMin", "dataMax"]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="oil_temp"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="station_id" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={730} height={400}>
          <Pie
            data={canData}
            color="#000000"
            dataKey="count"
            nameKey="id"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
          >
            {canData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            // eslint-disable-next-line no-unused-vars
            payload={canData.map((item, index) => ({
              id: item.name,
              type: "square",
              value: ` ID: ${item.id} (${item.count})`,
              color: COLORS[index % COLORS.length],
            }))}
          />
        </PieChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart width={500} height={500} data={sampleData}>
          <CartesianGrid />
          <XAxis dataKey="timeStamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="overallKw" stackId="a" fill="aqua" />
          <Bar dataKey="furnace" stackId="a" fill="green" />
          <Bar dataKey="homeOffice" stackId="a" fill="blue" />
          <Bar dataKey="fridge" stackId="a" fill="red" />
          <Bar dataKey="wineCellar" stackId="a" fill="orange" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Home;
