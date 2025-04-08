import { Alert } from "antd";
import { Line, LineConfig } from "@ant-design/plots";

interface SiteDetails {
  status: string;
  average: number;
  daily: Array<{
    uptime: number;
    date: any;
  }>;
}

const SiteCharts = ({ siteDetails }: { siteDetails: SiteDetails }) => {
  // 处理传入数据为图表
  const dailyData = siteDetails.daily;
  const chartData = [...dailyData].reverse().map((data) => {
    const { uptime, date } = data;
    return {
      time: date.format("YYYY-MM-DD"),
      value: uptime,
    };
  });

  // 图标配置
  const chartConfig: LineConfig = {
    data: chartData,
    padding: "auto",
    xField: "time",
    yField: "value",
    meta: {
      value: {
        alias: "当日可用率",
        formatter: (v: number) => `${v}%`,
      },
    },
    xAxis: {
      tickCount: chartData.length,
    },
    smooth: true,
  };

  return (
    <div className="site-details">
      {siteDetails.status !== "ok" ? (
        siteDetails.average >= 70 ? (
          <Alert
            message="当前站点出现异常，请检查站点状态"
            type="warning"
            showIcon
          />
        ) : (
          <Alert
            message="当前站点持续异常，请立即处理"
            type="error"
            showIcon
          />
        )
      ) : (
        <Alert
          message="当前站点状态正常，请继续保持哦"
          type="success"
          showIcon
        />
      )}
      <div className="all">
        <Line {...chartConfig} />
      </div>
    </div>
  );
};

export default SiteCharts;
