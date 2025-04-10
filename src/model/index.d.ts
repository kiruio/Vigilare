// 定义类型
export interface RequsetPayload {
	api_key: string;
	format: string;
	logs: number;
	log_types: string;
	logs_start_date: number;
	logs_end_date: number;
	custom_uptime_ranges: string;
}

export interface ResponseData {
	monitors: MonitorData[];
	pagination: {
		total: number;
		page: number;
		per_page: number;
	};
}

export interface MonitorData {
	id: string;
	friendly_name: string;
	url: string;
	type: number;
	interval: number;
	status: number;
	logs: any[];
	custom_uptime_ranges: string;
}

export interface ProcessedData {
	id: string;
	name: string;
	url: string;
	type: number;
	interval: number;
	average: number;
	daily: Array<{
		uptime: number;
		date: any;
	}>;
	total: any;
	status: string;
}
