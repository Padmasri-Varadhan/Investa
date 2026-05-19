const fs = require('fs');
const path = require('path');
const https = require('https');

// 51 verified YouTube video IDs mapped to simplified categories: Investing, Planning, Alternative Assets
const VIDEOS_DATA = [
  // --- Investing ---
  {
    videoId: 'W_dd4PIFBXI',
    title: 'How to Create Wealth & Start SIP',
    category: 'Investing',
    level: 'Beginner',
    description: 'Learn the foundational concepts of wealth creation, the power of starting early, and how compounding helps your money grow.',
    advisor: 'Zerodha Varsity',
    views: '1.5M',
    duration: '12:50'
  },
  {
    videoId: 'CeBnEET02nc',
    title: 'Where to Invest My Salary? Asset Allocation Explained',
    category: 'Investing',
    level: 'Beginner',
    description: 'A detailed class explaining how to allocate your monthly salary between different asset classes for optimal financial growth.',
    advisor: 'Zerodha Varsity',
    views: '950K',
    duration: '14:10'
  },
  {
    videoId: '9155SZc96kk',
    title: 'What is Compounding? Finance Lessons for Beginners',
    category: 'Investing',
    level: 'Beginner',
    description: 'Understanding the basic mathematics and magic of compound interest and how compounding multiplies wealth over time.',
    advisor: 'Zerodha Varsity',
    views: '350K',
    duration: '8:15'
  },
  {
    videoId: 'zM20Hes9OO4',
    title: 'Power of Compounding: Growing Money',
    category: 'Investing',
    level: 'Beginner',
    description: 'IND Learn explains how compounding acts as the ultimate engine for long-term wealth creation and regular savings.',
    advisor: 'INDmoney',
    views: '400K',
    duration: '9:30'
  },
  {
    videoId: 'psVhHqz6TTA',
    title: 'Basics of Investing for Beginners',
    category: 'Investing',
    level: 'Beginner',
    description: 'Get started with the fundamentals of investing. Learn why to invest, where to invest, and how to define your goals.',
    advisor: 'INDmoney',
    views: '600K',
    duration: '11:15'
  },
  {
    videoId: 'ChiREYfwG3c',
    title: 'Trading vs. Investing: Core Differences',
    category: 'Investing',
    level: 'Beginner',
    description: 'Understand the fundamental differences between short-term trading and long-term investing, and the risks associated with both.',
    advisor: 'Zerodha Varsity',
    views: '2.5M',
    duration: '18:15'
  },
  {
    videoId: 'z0Rwoz6PduM',
    title: 'Introduction to Options Trading & Candlestick Patterns',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Learn the basics of options trading, how to read candlestick charts, and the proper way to use technical signals.',
    advisor: 'Zerodha Varsity',
    views: '1.8M',
    duration: '22:40'
  },
  {
    videoId: '8rUc0MaMzik',
    title: 'Introduction to Fundamental Analysis of Stocks',
    category: 'Investing',
    level: 'Beginner',
    description: 'A step-by-step introduction to evaluating a company\'s financial statements, management quality, and growth potential.',
    advisor: 'Zerodha Varsity',
    views: '1.2M',
    duration: '15:20'
  },
  {
    videoId: 'yzRP-mA2eiE',
    title: 'Fundamental Analysis vs. Technical Analysis',
    category: 'Investing',
    level: 'Beginner',
    description: 'A comparison of using financial fundamentals versus technical chart patterns to formulate market entry and exit decisions.',
    advisor: 'Zerodha Varsity',
    views: '1.1M',
    duration: '14:45'
  },
  {
    videoId: '5M232FaN5Ks',
    title: 'Reading and Customizing Charts on Kite',
    category: 'Investing',
    level: 'Beginner',
    description: 'Learn how to use technical charts, set up indicators, and monitor price movements using the Kite trading platform.',
    advisor: 'Zerodha Varsity',
    views: '750K',
    duration: '10:30'
  },
  {
    videoId: '3kCfR-yCcyo',
    title: 'What Determines Stock Prices and Returns?',
    category: 'Investing',
    level: 'Beginner',
    description: 'Explore the internal and external factors that cause stock prices to move, and how to calculate absolute and CAGR returns.',
    advisor: 'INDmoney',
    views: '250K',
    duration: '8:40'
  },
  {
    videoId: 'Nt7O7X32-BA',
    title: 'ETF vs. Mutual Funds: Cost, Liquidity & Strategy',
    category: 'Investing',
    level: 'Intermediate',
    description: 'A detailed comparison of Exchange Traded Funds and active mutual funds, focusing on liquidity, tracking errors, and costs.',
    advisor: 'Zerodha Varsity',
    views: '1.2M',
    duration: '15:20'
  },
  {
    videoId: 'f5LQOolyMRg',
    title: 'How Active Mutual Funds and ETFs Invest: Mirae Asset',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Interview with Mirae Asset fund managers exploring how they build ETF and mutual fund portfolios for retail investors.',
    advisor: 'Zerodha Varsity',
    views: '400K',
    duration: '16:50'
  },
  {
    videoId: 'vElgDX5JF80',
    title: 'How to Get Started with Mutual Funds & SIPs',
    category: 'Investing',
    level: 'Beginner',
    description: 'Step-by-step tutorial on starting your first Systematic Investment Plan (SIP) and automating your monthly contributions.',
    advisor: 'Zerodha Varsity',
    views: '1.1M',
    duration: '14:45'
  },
  {
    videoId: '34V3jDDFL00',
    title: 'Managing Volatility with SIPs: ICICI Pru MF Strategy',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Fund manager Sankaran Naren explains how rupee cost averaging via SIPs helps manage market volatility and build wealth.',
    advisor: 'Zerodha Varsity',
    views: '800K',
    duration: '19:15'
  },
  {
    videoId: 'SJevNDWJb8w',
    title: 'How PPFAS Mutual Fund Invests: Investment Principles',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Fund manager Rajeev Thakkar explains their value investing philosophy, international diversification, and cash management.',
    advisor: 'Zerodha Varsity',
    views: '900K',
    duration: '22:15'
  },
  {
    videoId: 'UKzWYQ8B5ec',
    title: 'Investing Style of Canara Robeco Mutual Fund',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Explore the stock selection frameworks, risk-mitigation plans, and active strategies used by Canara Robeco MF.',
    advisor: 'Zerodha Varsity',
    views: '500K',
    duration: '18:40'
  },
  {
    videoId: 'cQ5H33c17xs',
    title: 'DSP Mutual Fund: Focus on Quality Stocks',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Vinit Sambre of DSP Mutual Fund shares insights on stock valuation, micro-cap investing, and identifying quality businesses.',
    advisor: 'Zerodha Varsity',
    views: '600K',
    duration: '21:10'
  },
  {
    videoId: 'Kb6jB1I2U3Q',
    title: 'How to Manage a Large Multi-Cap Fund: Baroda BNP Paribas',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Sanjay Chawla discusses portfolio construction, asset allocation rules, and risk management when investing at scale.',
    advisor: 'Zerodha Varsity',
    views: '450K',
    duration: '20:15'
  },
  {
    videoId: '_4YjbHlhyZo',
    title: 'What to Expect from HDFC Mutual Fund Schemes',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Chirag Setalvad discusses mid-cap and small-cap investing cycles, liquidity concerns, and HDFC\'s core fund strategies.',
    advisor: 'Zerodha Varsity',
    views: '700K',
    duration: '17:35'
  },
  {
    videoId: '-6xi9gJL3cY',
    title: 'What are Mutual Funds? Basics Explained Simply',
    category: 'Investing',
    level: 'Beginner',
    description: 'Learn the basic structure of mutual funds, active vs passive funds, and the role of asset management companies.',
    advisor: 'INDmoney',
    views: '1.5M',
    duration: '5:40'
  },
  {
    videoId: '1uY1d48aiak',
    title: 'Evolution of the Passive Fund Industry in India',
    category: 'Investing',
    level: 'Intermediate',
    description: 'Interview with Vishal Jain of Zerodha Fund House discussing index investing, ETFs, and long-term asset allocation.',
    advisor: 'Zerodha Varsity',
    views: '300K',
    duration: '25:40'
  },

  // --- Planning ---
  {
    videoId: 'QMiurjfSU_s',
    title: 'Do I Need Life Insurance or Health Insurance?',
    category: 'Planning',
    level: 'Beginner',
    description: 'Understand why robust insurance planning is the first and most critical step towards retirement security and capital preservation.',
    advisor: 'Zerodha Varsity',
    views: '1.6M',
    duration: '14:45'
  },
  {
    videoId: 'mpIDM8kZ-Wo',
    title: 'Common Mistakes While Buying Life & Health Insurance',
    category: 'Planning',
    level: 'Beginner',
    description: 'A critical guide explaining the major traps to avoid when choosing term policies or medical insurance for retirement planning.',
    advisor: 'Zerodha Varsity',
    views: '900K',
    duration: '15:10'
  },
  {
    videoId: 'uLomQGPliWw',
    title: 'Are You Mixing Insurance with Investments?',
    category: 'Planning',
    level: 'Intermediate',
    description: 'Why you should keep term insurance separate from investment schemes like endowment plans or ULIPs.',
    advisor: 'Zerodha Varsity',
    views: '1.2M',
    duration: '17:25'
  },
  {
    videoId: 'Rt32NfmSqYY',
    title: 'Why Do You Need Health Insurance?',
    category: 'Planning',
    level: 'Beginner',
    description: 'IND Learn covers health insurance fundamentals, sum assured selection, and protecting your retirement savings.',
    advisor: 'INDmoney',
    views: '350K',
    duration: '10:30'
  },
  {
    videoId: 'F8vhTNbtqsY',
    title: 'How is Income from Mutual Funds Taxed?',
    category: 'Planning',
    level: 'Intermediate',
    description: 'Learn about short-term and long-term capital gains tax on equity and debt mutual funds in India.',
    advisor: 'INDmoney',
    views: '800K',
    duration: '12:40'
  },
  {
    videoId: 'vO2KGm8NM8E',
    title: 'Why Saving Money and Budgeting is Important',
    category: 'Planning',
    level: 'Beginner',
    description: 'Discover practical guidelines for managing personal income, spending patterns, and setting financial objectives.',
    advisor: 'Zerodha Varsity',
    views: '1.1M',
    duration: '9:15'
  },
  {
    videoId: '5O2f--QwFEI',
    title: 'What is Inflation? Impact on Your Savings',
    category: 'Planning',
    level: 'Beginner',
    description: 'An easy-to-understand animation showing how inflation erodes purchasing power, and how to beat it by investing.',
    advisor: 'Zerodha Varsity',
    views: '300K',
    duration: '7:40'
  },
  {
    videoId: 'Kx9hY2ufEWo',
    title: 'Banking and Savings Accounts: Basics of Money',
    category: 'Planning',
    level: 'Beginner',
    description: 'Learn how banking institutions operate, differences in saving/checking accounts, and interest earnings.',
    advisor: 'Zerodha Varsity',
    views: '280K',
    duration: '6:50'
  },
  {
    videoId: 'M1NTCZO7Oe0',
    title: 'Basics of Goal Setting & Financial Planning',
    category: 'Planning',
    level: 'Beginner',
    description: 'Learn how to define, calculate, and implement a financial roadmap for short, medium, and long-term targets.',
    advisor: 'INDmoney',
    views: '500K',
    duration: '12:15'
  },
  {
    videoId: 'GdAkbOFfUe8',
    title: 'Basics of Savings: Start Your Wealth Journey',
    category: 'Planning',
    level: 'Beginner',
    description: 'IND Learn breaks down basic concepts of monthly savings, emergency planning, and initial budgeting.',
    advisor: 'INDmoney',
    views: '400K',
    duration: '8:25'
  },
  {
    videoId: '3DvL-ZE6bIk',
    title: 'Basics of Fixed Deposits & Debt Assets',
    category: 'Planning',
    level: 'Beginner',
    description: 'An analysis of fixed deposits, interest payouts, tenure decisions, and tax implications for conservative investors.',
    advisor: 'INDmoney',
    views: '300K',
    duration: '9:40'
  },
  {
    videoId: '5q_7Qtv_QaA',
    title: 'What is an Emergency Fund & How to Build It',
    category: 'Planning',
    level: 'Beginner',
    description: 'A complete beginner\'s guide explaining emergency reserves, target amounts, and liquid storage options.',
    advisor: 'Zerodha Varsity',
    views: '1.2M',
    duration: '11:15'
  },
  {
    videoId: '8yczgI21WMU',
    title: 'What is a Debt Trap? Mistakes to Avoid',
    category: 'Planning',
    level: 'Beginner',
    description: 'Understand how compounding interest works against you in credit card debt and high-cost consumer loans.',
    advisor: 'Zerodha Varsity',
    views: '800K',
    duration: '11:40'
  },
  {
    videoId: 'D916Xq4Fbxg',
    title: 'What is a Budget? Managing Expenses',
    category: 'Planning',
    level: 'Beginner',
    description: 'A step-by-step introduction to designing a personal budget, tracking monthly expenditures, and building savings.',
    advisor: 'Zerodha Varsity',
    views: '320K',
    duration: '7:15'
  },
  {
    videoId: 'dvfFjV_ShxU',
    title: 'Credit Score & CIBIL Score Explained',
    category: 'Planning',
    level: 'Beginner',
    description: 'Learn what credit bureaus are, how CIBIL scores are calculated, and how they affect your loan eligibility.',
    advisor: 'INDmoney',
    views: '900K',
    duration: '14:20'
  },
  {
    videoId: 'sL-CDxZZW68',
    title: 'How Can You Increase Your Credit Score?',
    category: 'Planning',
    level: 'Beginner',
    description: 'Practical tips to improve your credit history: loan repayment rules, utilization rates, and report auditing.',
    advisor: 'INDmoney',
    views: '600K',
    duration: '11:50'
  },
  {
    videoId: 'a-BII473vMU',
    title: 'Basics of Bank Accounts: Checking & Savings',
    category: 'Planning',
    level: 'Beginner',
    description: 'Learn the differences in operational charges, interest rates, and debit cards across different bank accounts.',
    advisor: 'INDmoney',
    views: '350K',
    duration: '8:10'
  },
  {
    videoId: 'l7nf2ocE6jE',
    title: 'Basics of Emergency Fund: Setup and Safety',
    category: 'Planning',
    level: 'Beginner',
    description: 'How to calculate your monthly baseline expenses to construct a 6-month safety net in liquid assets.',
    advisor: 'INDmoney',
    views: '400K',
    duration: '9:30'
  },
  {
    videoId: 'vaxRsYGdIus',
    title: 'How Much Emergency Fund is Enough?',
    category: 'Planning',
    level: 'Beginner',
    description: 'Karthik Rangappa examines the 6x expense rule and outlines how to securely store emergency reserves.',
    advisor: 'Zerodha Varsity',
    views: '1.1M',
    duration: '13:20'
  },
  {
    videoId: '7DddswFtaTw',
    title: 'Basics of Risk Profiling in Financial Planning',
    category: 'Planning',
    level: 'Beginner',
    description: 'Understanding risk tolerance vs. capacity, and aligning your asset allocation with your psychological profiles.',
    advisor: 'INDmoney',
    views: '200K',
    duration: '10:15'
  },
  {
    videoId: 'CXsWe58vTOg',
    title: 'Basics of Long-Term Financial Goals',
    category: 'Planning',
    level: 'Beginner',
    description: 'How inflation and compounding affect goals scheduled 10+ years out, and hedging techniques to protect capital.',
    advisor: 'INDmoney',
    views: '220K',
    duration: '11:40'
  },
  {
    videoId: 'Zpg-zUrQadI',
    title: 'What is Insurance? Underwriting & Risk Pools',
    category: 'Planning',
    level: 'Beginner',
    description: 'Learn how the insurance business pools risk, determines premiums, and protects individuals from financial shocks.',
    advisor: 'INDmoney',
    views: '380K',
    duration: '9:15'
  },
  {
    videoId: 'n1_c87Fh7NM',
    title: 'Insurance 101: Key Terms & Concepts',
    category: 'Planning',
    level: 'Beginner',
    description: 'Understanding copay, deductibles, sum assured, sub-limits, and exclusions before signing a policy.',
    advisor: 'INDmoney',
    views: '410K',
    duration: '10:30'
  },

  // --- Alternative Assets ---
  {
    videoId: 'gE-WmHG64AY',
    title: 'Physical Gold vs. Sovereign Gold Bonds (SGB)',
    category: 'Alternative Assets',
    level: 'Intermediate',
    description: 'A direct comparison of buying physical gold, gold mutual funds, gold ETFs, and Sovereign Gold Bonds.',
    advisor: 'INDmoney',
    views: '750K',
    duration: '12:30'
  },
  {
    videoId: 'fxxY0698eAQ',
    title: 'Is Gold ETF the Right Investment Choice?',
    category: 'Alternative Assets',
    level: 'Intermediate',
    description: 'A clear guide on how Gold ETFs operate, their benefits compared to physical gold, and portfolio asset allocation.',
    advisor: 'INDmoney',
    views: '500K',
    duration: '10:15'
  },
  {
    videoId: 'HVRtymOQP2I',
    title: 'What is a Stock Market Index? Nifty and Sensex',
    category: 'Alternative Assets',
    level: 'Beginner',
    description: 'Learn how stock indices like Nifty 50 and Sensex are constructed, and how you can invest in them passively via Index Funds and ETFs.',
    advisor: 'INDmoney',
    views: '300K',
    duration: '9:15'
  },
  {
    videoId: 'XhCeX98vY28',
    title: 'Introduction to REITs (Real Estate Investment Trusts)',
    category: 'Alternative Assets',
    level: 'Intermediate',
    description: 'Learn how to invest in commercial real estate with small amounts of capital using publicly traded REITs.',
    advisor: 'Zerodha Varsity',
    views: '400K',
    duration: '11:20'
  },
  {
    videoId: 'Ly4-qEkN7BY',
    title: 'Is AI Killing Indian IT Companies? Tech Industry Outlook',
    category: 'Alternative Assets',
    level: 'Intermediate',
    description: 'An analysis of technological disruption in the equity markets, and how investors should evaluate emerging tech risks.',
    advisor: 'Zerodha Varsity',
    views: '600K',
    duration: '18:50'
  },
  {
    videoId: 'EAucHlFstdU',
    title: 'Stock Metrics: Face Value, Market Value & Book Value',
    category: 'Alternative Assets',
    level: 'Intermediate',
    description: 'Learn the primary accounting metrics of valuation and assets, helping you identify speculative vs. value opportunities.',
    advisor: 'Zerodha Varsity',
    views: '500K',
    duration: '12:40'
  }
];

