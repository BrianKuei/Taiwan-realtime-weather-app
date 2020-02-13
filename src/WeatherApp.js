import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { findLocation } from "./utils";
// 從 emotion-theming 中載入 ThemeProvider
import { ThemeProvider } from "emotion-theming";
import sunriseAndSunsetData from "./sunrise-sunset.json";

// components
import WeatherCard from "./WeatherCard";
import WeatherSetting from "./WeatherSetting";

// hooks
import useWeatherApi from "./useWeatherApi";

// 定義主題配色
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc"
  }
};

// 定義帶有 styled 的 compoment
const Container = styled.div`
  /* 在 Styled Component 中可以透過 Props 取得對的顏色 */
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 定義 getMoment 方法
const getMoment = locationName => {
  const location = sunriseAndSunsetData.find(
    data => data.locationName === locationName
  );

  if (!location) return null;

  const now = new Date();
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-"); // 把日期的 / 改為 -

  const locationDate =
    location.time && location.time.find(time => time.dataTime === nowDate);
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night";
};

// 把上面定義好的 styled-component 當成組件使用
const WeatherApp = () => {
  console.log("-----invoke function component-----");
  // 從 localStorage 取出 cityName，並取名為 storageCity
  const storageCity = localStorage.getItem("cityName");

  // 使用 useState 並定義 currentTheme 的預設值為 light
  const [currentTheme, setCurrentTheme] = useState("light");
  // 定義 currentPage 這個 state，預設值是 WeatherCard
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  // 使用 useState 定義當前要拉取天氣資訊的地區，預設值先定為「臺北市」
  // 若 storageCity 存在則作為 currentCity 的預設值，否則使用 '臺北市'
  const [currentCity, setCurrentCity] = useState(storageCity || "臺北市");
  // 根據 currentCity 來找出對應到不同 API 時顯示的地區名稱，找到的地區取名為 locationInfo
  const currentLocation = findLocation(currentCity) || {};

  const [weatherElement, fetchData] = useWeatherApi(currentLocation);

  // 透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies
  // STEP 4：根據日出日落資料的地區名稱，找出對應的日出日落時間
  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [
    currentLocation.sunriseCityName
  ]);

  // STEP 8：現在可以使用 currentLocation 取得地區名稱，因此移除這個多餘的程式碼
  // const { locationName } = weatherElement;

  // 根據 moment 決定要使用亮色或暗色主題
  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
    // 記得把 moment 放入 dependencies 中
  }, [moment]);

  // 當 currentCity 有改變的時候，儲存到 localStorage 中
  useEffect(() => {
    localStorage.setItem("cityName", currentCity);
    // dependencies 中放入 currentCity
  }, [currentCity]);

  return (
    // 把所有會用到主題配色的部分都包在 ThemeProvider 內
    // 透過 theme 這個 props 傳入深色主題
    <ThemeProvider theme={theme[currentTheme]}>
      {/* 把主題配色透過 props 帶入 Container 中 */}
      {/* 把原本寫在 Container 內的 props 移除 */}
      <Container
      // theme={theme.dark}
      >
        {console.log("render")}
        {/* 利用條件渲染的方式決定要呈現哪個組件 */}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            // STEP 6：把縣市名稱傳入 WeatherSetting 中當作表單「地區」欄位的預設值
            cityName={currentLocation.cityName}
            // STEP 7：把 setCurrentCity 傳入，讓 WeatherSetting 可以修改 currentCity
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
