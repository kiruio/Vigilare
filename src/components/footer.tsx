import CustomLink from '../components/customLink';
import Package from '../../package.json';

const Footer = () => {
	// 加载配置
	const siteIcp = import.meta.env.VITE_SITE_ICP;
	const copyry = import.meta.env.VITE_COPYR_STARTYEAR;
	const copyrn = import.meta.env.VITE_COPYR_NAME;
	const copyrnu = import.meta.env.VITE_COPYR_NAME_URL;

	return (
		<footer id="footer" className="flex flex-col items-center mt-2">
			<div className="text-center text-13px leading-26px text-secondary">
				<p>
					<CustomLink to="https://github.com/bilirumble/upzilla" title="UptimeRobot">
						Upzilla
					</CustomLink>
					<span className="mx-1">v{Package.version},</span>
					<span className="mx-1">Based on</span>
					<CustomLink to="https://uptimerobot.com/" title="UptimeRobot">
						UptimeRobot
					</CustomLink>
				</p>
				<p>
					<span className="mx-1">
						Copyright © {copyry} - {new Date().getFullYear()}
					</span>
					<CustomLink to={copyrnu} title={copyrn}>
						{copyrn}
					</CustomLink>
					{siteIcp && (
						<>
							<span className="mx-1">|</span>
							<CustomLink to="https://beian.miit.gov.cn/" title={siteIcp}>
								{siteIcp}
							</CustomLink>
						</>
					)}
				</p>
			</div>
		</footer>
	);
};

export default Footer;
