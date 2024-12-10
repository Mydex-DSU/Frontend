import Chart from "react-apexcharts";
import React, { useState } from "react";

const CategoryData = {
  "클리닉": {
    pieData: [20, 12, 5.5, 7.5, 20, 9.5, 10.5, 15],
    barData: [1, 1, 2, 3, 0, 1, 3, 1]
  },
  "경진대회/공모전": {
    pieData: [20, 12, 5.5, 7.5, 20, 9.5, 10.5, 15],
    barData: [5, 10, 2, 8, 0, 6, 3, 1]
  },
  "온라인 비교과 프로그램": {
    pieData: [20, 12, 5.5, 7.5, 20, 9.5, 10.5, 15],
    barData: [5, 1, 2, 8, 4, 7, 3, 9]
  },
  "학습공동체": {
    pieData: [20, 12, 5.5, 7.5, 20, 9.5, 10.5, 15],
    barData: [5, 6, 2, 0, 7, 6, 3, 11]
  },
  "설문 참여": {
    pieData: [20, 12, 5.5, 7.5, 20, 9.5, 10.5, 15],
    barData: [5, 1, 2, 8, 0, 0, 3, 1]
  },
  "캠프 및 워크숍": {
    pieData: [20, 12, 5.5, 7.5, 20, 9.5, 10.5, 15],
    barData: [5, 10, 2, 8, 0, 6, 3, 1]
  },
  "견학": {
    pieData: [20, 12, 5.5, 7.5, 20, 9.5, 10.5, 15],
    barData: [0, 0, 2, 8, 0, 6, 3, 1]
  },
  "특강": {
    pieData: [20, 12, 5.5, 7.5, 20, 9.5, 10.5, 15],
    barData: [5, 11, 2, 0, 0, 3, 3, 1]
  }
};

const PieChartData = {
  labels: [
    "클리닉",
    "경진대회/공모전",
    "온라인 비교과 프로그램",
    "학습공동체",
    "설문 참여",
    "캠프 및 워크숍",
    "견학",
    "특강"
  ]
};

const BarChartData = {
  categories: [
    "건강 문제", "가족 사정", "개인 일정 중복", 
    "예기치 못한 긴급 상황", "프로그램에 대한 관심 부족",
    "참여 가치에 대한 의문", "잘못된 신청", "단순 변심", "기타"
  ]
};

const ChartStyles = {
  pieColors: [
    '#E6E6FA', '#B0E0E6', '#87CEEB', '#ADD8E6',
    '#B0C4DE', '#E6E6FA', '#B0E0E6', '#87CEEB'
  ],
  barColor: '#FFB6C1',
  navStyle: {
    backgroundColor: '#1e3f66',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  containerStyle: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px"
  },
  selectStyle: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginBottom: "20px",
    fontSize: "14px",
    backgroundColor: "white"
  }
};

const PieChartOptions = {
  chart: { type: "pie" },
  colors: ChartStyles.pieColors,
  labels: PieChartData.labels,
  legend: { position: "right" },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: { position: "bottom" }
    }
  }]
};

const BarChartOptions = {
  chart: { type: "bar" },
  colors: [ChartStyles.barColor],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%"
    }
  },
  dataLabels: { 
    enabled: true,
    style: {
      fontSize: '12px'
    }
  },
  xaxis: {
    categories: BarChartData.categories,
    labels: { 
      rotate: -45,
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    min: 0,
    max: 12,
    tickAmount: 4,
    labels: {
      formatter: (val) => Math.round(val)
    }
  }
};

const ChartContainer = ({ children, className }) => (
  <div className={className} style={{
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "3rem"
  }}>
    {children}
  </div>
);

const ChartList = () => {
  const [selectedCategory, setSelectedCategory] = useState("클리닉");

  return (
    <div style={ChartStyles.containerStyle}>
      <nav style={ChartStyles.navStyle}>
        <h2 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 'normal'
        }}>
          프로그램 종류별 노쇼 비율과 노쇼 이유 그래프
        </h2>
      </nav>
      <ChartContainer className="pie-chart-container">
        <Chart
          options={PieChartOptions}
          series={CategoryData[selectedCategory].pieData}
          type="pie"
          width="700"
        />
      </ChartContainer>
      <div style={{ textAlign: "right" }}>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={ChartStyles.selectStyle}
        >
          {Object.keys(CategoryData).map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <ChartContainer className="bar-chart-container">
        <div style={{ width: "1200px" }}>
          <Chart
            options={BarChartOptions}
            series={[{
              name: "응답수",
              data: CategoryData[selectedCategory].barData
            }]}
            type="bar"
            height="400"
          />
        </div>
      </ChartContainer>
    </div>
  );
};

export default ChartList;