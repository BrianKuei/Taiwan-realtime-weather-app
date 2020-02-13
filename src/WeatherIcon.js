import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";

import { ReactComponent as DayThunderstorm } from "./images/day-thunderstorm.svg";
import { ReactComponent as DayClear } from "./images/day-clear.svg";
import { ReactComponent as DayCloudyFog } from "./images/day-cloudy-fog.svg";
import { ReactComponent as DayCloudy } from "./images/day-cloudy.svg";
import { ReactComponent as DayFog } from "./images/day-fog.svg";
import { ReactComponent as DayPartiallyClearWithRain } from "./images/day-partially-clear-with-rain.svg";
import { ReactComponent as DaySnowing } from "./images/day-snowing.svg";
import { ReactComponent as NightThunderstorm } from "./images/night-thunderstorm.svg";
import { ReactComponent as NightClear } from "./images/night-clear.svg";
import { ReactComponent as NightCloudyFog } from "./images/night-cloudy-fog.svg";
import { ReactComponent as NightCloudy } from "./images/night-cloudy.svg";
import { ReactComponent as NightFog } from "./images/night-fog.svg";
import { ReactComponent as NightPartiallyClearWithRain } from "./images/night-partially-clear-with-rain.svg";
import { ReactComponent as NightSnowing } from "./images/night-snowing.svg";

// 定義 react component 的 css
const IconContainer = styled.div`
  flex-basis: 30%;
  svg {
    max-height: 110px;
  }
`;

// 天氣代碼對應天氣型態
const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    19,
    20,
    29,
    30,
    31,
    32,
    38,
    39
  ],
  isSnowing: [23, 37, 42]
};

// 分類早上晚上不同天氣的 icon
const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />
  }
};

// 使用迴圈來找出該天氣代碼對應到的天氣型態
const weatherCode2Type = weatherCode =>
  Object.entries(weatherTypes).reduce(
    (currentWeatherType, [weatherType, weatherCodes]) =>
      weatherCodes.includes(Number(weatherCode))
        ? weatherType
        : currentWeatherType,
    ""
  );

// 使用解構賦值將所需的資料從 props 取出
const WeatherIcon = ({ currentWeatherCodeProp, moment }) => {
  // 透過 useState 定義當前使用的圖示名稱，預設值設為 `isClear`
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState("isClear");

  // 透過 useMemo 保存計算結果，記得要在 dependencies 中放入 currentWeatherCode
  const theWeatherIcon = useMemo(
    () => weatherCode2Type(currentWeatherCodeProp),
    [currentWeatherCodeProp]
  );

  useEffect(() => {
    setCurrentWeatherIcon(theWeatherIcon);
  }, [theWeatherIcon]);

  return (
    // 從 weatherIcons 中找出對應的圖示
    <IconContainer>{weatherIcons[moment][currentWeatherIcon]}</IconContainer>
  );
};

export default WeatherIcon;