import DownIcon from "../assets/favicon-down.ico";
import dayjs from "dayjs";
import { useCacheStore } from "../stores/cache";
import { useStatusStore } from "../stores/status";
import { formatNumber } from "./timeTools";

// 定义类型
interface MonitorData {
  id: string;
  friendly_name: string;
  url: string;
  type: number;
  interval: number;
  status: number;
  logs: any[];
  custom_uptime_ranges: string;
}

interface ProcessedData {
  id: string;
  name: string;
  url: string;
  type: number;
  interval:number;
  average: string;
  daily: any[];
  total: any;
  status: string;
}

export const getSiteData = async (apikey: string, days: number) => {
  const { changeSiteData, siteData } = useCacheStore.getState();
  const { changeSiteState } = useStatusStore.getState();

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
    const response = await getMonitorsData({
      api_key: apikey,
      format: "json",
      logs: 1,
      log_types: "1-2",
      logs_start_date: start,
      logs_end_date: end,
      custom_uptime_ranges: ranges.join("-"),
    });

    // 更新缓存
    if (response?.monitors) {
      changeSiteData({
        data: response.monitors,
        timestamp: Date.now()
      });
    }

    const processed = dataProcessing(response.monitors, dates);
    updateSiteStatus(processed);
    return processed;
  } catch (error) {
    console.error("获取数据失败:", error);
    changeSiteState("wrong");
    throw error;
  }
};

/**
 * 对监控数据进行处理
 * @param {Array} data - 监控数据
 * @param {Array} dates - 日期数组
 * @returns {Array} - 处理后的数据
 */
const dataProcessing = (data: any, dates: any) => {
  return data?.map((monitor: any) => {
    const ranges = monitor.custom_uptime_ranges.split("-");
    const average = formatNumber(ranges.pop());
    const daily: any[] = [];
    const map: any[] = [];

    dates.forEach((date: any, index: number) => {
      map[date.format("YYYYMMDD")] = index;
      daily[index] = {
        date: date,
        uptime: formatNumber(ranges[index]),
        down: { times: 0, duration: 0 },
      };
    });

    /**
     * 统计总故障次数和累计故障时长
     * @param {Object} total - 初始总数
     * @param {Object} log - 日志数据
     * @returns {Object} - 更新后的总数
     */
    const calculateTotal = (total: any, log: any) => {
      if (log.type === 1) {
        const date: any = dayjs.unix(log.datetime).format("YYYYMMDD");
        total.duration += log.duration;
        total.times += 1;
        daily[map[date]].down.duration += log.duration;
        daily[map[date]].down.times += 1;
      }
      return total;
    };

    const total = monitor.logs.reduce(calculateTotal, {
      times: 0,
      duration: 0,
    });

    const result = {
      id: monitor.id,
      name: monitor.friendly_name,
      type: monitor.type,
      interval: monitor.interval,
      url: monitor.url,
      average: average,
      daily: daily,
      total: total,
      status: "unknown",
    };

    if (monitor.status === 2) result.status = "ok";
    if (monitor.status === 9) result.status = "down";

    return result;
  });
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
      favicon.href = isAllOk ? "favicon.ico" : DownIcon;
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

const getMonitorsData = async (postdata: any) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(import.meta.env.VITE_GLOBAL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postdata),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Bad response from server: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
