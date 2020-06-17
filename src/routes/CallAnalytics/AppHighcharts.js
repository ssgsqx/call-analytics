import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default class AppHighcharts extends Component {
  render() {
    const options = {
      chart: {
        zoomType: "x"
      },
      xAxis: {
        categories: [0, 1, 2, 3] // x 轴分类
      },
      yAxis: {
        title: {
          text: "吃水果个数" // y 轴标题
        },
        labels: {
          formatter: function() {
            return Math.abs(this.value) + "kbps";
          }
        }
      },
      tooltip: {
        shared: true,
        crosshairs: [
          {
            width: 1,
            color: "#000"
          }
        ]
      },
      series: [
        {
          type: "areaspline",
          name: "小明",
          data: [2, 8, 10, 12, 14, 10, 6, 4],
          marker: {
            enabled: false
          }
        },
        {
          type: "areaspline",
          name: "小红",
          data: [0, 0, -15, -13, -10, -8, -6, -4],
          marker: {
            enabled: false
          }
        },
        {
          type: "column",
          color: "red",
          pointWidth: 1,
          borderWidth: 0,
          data: [30, 20, 10, 30, 40]
        }
      ]
    };
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}
