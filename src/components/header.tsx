import { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Refresh } from "@icon-park/react";
import { message } from "antd";
import CountUp from "react-countup";
import { useStatusStore } from "../stores/status";
import { useCacheStore } from "../stores/cache";
import { formatTimestamp } from "../utils/timeTools";

const Header = ({ getSiteData }: { getSiteData: () => void }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [lastClickTime, setLastClickTime] = useState(0);
  const { siteState, siteOverview } = useStatusStore();
  const { siteData, changeSiteData } = useCacheStore();

  // 加载配置
  const siteName = import.meta.env.VITE_SITE_NAME;

  // 状态文本
  const statusNames: Record<string, string> = {
    loading: "站点状态加载中",
    error: "部分站点出现异常",
    allError: "全部站点出现异常",
    normal: "所有站点运行正常",
    wrong: "数据请求失败",
  };

  // 刷新状态
  const refreshStatus = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 60000) {
      messageApi.open({
        key: "updata",
        type: "warning",
        content: "请稍后再尝试刷新",
      });
      return false;
    }
    changeSiteData(null); // 使用 Zustand 的 action
    getSiteData();
    setLastClickTime(currentTime);
  };

  return (
    <header id="header" className={siteState}>
      {contextHolder}
      <SwitchTransition mode="out-in">
        <CSSTransition key={siteState} classNames="fade" timeout={300}>
          <div className={`cover ${siteState}`} />
        </CSSTransition>
      </SwitchTransition>
      <div className="container">
        <div className="menu">
          <span className="logo">{siteName}</span>
        </div>
        <div className="status">
          <div className={`icon ${siteState}`} />
          <div className="r-text">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={siteState}
                classNames="fade"
                timeout={300}
              >
                <div className="text">{statusNames[siteState]}</div>
              </CSSTransition>
            </SwitchTransition>
            <div className="tip">
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={siteState}
                  classNames="fade"
                  timeout={300}
                >
                  {siteState === "loading" ? (
                    <span>少女祈祷中...</span>
                  ) : siteState === "wrong" ? (
                    <span>出错啦(╯‵□′)╯︵┻━┻</span>
                  ) : (
                    <div className="time">
                      <span className="last-update">
                        {`上次更新于 ${
                          formatTimestamp(siteData?.timestamp).justTime
                        }`}
                      </span>
                      <div className="update">
                        <span>更新频率 5 分钟</span>
                        <Refresh className="refresh" onClick={refreshStatus} />
                      </div>
                    </div>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </div>
          </div>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={siteOverview?.count}
              classNames="fade"
              timeout={300}
            >
              {siteOverview ? (
                <div className="overview">
                  <div className="count">
                    <span className="name">站点总数</span>
                    <CountUp
                      className="num"
                      end={siteOverview.count}
                      duration={1}
                    />
                  </div>
                  <div className="status-num">
                    <div className="ok-count">
                      <span className="name">正常</span>
                      <CountUp
                        className="num"
                        end={siteOverview.okCount}
                        duration={1}
                      />
                    </div>
                    <div className="down-count">
                      <span className="name">异常</span>
                      <span className="num">
                        <CountUp
                          className="num"
                          end={siteOverview.downCount}
                          duration={1}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overview" />
              )}
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
    </header>
  );
};

export default Header;
