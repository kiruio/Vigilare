import { Alert } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      <div className="all" style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              tickCount={chartData.length}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, '可用率']}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1890ff"
              strokeWidth={2}
              dot={{ fill: '#1890ff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SiteCharts;
