/*global kakao */
import logo from "./logo.svg";
import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [nocity, godcity] = useState("경기도"); // 디폴트 경기도
  const [x, setX] = useState("60");
  const [y, setY] = useState("120");
  const pooint = [
    {
      title: "경기도",
      latlng: { lat: 37.31096444809728, lng: 127.23198733885845 },
      nx: "60",
      ny: "120",
    },
    {
      title: "충청북도",
      latlng: { lat: 36.74654309136078, lng: 127.58741845637883 },
      nx: "69",
      ny: "107",
    },
    {
      title: "강원도",
      latlng: { lat: 37.645933830677485, lng: 128.04539694005823 },
      nx: "73",
      ny: "134",
    },
    {
      title: "충청남도",
      latlng: { lat: 36.11333559633568, lng: 126.65591920408467 },
      nx: "68",
      ny: "100",
    },
    {
      title: "전라북도",
      latlng: { lat: 35.592123864623765, lng: 126.9658242574819 },
      nx: "63",
      ny: "89",
    },
    {
      title: "전라남도",
      latlng: { lat: 34.75716125432132, lng: 126.68067179730738 },
      nx: "51",
      ny: "67",
    },
    {
      title: "경상북도",
      latlng: { lat: 36.32791290935054, lng: 128.31260812214916 },
      nx: "89",
      ny: "91",
    },
    {
      title: "경상남도",
      latlng: { lat: 35.4351418518771, lng: 128.22446726047716 },
      nx: "91",
      ny: "77",
    },
    {
      title: "제주도",
      latlng: { lat: 33.29484047688928, lng: 126.57319988311639 },
      nx: "52",
      ny: "38",
    },
  ];

  //현재날짜
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  let day = currentDate.getDate().toString().padStart(2, "0");

  //어제날짜
  currentDate.setDate(currentDate.getDate() - 1);

  const year1 = currentDate.getFullYear();
  let month1 = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  let day1 = currentDate.getDate().toString().padStart(2, "0");

  const today = `${year}${month}${day}`;
  const yesterday = `${year1}${month1}${day1}`;
  // console.log(today, yesterday)

  const dates = [today, yesterday];
  const [basedate, setBasedate] = useState(today);

  // const dates = [20230522, 20230521];
  // const [basedate, setBasedate] = useState(dates[0]);

  return (
    <div className="App">
      <p className="App-title"> &#127774; 지역별 날씨 조회 &#127773;</p>
      <div className="App-container">
        <div className="map-wrap">
          <p className="map-title">지역을 선택해주세요</p>
          {/* {카카오 지도} */}
          <Map
            center={{ lat: 36.41086146557149, lng: 128.15904580733408 }}
            className="App-map"
            level={13}
          >
            {pooint.map((value) => (
              <MapMarker
                key={value.id}
                position={value.latlng}
                image={{
                  src: "https://cdn.icon-icons.com/icons2/1283/PNG/512/1497620001-jd22_85165.png",

                  size: {
                    width: 64,
                    height: 69,
                  }, // 마커이미지의 크기입니다
                }}
                onClick={() => {
                  godcity(value.title); // 클릭시 title(지역이름)을  useState 담아두기용
                  setX(value.nx); // 클릭시 nx 값
                  setY(value.ny); // 클릭시 nx 값 
                }}
              />
            ))}
          </Map>
        </div>

        <div className="option-wrap">
          <div className="graph-box-wrap">
            {/* 날짜선택하기 */}
            <p className="option-title">날짜를 선택해주세요</p>
            <select
              className="App-option"
              onChange={(e) => setBasedate(e.target.value)}
            >
              {dates.map((basedate) => (
                <option key={basedate} value={basedate}>
                  {basedate}
                </option>
              ))}
            </select>
          </div>
          {/* 데이터 뿌려주기 및 그래프에 데이터 연동 */}
          <div>
            <Scve city={nocity} x={x} y={y} date={basedate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

// API 호출

function fetchData(date, x, y) {
  const endPoint =
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
  const serviceKey =
    "5Bv6N%2BosDOj0RG5h3bjWtkOGx33jnHlW7QjqX8RdyOJUPuDz0xbYFoLyQcDF1W95l1Aqie7JXN9Vup5mFONg%2FQ%3D%3D";
  const pageNo = 1;
  const numOfRows = 1000;
  const type = "JSON";
  // const basedate = 20230522;
  const basetime = "0200"; // 0부터 시작하면 "" 안챙기면 에러 뱉음

  const promise = fetch(
    `${endPoint}?serviceKey=${serviceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${type}&base_date=${date}&base_time=${basetime}&nx=${x}&ny=${y}`
  ).then((res) => {
    // 서버의 응답코드(status)가 200(성공)이 아닌 경우 catch 블록에 응답 객체를 던진다
    if (!res.ok) {
      throw res;
    }
    // 서버의 응답코드가 200인 경우 응답객체(프로미스 객체)를 리턴한다
    return res.json();
  });

  return promise;
}

// 호출된 데이터 불러오기
const Scve = ({ x, y, city, date }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData(date, x, y)
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [date, x, y]);

  if (!data) {
    return (
      <p className="load">
        데이터 불러오는중 입니다. <br /> 잠시만 기다려주세요.
      </p>
    );
  }

  // GPT 도움으로 그래프 데이터 연동
  const gpt = [
    {
      name: "3시",
      온도: data.response.body.items.item[0].fcstValue,
      습도: data.response.body.items.item[10].fcstValue,
      강수확률: data.response.body.items.item[8].fcstValue
    },
    {
      name: "6시",
      온도: data.response.body.items.item[36].fcstValue,
      습도: data.response.body.items.item[46].fcstValue,
      강수확률: data.response.body.items.item[44].fcstValue
    },
    {
      name: "9시",
      온도: data.response.body.items.item[73].fcstValue,
      습도: data.response.body.items.item[83].fcstValue,
      강수확률: data.response.body.items.item[81].fcstValue
    },
    {
      name: "12시",
      온도: data.response.body.items.item[109].fcstValue,
      습도: data.response.body.items.item[119].fcstValue,
      강수확률: data.response.body.items.item[117].fcstValue
    },
    {
      name: "15시",
      온도: data.response.body.items.item[145].fcstValue,
      습도: data.response.body.items.item[155].fcstValue,
      강수확률: data.response.body.items.item[153].fcstValue
    },
    {
      name: "18시",
      온도: data.response.body.items.item[182].fcstValue,
      습도: data.response.body.items.item[192].fcstValue,
      강수확률: data.response.body.items.item[190].fcstValue
    },
    {
      name: "21시",
      온도: data.response.body.items.item[218].fcstValue,
      습도: data.response.body.items.item[128].fcstValue,
      강수확률: data.response.body.items.item[126].fcstValue
    },
    {
      name: "24시",
      온도: data.response.body.items.item[254].fcstValue,
      습도: data.response.body.items.item[264].fcstValue,
      강수확률: data.response.body.items.item[262].fcstValue
    },
  ];

  return (
    <nav className="App-graph">
      <div className="graph-city">
        <p className="graph-city-title">{city}</p>
        <p>지역 날씨</p>
      </div>

      <div className="graph-box-wrap">
        <FcstValue weathers={data.response.body.items} />
        <div className="graph-box">
          {/* gpt데이터를 가진 그래프에 전달하기*/}
          <PureComponent gpt={gpt} />
        </div>
      </div>
    </nav>
  );
};

function FcstValue({ weathers }) {
  return (
    <ul className="graph-text-box">
      <li className="text-box">
        <p className="time">시간</p>
        <p className="red">온도</p>
        <p className="blue">습도</p>
        <p className="gray">강수확률</p>
      </li>
      <li className="text-box">
        <p className="time">3시</p>
        <p className="red">{weathers.item[0].fcstValue}°C</p>
        <p className="blue">{weathers.item[10].fcstValue}%</p>
        <p className="gray">{weathers.item[8].fcstValue}%</p>
      </li>
      <li className="text-box">
        <p className="time">6시</p>
        <p className="red">{weathers.item[36].fcstValue}°C</p>
        <p className="blue">{weathers.item[46].fcstValue}%</p>
        <p className="gray">{weathers.item[44].fcstValue}%</p>
      </li>
      <li className="text-box">
        <p className="time">9시</p>
        <p className="red">{weathers.item[73].fcstValue}°C</p>
        <p className="blue">{weathers.item[83].fcstValue}%</p>
        <p className="gray">{weathers.item[81].fcstValue}%</p>
      </li>
      <li className="text-box">
        <p className="time">12시</p>
        <p className="red">{weathers.item[109].fcstValue}°C</p>
        <p className="blue">{weathers.item[119].fcstValue}%</p>
        <p className="gray">{weathers.item[117].fcstValue}%</p>
      </li>
      <li className="text-box">
        <p className="time">15시</p>
        <p className="red">{weathers.item[145].fcstValue}°C</p>
        <p className="blue">{weathers.item[155].fcstValue}%</p>
        <p className="gray">{weathers.item[153].fcstValue}%</p>
      </li>
      <li className="text-box">
        <p className="time">18시</p>
        <p className="red">{weathers.item[182].fcstValue}°C</p>
        <p className="blue">{weathers.item[192].fcstValue}%</p>
        <p className="gray">{weathers.item[190].fcstValue}%</p>
      </li>
      <li className="text-box">
        <p className="time">21시</p>
        <p className="red">{weathers.item[218].fcstValue}°C</p>
        <p className="blue">{weathers.item[228].fcstValue}%</p>
        <p className="gray">{weathers.item[226].fcstValue}%</p>
      </li>
      <li className="text-box">
        <p className="time">21시</p>
        <p className="red">{weathers.item[254].fcstValue}°C</p>
        <p className="blue">{weathers.item[264].fcstValue}%</p>
        <p className="gray">{weathers.item[262].fcstValue}%</p>
      </li>
    </ul>
  );
}

// 그래프 함수
export function PureComponent({ gpt }) {
  const formatYAxisTick = (value) => Math.min(value, 100); // 강수확률은 최대 100을 넘으면 안되기에 고정 처리
  return (
    <div>
      <h4>기온</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          width={400}
          height={200}
          data={gpt}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="온도"
            stroke="#e45b5b"
            fill="#e45b5b"
          />
        </LineChart>
      </ResponsiveContainer>

      <h4>습도</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          width={400}
          height={200}
          data={gpt}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          {/* 데이터 불어올시 최대값을 표기하여 4% 이면 4가 최대라서 비가 올 오해소지가 생겨 100으로 고정하기 위해 별도 설정 */}
          <YAxis tickFormatter={formatYAxisTick} domain={[0, 100]} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="습도"
            stroke="#6363ff"
            fill="#6363ff"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}