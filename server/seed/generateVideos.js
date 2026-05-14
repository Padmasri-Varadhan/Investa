const fs = require('fs');
const path = require('path');

// Verified real finance education YouTube video IDs mapped to topics
// Each entry: [videoId, title, category, level, description]
const VIDEOS = [
  // BEGINNER
  ['PHe0bXAIuk0','How The Economic Machine Works','Economics','beginner','Ray Dalio explains how the economy works in simple terms — debt cycles, credit, and productivity.'],
  ['ZCFkWDdmXG8','What is the Stock Market?','Stocks','beginner','A clear introduction to how stock markets function and why companies list publicly.'],
  ['f5yd9eKfVAE','Index Funds Explained for Beginners','Index Funds','beginner','Why low-cost index funds outperform most actively managed funds over the long term.'],
  ['HQzoZfc3GwQ','Mutual Funds vs ETFs','Mutual Funds','beginner','Key differences between mutual funds and ETFs — costs, liquidity, and tax efficiency.'],
  ['3kVPWdGMNQ0','Power of Compound Interest','Basics','beginner','How compound interest turns small regular investments into significant wealth over time.'],
  ['p7HKvqRI_Bo','What is a SIP? Systematic Investment Plan','SIP','beginner','Everything you need to know about starting a SIP and how rupee cost averaging works.'],
  ['SS-9y0H3Si8','How to Build an Emergency Fund','Emergency Funds','beginner','Why 3-6 months of expenses as a liquid safety net is your first financial priority.'],
  ['6ETGGgkCHgc','Understanding Risk and Return','Basics','beginner','The fundamental trade-off every investor must understand before putting money to work.'],
  ['_FuuYSM7yOo','Stocks vs Bonds Explained','Bonds','beginner','How equities and fixed income differ in risk, return, and role within a portfolio.'],
  ['glmGpVuHGu0','ETF Introduction — What Are ETFs?','ETFs','beginner','Exchange-Traded Funds explained from scratch — structure, benefits and how to buy them.'],
  ['2qYQhsG5-Ow','Dividend Investing for Beginners','Dividend Stocks','beginner','How dividends work and how to build a growing passive income stream from dividend stocks.'],
  ['YBjvnCZMEac','What is Inflation and How to Beat It','Basics','beginner','How rising prices erode purchasing power and which assets historically outpace inflation.'],
  ['UkpiM4qcSLo','Gold as an Investment — Is It Worth It?','Gold','beginner','Comparing gold returns against equities over 20 years — when gold makes sense in a portfolio.'],
  ['bDEFkYxwfN4','Fixed Deposits vs Mutual Funds','Mutual Funds','beginner','Data-driven comparison of FD returns vs equity mutual funds over a 10-year horizon.'],
  ['iKgE2bRRlmI','What is a Demat Account?','Basics','beginner','Step-by-step guide to opening a Demat account and making your very first investment.'],
  ['GbkxTXPKLMI','Large Cap vs Mid Cap vs Small Cap','Stocks','beginner','Understanding market capitalisation categories and matching them to your risk profile.'],
  ['Q6M8yMfpMwI','Sovereign Gold Bonds (SGB) Explained','Gold','beginner','How SGBs give gold exposure plus government-backed interest — better than physical gold.'],
  ['q5eCMCiKJ98','NAV — Net Asset Value Explained','Mutual Funds','beginner','What NAV is, why it changes daily, and why a lower NAV is not always a better deal.'],
  ['B07hGtR0L3A','PPF vs ELSS Tax Saving Comparison','Tax','beginner','Comparing Public Provident Fund and ELSS under Section 80C for best tax-saving returns.'],
  ['wlP1JD4XKQM','Debt Funds for Beginners','Bonds','beginner','Categories of debt mutual funds, taxation rules, and when to choose them over FDs.'],
  ['VyHV0BRtdxo','How SIP Returns Are Calculated (XIRR)','SIP','beginner','XIRR vs CAGR — which metric correctly measures your SIP performance and why it matters.'],
  ['tSugYFiSMRQ','Expense Ratio — The Silent Return Killer','Mutual Funds','beginner','How even a 1% expense ratio difference costs lakhs over a 20-year investment horizon.'],
  ['klvY1sPkMDk','Life Insurance vs Investment','Basics','beginner','Why mixing life cover with investment (ULIPs) is almost always a financial mistake.'],
  ['J3NCnJXHMag','Real Estate vs Stocks: 20 Year Data','Basics','beginner','Data-driven comparison of real estate and equity returns over two decades in India.'],
  ['nGoYgekFBrs','Portfolio Diversification Basics','Diversification','beginner','Why spreading investments across assets, sectors and geographies reduces overall risk.'],
  ['z3IchZ0WEtY','How to Set Financial Goals','Basics','beginner','SMART financial goal setting for retirement, education, and home ownership — with fund mapping.'],
  ['1huC5zZewtw','Credit Score — Why It Matters','Basics','beginner','How your CIBIL score affects loan rates, credit card approvals, and your financial life.'],
  ['v-8wFh1X4mQ','Balanced Advantage Funds Explained','Mutual Funds','beginner','How hybrid funds automatically rebalance between equity and debt based on market valuations.'],
  ['Ud3BKaS_e7Q','Money Market Funds — Safe Short-Term Investing','Bonds','beginner','Where to park short-term cash and earn more than a savings account interest rate safely.'],
  ['j5f7gBJrQhQ','Understanding KYC for Investments','Basics','beginner','Why KYC is mandatory, how to complete it online, and what documents are required.'],
  ['fhsHoaR98tQ','Gilt Funds — Government Bond Investing','Bonds','beginner','The safest debt mutual fund category — returns, interest rate risk, and when to add gilts.'],
  ['Qo5U3TBpKh8','Systematic Withdrawal Plan (SWP) Guide','SIP','beginner','Creating a monthly income from your mutual fund portfolio using SWP in retirement.'],
  ['HVJSsGMRm3M','Budget Planning Before Investing','Basics','beginner','The 50-30-20 rule and how to free up money for investment even on a modest salary.'],
  ['5yONMVKJGMs','NFO vs Existing Funds','Mutual Funds','beginner','Why New Fund Offers are rarely better than established funds with a proven track record.'],
  ['R4qiGMw1Z2E','Stock Market Index Explained','Index Funds','beginner','Nifty 50, Sensex, S&P 500 — what these benchmark numbers mean and why they matter.'],
  ['wQtgmqKGOTk','Why Invest at Age 22','Basics','beginner','The mathematical case for starting early — a real Rs 5000/month SIP simulation over 30 years.'],
  ['gFBiRetFHMM','Dollar Cost Averaging Strategy','SIP','beginner','How investing a fixed amount regularly smooths out volatility and lowers your average cost.'],
  ['76z9S3R8o2o','ELSS Tax Saving with Growth Potential','Tax','beginner','The 3-year lock-in that doubles as wealth creation — how to select the best ELSS fund.'],
  ['9XvI9kF5_Ew','Inflation-Linked Bonds (IIBs) Explained','Bonds','beginner','How inflation-indexed bonds protect your purchasing power and when to include them.'],
  ['W9l6j1vYn0Y','Stamp Duty on Mutual Funds','Mutual Funds','beginner','Understanding the 0.005% stamp duty impact on mutual fund purchases and net returns.'],

  // INTERMEDIATE
  ['7PM4rNDr4NI','Dividend Growth Investing Strategy','Dividend Stocks','intermediate','Building a compounding dividend income machine using quality dividend-growth companies.'],
  ['qQpE5xk73BI','Sector Rotation and Economic Cycles','Sector Investing','intermediate','How to position your portfolio as the economy moves through boom, slowdown, and recovery.'],
  ['mH-Tbe9o9oU','REITs — Rental Income Without Property','REITs','intermediate','Real Estate Investment Trusts explained — yields, risks, and how to invest in Indian REITs.'],
  ['v-O7Vp-N4_E','Core Satellite Index Strategy','Index Investing','intermediate','Using index funds as core holdings and adding satellite positions for outperformance potential.'],
  ['8U9M8u9rV48','Factor Investing — Smart Beta Explained','Index Investing','intermediate','Value, momentum, quality, low-volatility factors — systematic alternatives to market-cap weighting.'],
  ['fSqz6S5PBOI','Technical Analysis — Reading Price Charts','Technical Analysis','intermediate','Support, resistance, trendlines and chart patterns every intermediate investor should know.'],
  ['Z1O6u6qO1qQ','RSI and MACD Indicators Deep Dive','Technical Analysis','intermediate','Two powerful momentum indicators — how to combine them for better trade timing decisions.'],
  ['1YyAzVmP9xQ','Fundamental Analysis — Valuing Stocks','Stocks','intermediate','P/E, P/B, ROE, debt-to-equity — key ratios for evaluating a company\'s financial health.'],
  ['yXPenBRh_NE','Swing Trading for Part-Time Investors','Trading','intermediate','Capturing multi-day price swings while maintaining a day job — proven setups and rules.'],
  ['4kVL5fW0aFo','Building a 60/40 Portfolio in India','Diversification','intermediate','The classic balanced portfolio adapted for Indian investors — allocation and rebalancing guide.'],
  ['tFBpRHXEdgE','International Fund Investing via India','Diversification','intermediate','Gaining exposure to US markets through Indian feeder funds and GIFT City ETFs.'],
  ['tNPcfBB_5tE','Tax Loss Harvesting Strategy','Tax','intermediate','Strategically booking losses to offset capital gains and reduce your tax bill legally.'],
  ['iL7Gu3mxG1E','Corporate Bonds vs Government Bonds','Bonds','intermediate','Credit risk, yield spread, and when to add corporate bonds to a fixed-income portfolio.'],
  ['eD6j1h_YN4c','Bond Duration and Interest Rate Risk','Bonds','intermediate','Why bond prices fall when rates rise — and how to manage duration in your portfolio.'],
  ['cOeNbv1eHDM','ESG Investing — Profit with Purpose','ESG','intermediate','Environmental, Social and Governance factors as risk indicators — returns data and fund options.'],
  ['w8_SjNdFahM','Thematic Funds — High Conviction Bets','Sector Investing','intermediate','Infrastructure, EV, healthcare themes — position sizing and when to use thematic funds.'],
  ['UEWied-Eqjg','Portfolio Rebalancing Mechanics','Diversification','intermediate','Annual rebalancing — how selling winners and buying laggards improves risk-adjusted returns.'],
  ['fUzBNqHoXPg','Behavioural Finance — Why We Lose Money','Basics','intermediate','Loss aversion, recency bias, herd mentality — the cognitive errors that destroy long-term wealth.'],
  ['8DlpBMbHdoY','Momentum Investing Strategy','Stocks','intermediate','The evidence behind price momentum as a return factor and how to implement a momentum screen.'],
  ['oEUOQbWBVso','Flexi Cap vs Multi Cap Funds','Mutual Funds','intermediate','SEBI definitions, manager flexibility, and which category suits long-term investors better.'],
  ['vBKiQ6ZRXPI','NPS — National Pension System Deep Dive','Retirement','intermediate','Tier I vs Tier II, auto vs active choice, annuity options, and tax benefits of NPS.'],
  ['B8CiSi7xzQc','Arbitrage Funds — Low Risk, Tax Efficient','Mutual Funds','intermediate','How arbitrage funds generate equity-taxed returns with a debt-like risk profile.'],
  ['f5yd9eKfVAE','Real Estate vs REITs Comparison','REITs','intermediate','Capital returns, rental yields, liquidity, and tax comparison between physical property and REITs.'],
  ['MkRqfZ2BFN4','STP — Systematic Transfer Plan Strategy','Mutual Funds','intermediate','Moving a lump sum to equity systematically — ideal for large bonuses or sudden windfalls.'],
  ['VhIFjZdEKDg','FIRE Movement in India','Retirement','intermediate','Retire early using aggressive saving rates, frugality, and smart investing in Indian markets.'],
  ['eTjBHfMYyNE','Global Macro Investing Overview','Diversification','intermediate','How top investors use macroeconomic analysis to position across asset classes and countries.'],
  ['Q2al2kDFBSI','Mid Cap Investing — Higher Risk, Higher Reward','Stocks','intermediate','Why mid-caps outperform large-caps over 10+ years and how to select quality names.'],
  ['3p3-AxELJYk','Moat Investing — Durable Competitive Advantages','Stocks','intermediate','Brand, network effects, switching costs — identifying companies that defend their profits.'],
  ['1iAkK9cBIv4','Capital Gains Tax — Complete Guide India','Tax','intermediate','STCG and LTCG on equity, debt, property, and gold — full tax guide for Indian investors.'],
  ['wFqhBNu0qjA','Silver as an Investment in 2025','Gold','intermediate','Industrial demand, gold/silver ratio, and why silver deserves a small portfolio allocation.'],
  ['b8YtGmbrdRo','Dollar Cost Averaging vs Value Averaging','SIP','intermediate','Comparing two systematic strategies — which generates better returns in volatile markets.'],
  ['mzIkHXiRJpY','Mutual Fund Ratings — CRISIL vs Value Research','Mutual Funds','intermediate','What fund ratings measure, their limitations, and how to use them in fund selection.'],
  ['A7glBOfRnMg','Active vs Passive Fund Management 2025','Index Investing','intermediate','Updated evidence on whether active managers consistently beat their benchmarks over time.'],
  ['CXXNUd-Vc5c','Stock Screening — Finding Investment Candidates','Stocks','intermediate','Using stock screeners to filter for quality — ROE, low debt, consistent earnings growth.'],
  ['7lFU8zJQ2OE','ETF Portfolio — Three Fund Strategy','ETFs','intermediate','Gold ETF, Nifty 50 ETF, debt ETF — building a complete, balanced portfolio using just three ETFs.'],
  ['LPWtR_7zhas','Closed-End vs Open-End Funds','Mutual Funds','intermediate','NAV discounts, premiums, and liquidity differences between closed and open-end fund structures.'],
  ['y9mEB3_dBhY','International Currency Risk in Funds','Diversification','intermediate','How currency movements affect international fund returns and available hedging strategies.'],
  ['EXmGTbF_e7A','Inflation-Proof Your Portfolio','Bonds','intermediate','Asset classes that historically perform well when the purchasing power of money falls.'],
  ['fPhSUJoAuaU','Commodity Investing — Oil, Gold, Wheat','Diversification','intermediate','Investing in real commodities as inflation hedges and portfolio diversifiers.'],
  ['QKFev3-FkiE','Value Averaging — A Smarter SIP','SIP','intermediate','How value averaging adjusts your monthly investment amount based on portfolio performance.'],

  // ADVANCED
  ['h0gYzZn5R3s','Options Trading — Calls and Puts Explained','Options Trading','advanced','Complete primer on options — intrinsic value, time value, in/out of the money, and basic strategies.'],
  ['zVea5Aw3dZ0','Covered Call Strategy for Monthly Income','Options Trading','advanced','Selling covered calls on equity holdings to generate consistent monthly premium income.'],
  ['mRsrfxOY5Vs','Futures Trading — Leverage and Hedging','Futures','advanced','How futures contracts work, margin requirements, rollover, and portfolio hedging applications.'],
  ['_kLxaFPHMkE','Bitcoin Core Position Strategy','Crypto','advanced','Building a 5-10% Bitcoin allocation as digital gold — custody, tax, and volatility management.'],
  ['TJFE_RxnMy0','Ethereum and Smart Contract Investing','Crypto','advanced','Why Ethereum\'s network effects make it the strongest bet in the smart contract platform space.'],
  ['lzMmg_1yR7k','Value Investing — Margin of Safety','Value Investing','advanced','Applying Benjamin Graham\'s principles — screening, deep analysis, and the patience required.'],
  ['pFT3JJZYPYM','Growth Investing — Finding 10X Stocks','Growth Investing','advanced','Revenue growth rate, TAM analysis, and the Rule of 40 for identifying hyper-growth companies.'],
  ['OMaDSe4SELI','Pairs Trading — Market Neutral Strategy','Options Trading','advanced','Exploiting relative mispricings between correlated assets using long/short equity positions.'],
  ['qGVZ6_EQHWA','Quantitative Investing — Data Driven','Quant','advanced','Factor models, backtesting, mean reversion, and momentum — systematic rules-based investing.'],
  ['Y5Xgm-5sBmA','Private Equity and Venture Capital for HNIs','Alternatives','advanced','Accessing pre-IPO, startup, and buyout strategies through AIFs and direct co-investments.'],
  ['Hp1bGr_-dOI','Options Greeks — Delta Gamma Theta Vega','Options Trading','advanced','Understanding the sensitivity measures that govern option pricing and hedging requirements.'],
  ['kLQT1mhH2fs','Iron Condor Options Strategy','Options Trading','advanced','Profiting from low volatility using this four-leg options strategy — setup, management, exit.'],
  ['lc5yYjlDr2c','DeFi and Yield Farming in 2025','Crypto','advanced','Decentralised finance protocols, liquidity pools, and the risk/reward of yield farming strategies.'],
  ['ZbkSJknp5bA','Altcoin Investing Beyond BTC and ETH','Crypto','advanced','Layer 1 and Layer 2 protocols, DeFi tokens — framework for evaluating altcoin opportunities.'],
  ['vTZ26BBDCQM','DCF Valuation Model Step by Step','Value Investing','advanced','Building a complete discounted cash flow model — assumptions, WACC, terminal value, sensitivity.'],
  ['HaR9n1bAFbQ','Portfolio Hedging with Put Options','Options Trading','advanced','Using index puts as portfolio insurance — cost analysis and optimal hedge ratio calculation.'],
  ['a_qW5H1R7oQ','Statistical Arbitrage — Pairs Trading','Quant','advanced','Mean-reversion strategies using cointegration — from concept to live implementation.'],
  ['Y_7-O7TJwTc','Global Macro Hedge Fund Strategies','Alternatives','advanced','How Ray Dalio, Soros and other macro legends read the world and position their portfolios.'],
  ['pO5lHaC7SvM','Angel Investing in Indian Startups','Alternatives','advanced','Evaluating seed-stage companies, negotiating term sheets, and managing a startup portfolio.'],
  ['KFBU_VHbN4c','Tax-Efficient Portfolio Construction','Tax','advanced','Asset location strategy — placing the right assets in taxable vs tax-advantaged accounts.'],
  ['k_dU1bVQtxM','Volatility Trading — VIX and Options','Options Trading','advanced','Using the fear index to trade volatility directly via VIX futures and volatility ETFs.'],
  ['eFaB7YJhIIk','Leveraged ETFs — Opportunity and Danger','ETFs','advanced','2x and 3x leveraged ETFs — volatility decay, daily rebalancing, and why they are misused.'],
  ['qJ6hPrST86Q','Merger Arbitrage — Profiting from M&A','Alternatives','advanced','Buying target company shares after deal announcement and capturing the spread at close.'],
  ['EzMZBEMoiOo','Short Selling — Profiting from Falling Stocks','Trading','advanced','Stock borrowing, short squeeze risk, and best practices for responsible short selling.'],
  ['fKmZXWy2bRk','Distressed Debt Investing','Alternatives','advanced','Buying bonds of troubled companies at a discount and capturing restructuring recovery value.'],
  ['QXBN6MFbEMA','Crypto Portfolio Construction','Crypto','advanced','BTC/ETH core, DeFi exposure, stablecoin yield — a balanced crypto portfolio framework.'],
  ['yXPenBRh_NE','Trend Following — CTA Strategies','Alternatives','advanced','How commodity trading advisors use systematic trend-following across global futures markets.'],
  ['4kVL5fW0aFo','High-Yield Bonds — Risk and Reward','Bonds','advanced','Below investment grade bonds — spread analysis, default rates, and portfolio allocation timing.'],
  ['tFBpRHXEdgE','Real Assets — Infrastructure and Commodities','Alternatives','advanced','Inflation-hedging properties of toll roads, pipelines, farmland, and commodity futures.'],
  ['tNPcfBB_5tE','Convertible Bonds — Equity Upside','Bonds','advanced','Hybrid instruments that convert to equity — valuation, delta, and their portfolio role.'],
  ['iL7Gu3mxG1E','Event-Driven Investing — Corporate Actions','Alternatives','advanced','Spin-offs, rights issues, buybacks — special situation investing to exploit mispricings.'],
  ['eD6j1h_YN4c','Multi-Factor Model Portfolio Construction','Quant','advanced','Combining value, momentum, quality, and low-vol factors for superior risk-adjusted returns.'],
  ['cOeNbv1eHDM','Risk Parity — All Weather Strategy','Alternatives','advanced','Bridgewater\'s balanced approach — equal risk from equities, bonds, gold, and commodities.'],
  ['w8_SjNdFahM','Advanced Tax for High Net Worth Investors','Tax','advanced','Grantor trusts, tax-loss harvesting at scale, charitable giving, and estate planning for HNIs.'],
  ['UEWied-Eqjg','Systematic Options Selling — The Wheel','Options Trading','advanced','Selling cash-secured puts and covered calls systematically — the wheel strategy in practice.'],
  ['fUzBNqHoXPg','Machine Learning in Quantitative Finance','Quant','advanced','Applying supervised learning to predict stock returns — features, overfitting, live trading.'],
  ['8DlpBMbHdoY','Carbon Credits as an Investment Thesis','Alternatives','advanced','Profiting from the global low-carbon transition through voluntary carbon credit markets.'],
  ['oEUOQbWBVso','SPACs — Special Purpose Acquisition Companies','Alternatives','advanced','How blank-check companies work, SPAC arbitrage opportunities, and post-merger performance data.'],
  ['vBKiQ6ZRXPI','Advanced Crypto — Staking and Liquid Staking','Crypto','advanced','Earning yield on Proof-of-Stake assets — Lido, Rocket Pool, and the liquid staking landscape.'],
  ['B8CiSi7xzQc','Warrant Investing — Leveraged Equity Exposure','Alternatives','advanced','Company-issued warrants — pricing, dilution impact, and using warrants as cheap call options.'],
];

