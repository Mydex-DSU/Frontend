import Chart from "react-apexcharts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

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

const ChartContainer = ({ children, style }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "3rem",
      width: "100%",
      ...style
    }}
  >
    {children}
  </div>
);

const ChartWithTextContainer = ({ chart, text }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "3rem",
      width: "90%",
      maxWidth: "1200px",
      margin: "0 auto",
      gap: "5px"
    }}
  >
    <div style={{ flex: 2 }}>
      {chart}
    </div>
    <div
      className="adm_noshow-detail-page-text"
      style={{
        flex: 1,
        paddingLeft: "10px",
        fontSize: "14px",
        lineHeight: "1.6",
        color: "#333",
        maxWidth: "300px",
        textAlign: "left"
      }}
    >
      {text}
    </div>
  </div>
);

const ChartList = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const programId = location.state?.programId;

  useEffect(() => {
    const fetchData = async () => {
      if (!programId) {
        setError("프로그램 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post("http://100.94.142.127:3000/programs/noshowgraph/detail", {
          program_id: programId
        });
        
        if (!response.data || !response.data.noshowGraph || !response.data.noshowGraph.programData) {
          throw new Error("서버에서 올바른 데이터를 받지 못했습니다.");
        }
        
        setChartData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  if (loading) {
    return <div className="adm_loading">데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="adm_error">오류: {error}</div>;
  }

  if (!chartData || !chartData.noshowGraph || !chartData.noshowGraph.programData) {
    return <div>프로그램 정보를 찾을 수 없습니다.</div>;
  }

  const pieChartData = {
    series: [chartData.noshowGraph.노쇼_비율, chartData.noshowGraph.노쇼_아닌_비율],
    options: {
      chart: { type: "pie" },
      colors: ChartStyles.pieColors,
      labels: ['노쇼', '참석'],
      legend: { position: "right" },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: { position: "bottom" }
          }
        }
      ]
    }
  };

  const barChartData = {
    series: [{
      name: "노쇼 이유",
      data: chartData.filledReasons.map(reason => reason.횟수)
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
          fontSize: "12px"
        }
      },
      xaxis: {
        categories: chartData.filledReasons.map(reason => reason.노쇼_이유),
        labels: {
          rotate: -45,
          style: {
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        title: {
          text: "횟수"
        },
        min: 0,
        max: Math.max(...chartData.filledReasons.map(reason => reason.횟수)) + 1,
        tickAmount: 5,
        labels: {
          formatter: function (val) {
            return val.toFixed(0);
          }
        }
      }
    }
  };

  const description = (
    <>
      <h2>프로그램 이름</h2>
      <span>{chartData.noshowGraph.programData.program_name}</span>

      <h2>프로그램 내용</h2>
      <span>{chartData.noshowGraph.programData.program_description}</span>

      <h2>신청일시</h2>
      <span>{new Date(chartData.noshowGraph.programData.program_application_start_time).toLocaleString()} ~ {new Date(chartData.noshowGraph.programData.program_application_end_time).toLocaleString()}</span>

      <h2>운영일시</h2>
      <span>{new Date(chartData.noshowGraph.programData.program_operation_start_time).toLocaleString()} ~ {new Date(chartData.noshowGraph.programData.program_operation_end_time).toLocaleString()}</span>

      <h2>설문조사기간</h2>
      <span>{new Date(chartData.noshowGraph.programData.program_survey_start_time).toLocaleString()} ~ {new Date(chartData.noshowGraph.programData.program_survey_end_time).toLocaleString()}</span>

      <h2>Mydex 온도 포인트</h2>
      <span>{chartData.noshowGraph.programData.program_mydex_points}점</span>

      <h2>프로그램 신청 인원</h2>
      <span>{chartData.noshowGraph.programData.program_max_participants}</span>

      <h2>프로그램 종류</h2>
      <span>{chartData.noshowGraph.programData.programtype_name}</span>
    </>
  );

  return (
    <div className="adm_chart_container">
      <h2 style={titleStyle} className="adm_chart_title">
        {chartData.noshowGraph.programData.program_name}
      </h2>
      <ChartWithTextContainer
        chart={
          <Chart
            options={pieChartData.options}
            series={pieChartData.series}
            type="pie"
            width="600"
          />
        }
        text={description}
      />
      <h2 style={titleStyle} className="adm_chart_title">
        {chartData.noshowGraph.programData.program_name} 노쇼 비율 - 노쇼 사유 그래프
      </h2>
      
      <ChartContainer
        className="adm_bar_chart_container"
        style={{ justifyContent: "center" }}
      >
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
