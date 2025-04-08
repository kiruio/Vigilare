import axios from "axios";
import dayjs from "dayjs";
import { useCacheStore } from "../stores/cache";
import { useStatusStore } from "../stores/status";
import { formatNumber } from "./timeTools";

// 定义类型
interface MonitorData {
  id: string;
  friendly_name: string;
  url: string;
  status: number;
  logs: any[];
  custom_uptime_ranges: string;
}

interface ProcessedData {
  id: string;
  name: string;
  url: string;
  average: string;
  daily: any[];
  total: any;
  status: string;
}

export const getSiteData = async (apikey: string, days: number) => {
  const { changeSiteData, siteData } = useCacheStore.getState();
  const { changeSiteState, changeSiteOverview } = useStatusStore.getState();

  try {
    changeSiteState("loading");
    
    const dates = Array.from({ length: days }, (_, d) => 
      dayjs().startOf('day').subtract(d, "day")
    );

    const ranges = dates.map(date => 
      `${date.unix()}_${date.add(1, "day").unix()}`
    );
    const [start, end] = [dates[dates.length - 1].unix(), dates[0].add(1, "day").unix()];
    ranges.push(`${start}_${end}`);

    // 缓存检查逻辑
    const cacheDuration = 60 * 1000; // 60秒
    if (siteData?.data && Date.now() - siteData.timestamp < cacheDuration) {
      return new Promise<ProcessedData[]>((resolve) => {
        setTimeout(() => {
          const processed = dataProcessing(siteData.data, dates);
          updateSiteStatus(processed);
          resolve(processed);
        }, Math.random() * 700 + 500);
      });
    }

    // API请求
    const response = await axios.post(import.meta.env.VITE_GLOBAL_API, {
      api_key: apikey,
      format: "json",
      logs: 1,
      log_types: "1-2",
      logs_start_date: start,
      logs_end_date: end,
      custom_uptime_ranges: ranges.join("-"),
    }, { timeout: 10000 });

    // 更新缓存
    if (response.data?.monitors) {
      changeSiteData({
        data: response.data.monitors,
        timestamp: Date.now()
      });
    }

    const processed = dataProcessing(response.data.monitors, dates);
    updateSiteStatus(processed);
    return processed;
  } catch (error) {
    console.error("获取数据失败:", error);
    changeSiteState("wrong");
    throw error;
  }
};

const dataProcessing = (monitors: MonitorData[], dates: dayjs.Dayjs[]): ProcessedData[] => {
  return monitors?.map(monitor => {
    const ranges = monitor.custom_uptime_ranges.split("-");
    const average = formatNumber(parseFloat(ranges.pop() || "0"));
    const dailyMap = new Map<string, number>();

    const daily = dates.map(date => ({
      date,
      uptime: formatNumber(parseFloat(ranges[dates.length - 1 - date.diff(dates[0], 'day')] || "0")),
      down: { times: 0, duration: 0 }
    }));

    const total = monitor.logs.reduce((acc, log) => {
      if (log.type === 1) {
        const dateKey = dayjs.unix(log.datetime).format("YYYYMMDD");
        const index = dates.findIndex(d => d.format("YYYYMMDD") === dateKey);
        if (index >= 0) {
          daily[index].down.times += 1;
          daily[index].down.duration += log.duration;
          acc.times += 1;
          acc.duration += log.duration;
        }
      }
      return acc;
    }, { times: 0, duration: 0 });

    return {
      id: monitor.id,
      name: monitor.friendly_name,
      url: monitor.url,
      average,
      daily,
      total,
      status: monitor.status === 2 ? "ok" : monitor.status === 9 ? "down" : "unknown"
    };
  }) || [];
};

// 状态更新函数
const updateSiteStatus = (data: ProcessedData[]) => {
  const { changeSiteState, changeSiteOverview } = useStatusStore.getState();
  
  try {
    const okCount = data.filter(d => d.status === "ok").length;
    const downCount = data.length - okCount;
    const isAllOk = okCount === data.length;
    const hasAnyOk = okCount > 0;

    // 更新favicon
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
    if (favicon) {
      favicon.href = isAllOk ? "./images/favicon.ico" : "./images/favicon-down.ico";
    }

    // 更新全局状态
    changeSiteState(
      isAllOk ? "normal" : 
      hasAnyOk ? "error" : "allError"
    );
    
    changeSiteOverview({
      count: data.length,
      okCount,
      downCount
    });
  } catch (error) {
    console.error("状态更新失败:", error);
    changeSiteState("error");
  }
};