// Helper function to validate video ID via noembed.com
function validateVideo(videoId) {
  return new Promise((resolve) => {
    const url = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            resolve({ videoId, valid: false, error: json.error });
          } else {
            resolve({ videoId, valid: true });
          }
        } catch (e) {
          resolve({ videoId, valid: false, error: 'JSON Parse Error' });
        }
      });
    }).on('error', (err) => {
      resolve({ videoId, valid: false, error: err.message });
    });
  });
}

async function run() {
  console.log(`Starting validation of ${VIDEOS_DATA.length} videos...`);
  
  const validatedVideos = [];
  const seenIds = new Set();
  
  for (const v of VIDEOS_DATA) {
    if (seenIds.has(v.videoId)) {
      console.log(`⚠️ Skipping Duplicate Video: ${v.videoId} - ${v.title}`);
      continue;
    }
    
    // Live validation
    const check = await validateVideo(v.videoId);
    if (!check.valid) {
      console.log(`❌ Skipping Broken/Unembeddable Video: ${v.videoId} - ${v.title} (Error: ${check.error})`);
      continue;
    }
    
    seenIds.add(v.videoId);
    
    // Format model object
    validatedVideos.push({
      title: v.title,
      category: v.category,
      level: v.level,
      thumbnail: `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`,
      videoUrl: `https://www.youtube.com/embed/${v.videoId}`,
      duration: v.duration,
      description: v.description,
      advisor: v.advisor,
      views: v.views,
      tags: [v.category.toLowerCase().replace(/\s+/g, '_'), v.level.toLowerCase(), 'investing', 'finance'],
      createdAt: new Date().toISOString()
    });
  }

  const outPath = path.join(__dirname, 'videos.json');
  fs.writeFileSync(outPath, JSON.stringify(validatedVideos, null, 2));

  console.log(`\n✅ Completed! Successfully validated and generated ${validatedVideos.length} videos inside videos.json.`);
}

run();