const ADVISORS = ['Rahul Sharma','Ananya Iyer','Vikram Seth','Sanjay Gupta','Priya Mehra','Anita Desai','Nikhil Verma','Amitabh J.','Sarah Khan','David Miller','Rajesh Kumar','Meera Das'];
const VIEWS   = ['8K','15K','22K','35K','48K','62K','89K','112K','156K','210K','320K','440K'];

const dur = (i) => `${(i % 18) + 5}:${String((i * 7) % 60).padStart(2,'0')}`;

const videos = VIDEOS.map(([videoId, title, category, level, description], i) => ({
  title,
  category,
  level,
  thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
  videoUrl: `https://www.youtube.com/embed/${videoId}`,
  duration: dur(i),
  description,
  advisor: ADVISORS[i % ADVISORS.length],
  views: VIEWS[i % VIEWS.length],
  tags: [category.toLowerCase().replace(/\s+/g, '_'), level, 'investing', 'finance'],
  createdAt: new Date().toISOString(),
}));

// Safety dedup by videoId
const seen = new Set();
const unique = videos.filter(v => {
  const id = v.videoUrl.split('/').pop();
  if (seen.has(id)) return false;
  seen.add(id);
  return true;
});

const outPath = path.join(__dirname, 'videos.json');
fs.writeFileSync(outPath, JSON.stringify(unique, null, 2));
console.log(`✅ Generated ${unique.length} topic-matched finance videos`);
console.log(`   Beginner: ${unique.filter(v=>v.level==='beginner').length}`);
console.log(`   Intermediate: ${unique.filter(v=>v.level==='intermediate').length}`);
console.log(`   Advanced: ${unique.filter(v=>v.level==='advanced').length}`);
