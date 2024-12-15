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
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgramType, setSelectedProgramType] = useState();
  const [programTypes, setProgramTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pieResponse = await axios.get('http://100.94.142.127:3000/programs/noshowgraph');
        console.log(pieResponse.data)
        setPieChartData(pieResponse.data.normalizedProgramTypes);
        setProgramTypes(pieResponse.data.normalizedProgramTypes.map(item => ({
          id: item.programtype_id,
          name: item.program_name
        })));

        await fetchBarChartData(1);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBarChartData = async (programTypeId) => {
    try {
      console.log('Sending programtype_id:', programTypeId); // 로그 추가
      const barResponse = await axios.post('http://100.94.142.127:3000/programs/noshowstickgraph', {
        programtype_id: programTypeId
      });
      setBarChartData(barResponse.data.program_name);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };
  

  const handleProgramTypeChange = (event) => {
    console.log('Selected value:', event.target.value);
    const selectedId = event.target.value
    console.log("Here : " + selectedId)
    const newProgramTypeId = parseInt(event.target.value, 10);
    console.log('Selected value2:',newProgramTypeId);
    setSelectedProgramType(newProgramTypeId);
    fetchBarChartData(newProgramTypeId);
  };
  console.log(programTypes); // programTypes 배열 로그

  

  if (loading) {
    return <div className="adm_loading">Loading...</div>;
  }

  const pieChartOptions = {
    series: pieChartData.map(item => item.노쇼_비율),
    options: {
      chart: { type: "pie" },
      colors: ChartStyles.pieColors,
      labels: pieChartData.map(item => item.program_name),
      legend: { position: "right" },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: { position: "bottom" }
        }
      }]
    }
  };

  const barChartOptions = {
    series: [{
      name: "노쇼 인원",
      data: barChartData.map(item => item.selected_count)
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
        categories: barChartData.map(item => item.noshowreasoncategories_name),
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
        max: Math.max(...barChartData.map(item => item.selected_count)) + 1,
        tickAmount: 4,
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
        }
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
          options={pieChartOptions.options}
          series={pieChartOptions.series}
          type="pie"
          width="700"
        />
      </ChartContainer>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '200px', marginBottom: '20px' }}>
        <select
          value={selectedProgramType}
          onChange={handleProgramTypeChange}
          style={ChartStyles.selectStyle}
        >
          {programTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <ChartContainer className="adm_bar_chart_container">
        <div style={{ width: "1200px" }}>
          <Chart
            options={barChartOptions.options}
            series={barChartOptions.series}
            type="bar"
            height="400"
          />
        </div>
      </ChartContainer>
    </div>
  );
};

export default ChartList;
