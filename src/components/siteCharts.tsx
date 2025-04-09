import Alert from 'antd/es/alert';
import 'antd/es/alert/style';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

interface SiteDetails {
	status: string;
	average: number;
	daily: Array<{
		uptime: number;
		date: any;
	}>;
}

// 合并阈值
const MERGE_THRESHOLD = 5;

const SiteCharts = ({ siteDetails }: { siteDetails: SiteDetails }) => {
	const processData = (daily: SiteDetails['daily']) => {
		if (!daily || daily.length === 0) return [];

		const sorted = [...daily]
			.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
			.map((d) => ({
				...d,
				uptime: Number(d.uptime),
			}));

		// 检测是否全同值
		const isUniform = sorted.every((d) => d.uptime === sorted[0].uptime);

		// 全同值特殊处理：至少保留首尾两个点
		if (isUniform && sorted.length >= 2) {
			return [
				{
					time: dayjs(sorted[0].date).format('YYYY-MM-DD'),
					value: sorted[0].uptime,
					isEdge: true,
				},
				{
					time: dayjs(sorted[sorted.length - 1].date).format('YYYY-MM-DD'),
					value: sorted[0].uptime,
					isEdge: true,
				},
			];
		}

		const merged = [];
		let current = {
			start: sorted[0].date,
			end: sorted[0].date,
			value: Number(sorted[0].uptime), // 显式转换为数字
			count: 1,
		};

		for (let i = 1; i < sorted.length; i++) {
			const currentValue = Number(sorted[i].uptime); // 类型安全转换
			const diff = Math.abs(currentValue - current.value);

			if (diff < MERGE_THRESHOLD && merged.length < sorted.length / 3) {
				current.end = sorted[i].date;
				current.value =
					(current.value * current.count + currentValue) / (current.count + 1);
				current.count++;
			} else {
				merged.push({
					time: dayjs(current.start).format('YYYY-MM-DD'),
					displayTime: getDisplayLabel(current.start, current.end),
					value: parseFloat(current.value.toFixed(1)), // 确保数字类型
					span: current.count,
				});
				current = {
					start: sorted[i].date,
					end: sorted[i].date,
					value: currentValue,
					count: 1,
				};
			}
		}

		// 处理最后一个数据点
		if (current.count > 0) {
			merged.push({
				time: dayjs(current.start).format('YYYY-MM-DD'),
				displayTime: getDisplayLabel(current.start, current.end),
				value: parseFloat(current.value.toFixed(1)),
				span: current.count,
			});
		}

		return merged;
	};

	// 生成智能时间标签
	const getDisplayLabel = (start: any, end: any) => {
		const startDay = dayjs(start);
		const endDay = dayjs(end);

		if (startDay.isSame(endDay, 'day')) {
			return startDay.format('MM/DD');
		}

		const diffDays = endDay.diff(startDay, 'day');
		if (diffDays < 7) {
			return `${startDay.format('MM/DD')}~${endDay.format('DD')}`;
		}

		return `${startDay.format('MM/DD')}~${endDay.format('MM/DD')}`;
	};

	const chartData = processData(siteDetails.daily);

	// 自定义数据点
	const CustomDot = (props: any) => {
		const { cx, cy, payload } = props;
		if (payload?.isEdge) {
			return <circle cx={cx} cy={cy} r={6} fill="#1890ff" stroke="#fff" strokeWidth={2} />;
		}
		return null;
	};

	return (
		<div className="site-details">
			{siteDetails.status !== 'ok' ? (
				siteDetails.average >= 70 ? (
					<Alert message="当前站点出现异常，请检查站点状态" type="warning" showIcon />
				) : (
					<Alert message="当前站点持续异常，请立即处理" type="error" showIcon />
				)
			) : (
				<Alert message="当前站点状态正常，请继续保持哦" type="success" showIcon />
			)}
			<div className="all" style={{ height: 400 }}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="time"
							tick={{ fontSize: 12 }}
							tickCount={Math.min(chartData.length, 10)}
						/>
						<YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
						<Tooltip
							formatter={(value: number) => [`${value}%`, '可用率']}
							labelFormatter={(label) => `日期: ${label}`}
						/>
						<Line
							type="monotone"
							dataKey="value"
							stroke="#1890ff"
							strokeWidth={2}
							dot={<CustomDot />}
							activeDot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default SiteCharts;
