import { useState } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { formatNumber, formatDuration, formatDurationToMinute } from "../utils/timeTools";
import { LinkTwo } from "@icon-park/react";
import Tooltip from "antd/es/tooltip";
import "antd/es/tooltip/style";
import Button from "antd/es/button";
import "antd/es/button/style";
import Result from "antd/es/result";
import "antd/es/result/style";
import Modal from "antd/es/modal";
import "antd/es/modal/style";
import Tag from "antd/es/tag";
import "antd/es/tag/style";
import CustomLink from "../components/customLink";
import SiteCharts from "../components/siteCharts";
import { useStatusStore } from "../stores/status";

const SiteStatus = ({ siteData, days }: { siteData: any; days: number }) => {
  const { siteState } = useStatusStore();
  const [siteDetailsShow, setSiteDetailsShow] = useState<boolean>(false);
  const [siteDetailsData, setSiteDetailsData] = useState<any>(null);

  const siteTypeMap: Record<number, { tag: string; text: string; }> = {
    1: { tag: "HTTP", text: "发送 HTTP(S) 请求获取目标服务可用性" },
    2: { tag: "KEYWORD", text: "发送 HTTP(S) 请求并检查响应内容中是否包含指定关键词" },
    3: { tag: "PING", text: "发送 ICMP Echo 请求获取目标服务可用性" },
    4: { tag: "PORT", text: "检查目标服务端口是否开放" },
    5: { tag: "HEARTBEAT", text: "由被监控的服务主动发送心跳包获知其可用性" }
  }

  // 开启弹窗
  const showSiteDetails = (data: any) => {
    setSiteDetailsShow(true);
    setSiteDetailsData(data);
  };

  // 关闭弹窗
  const closeSiteDetails = () => {
    setSiteDetailsShow(false);
    setSiteDetailsData(null);
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition key={siteState} classNames="fade" timeout={100}>
        {siteState !== "wrong" ? (
          siteState !== "loading" && siteData ? (
            <div className="sites">
              {siteData.map((site: any) => (
                <div
                  key={site.id}
                  className={`site ${
                    site.status !== "ok" ? "error" : "normal"
                  }`}
                  onClick={() => {
                    showSiteDetails(site);
                  }}
                >
                  <div className="meta">
                    <div className="name">{site.name}</div>
                    <Tag
                      style={{ marginLeft: 8, fontSize: 10 }}
                    >
                      {siteTypeMap[site.type]?.tag || '未知'}
                      /{formatDurationToMinute(site.interval)}
                    </Tag>
                    <CustomLink iconDom={<LinkTwo />} to={site.url} />
                    <div
                      className={`status ${
                        site.status === "ok" ? "normal" : "error"
                      }`}
                    >
                      <div className="icon" />
                      <span className="tip">
                        {site.status === "ok" ? "正常访问" : "无法访问"}
                      </span>
                    </div>
                  </div>
                  <div className="timeline">
                    {site.daily.map((data: any, index: number) => {
                      const { uptime, down, date } = data;
                      const time = date.format("YYYY-MM-DD");
                      let status = null;
                      let tooltipText = null;
                      if (uptime >= 100) {
                        status = "normal";
                        tooltipText = `可用率 ${formatNumber(uptime)}%`;
                      } else if (uptime <= 0 && down.times === 0) {
                        status = "none";
                        tooltipText = "无数据";
                      } else {
                        status = "error";
                        tooltipText = `故障 ${
                          down.times
                        } 次，累计 ${formatDuration(
                          down.duration
                        )}，可用率 ${formatNumber(uptime)}%`;
                      }
                      return (
                        <Tooltip
                          key={index}
                          // trigger={["hover", "click"]}
                          title={
                            <div className="status-tooltip">
                              <div className="time">{time}</div>
                              <div className="text">{tooltipText}</div>
                            </div>
                          }
                          destroyTooltipOnHide
                        >
                          <div className={`line ${status}`} />
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className="summary">
                    <div className="now">今天</div>
                    <div className="note">
                      {site.total.times
                        ? `最近 ${days} 天内故障 ${
                            site.total.times
                          } 次，累计 ${formatDuration(
                            site.total.duration
                          )}，平均可用率 ${site.average}%`
                        : `最近 ${days} 天内可用率 ${site.average}%`}
                    </div>
                    <div className="day">
                      {site.daily[site.daily.length - 1].date.format(
                        "YYYY-MM-DD"
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* 站点详情 */}
              <Modal
                title={siteDetailsData?.name}
                open={siteDetailsShow}
                footer={null}
                onOk={closeSiteDetails}
                onCancel={closeSiteDetails}
                style={{ marginTop: "20px" }}
              >
                <SiteCharts siteDetails={siteDetailsData} />
              </Modal>
            </div>
          ) : (
            <div className="loading" />
          )
        ) : (
          <Result
            status="error"
            title="出错啦, 待会再试试吧（；´д｀）ゞ"
            extra={
              <Button
                type="primary"
                danger
                onClick={() => {
                  location.reload();
                }}
              >
                重试
              </Button>
            }
          />
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default SiteStatus;
