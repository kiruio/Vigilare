import { useState, useEffect } from "react";
import { getSiteData } from "./utils/getSiteData";
import Header from "./components/header";
import SiteStatus from "./components/siteStatus";
import Footer from "./components/footer";

const App = () => {
  const [siteData, setSiteData] = useState<any>(null);
  const apiKey = import.meta.env.VITE_API_KEY;
  const countDays = import.meta.env.VITE_COUNT_DAYS;

  const getSiteStatusData = () => {
    setSiteData(null);
    getSiteData(apiKey, countDays).then((res) => {
      setSiteData(res);
    });
  };

  useEffect(() => {
    getSiteStatusData();
  }, [apiKey, countDays]);

  return (
    <>
      <Header getSiteData={getSiteStatusData} />
      <main id="main">
        <div className="container">
          <div className="all-site">
            <SiteStatus siteData={siteData} days={countDays} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default App;