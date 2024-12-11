import Chart from "react-apexcharts";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ChartStyles = {
  pieColors: ['#023eff', '#ff7c00', '#1ac938', '#e8000b', '#8b2be2'],
  barColor: '#FFB6C1',

  selectStyle: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginBottom: "20px",
    fontSize: "14px",
    backgroundColor: "white"
  }
};

export const titleStyle = {
  width: '80%',
  backgroundColor: '#1F2937',
  color: 'white',
  padding: '15px 20px',
  borderRadius: '15px',
  textAlign: 'center',
  fontSize: '16px',
  margin: '0 auto',
  marginBottom: '60px',
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
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://100.94.142.127:3000/programs/noshowgraph');
        setChartData(response.data.normalizedProgramTypes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="adm_loading">Loading...</div>;
  }

  const pieChartData = {
    series: chartData.map(item => item.노쇼_비율),
    options: {
      chart: { type: "pie" },
      colors: ChartStyles.pieColors,
      labels: chartData.map(item => item.program_name),
      legend: { position: "right" },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: { position: "bottom" }
        }
      }]
    }
  };

  const barChartData = {
    series: [{
      name: "노쇼 인원",
      data: chartData.map(item => parseInt(item.노쇼_인원))
    }],
    options: {
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
        categories: chartData.map(item => item.program_name),
        labels: { 
          rotate: -45,
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        title: {
          text: '노쇼 인원'
        },
        min: 0,
        max: 12,
        tickAmount: 5,
        labels: {
          formatter: function(val) {
            return val.toFixed(0);
          }
        },
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true
        },
        tickValues: [0, 2, 4, 8, 12]
      }
    }
  };

  return (
    <div className="adm_chart_container">
      <h2 style={titleStyle} className="adm_chart_title">
        프로그램 종류별 노쇼 비율과 노쇼 인원 그래프
      </h2>
      <ChartContainer className="adm_pie_chart_container">
        <Chart
          options={pieChartData.options}
          series={pieChartData.series}
          type="pie"
          width="700"
        />
      </ChartContainer>
      <ChartContainer className="adm_bar_chart_container">
        <div style={{ width: "1200px" }}>
          <Chart
            options={barChartData.options}
            series={barChartData.series}
            type="bar"
            height="400"
          />
        </div>
      </ChartContainer>
    </div>
  );
};

export default ChartList;
