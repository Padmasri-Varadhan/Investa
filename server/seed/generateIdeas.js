const fs = require('fs');

const categories = [
    { name: 'Savings Account', riskLevel: 'low', returns: '3% - 4% p.a.', horizon: 'Immediate', suitableFor: 'Beginner' },
    { name: 'Fixed Deposit (FD)', riskLevel: 'low', returns: '5% - 7.5% p.a.', horizon: '1 - 10 Years', suitableFor: 'Beginner' },
    { name: 'Recurring Deposit (RD)', riskLevel: 'low', returns: '5% - 7% p.a.', horizon: '6 Months - 10 Years', suitableFor: 'Beginner' },
    { name: 'Public Provident Fund (PPF)', riskLevel: 'low', returns: '7.1% p.a.', horizon: '15 Years', suitableFor: 'Beginner' },
    { name: 'Employee Provident Fund (EPF)', riskLevel: 'low', returns: '8.15% p.a.', horizon: 'Until Retirement', suitableFor: 'Beginner' },
    { name: 'National Pension System (NPS)', riskLevel: 'medium', returns: '9% - 12% p.a.', horizon: 'Until Retirement', suitableFor: 'Intermediate' },
    { name: 'Gold Investment', riskLevel: 'medium', returns: '7% - 9% p.a.', horizon: '3 - 10 Years', suitableFor: 'Beginner' },
    { name: 'Government Schemes', riskLevel: 'low', returns: '6% - 8% p.a.', horizon: '5 - 15 Years', suitableFor: 'Beginner' },
    { name: 'Corporate Bonds', riskLevel: 'medium', returns: '7% - 10% p.a.', horizon: '1 - 5 Years', suitableFor: 'Intermediate' },
    { name: 'Treasury Bills', riskLevel: 'low', returns: '6% - 7% p.a.', horizon: '91 - 364 Days', suitableFor: 'Beginner' },
    { name: 'REITs', riskLevel: 'medium', returns: '8% - 10% p.a.', horizon: '3 - 7 Years', suitableFor: 'Intermediate' },
    { name: 'International Investments', riskLevel: 'high', returns: '10% - 15% p.a.', horizon: '5+ Years', suitableFor: 'Advanced' },
    { name: 'Mutual Funds', riskLevel: 'medium', returns: '10% - 15% p.a.', horizon: '3 - 10 Years', suitableFor: 'Intermediate' },
    { name: 'SIP Investments', riskLevel: 'medium', returns: '10% - 15% p.a.', horizon: '5 - 20 Years', suitableFor: 'Beginner' },
    { name: 'Stocks', riskLevel: 'high', returns: '12% - 20% p.a.', horizon: '5+ Years', suitableFor: 'Advanced' },
    { name: 'Cryptocurrency', riskLevel: 'high', returns: 'Highly Volatile', horizon: '1 - 10 Years', suitableFor: 'Advanced' },
    { name: 'Real Estate', riskLevel: 'medium', returns: '8% - 12% p.a.', horizon: '5 - 20 Years', suitableFor: 'Advanced' },
    { name: 'ETFs', riskLevel: 'medium', returns: '10% - 12% p.a.', horizon: '3 - 10 Years', suitableFor: 'Intermediate' },
    { name: 'Index Funds', riskLevel: 'medium', returns: '10% - 12% p.a.', horizon: '5 - 10 Years', suitableFor: 'Beginner' }
];

const subTypes = {
    'Savings Account': ['High-Yield Savings', 'Zero Balance Account', 'Women-centric Account', 'Senior Citizen Savings', 'Student Savings', 'Corporate Salary Account', 'Digital Savings Account', 'Kids Savings Account', 'NRI Savings Account', 'Premium Banking Account'],
    'Fixed Deposit (FD)': ['Regular FD', 'Tax Saving FD', 'Senior Citizen FD', 'Cumulative FD', 'Non-Cumulative FD', 'Flexi FD', 'Corporate FD', 'Standard FD', 'Short-term FD', 'NRE/NRO FD'],
    'Recurring Deposit (RD)': ['Regular RD', 'Senior Citizen RD', 'Tax Saving RD', 'Flexi RD', 'NRE/NRO RD', 'Minor RD', 'Special RD', 'Short-term RD', 'Long-term RD', 'Corporate RD'],
    'Public Provident Fund (PPF)': ['Standard PPF', 'Minor PPF Account', 'HUF PPF (Legacy)', 'Post Office PPF', 'Bank PPF', 'Extended PPF (15+ Years)', 'Tax-Free PPF', 'Retirement PPF', 'Wealth Building PPF', 'Long-term Savings PPF'],
    'Employee Provident Fund (EPF)': ['Standard EPF', 'Voluntary Provident Fund (VPF)', 'Exempted EPF Trust', 'Unexempted EPF', 'EPS Pension Component', 'EDLI Scheme', 'EPF Advance for Housing', 'EPF for Medical', 'EPF for Education', 'UAN Linked EPF'],
    'National Pension System (NPS)': ['Tier I Account', 'Tier II Account', 'Corporate NPS', 'All Citizen Model', 'Active Choice Auto', 'Conservative Auto Choice', 'Moderate Auto Choice', 'Aggressive Auto Choice', 'Government Sector NPS', 'NPS Lite'],
    'Gold Investment': ['Physical Gold', 'Gold ETFs', 'Sovereign Gold Bonds (SGB)', 'Digital Gold', 'Gold Mutual Funds', 'Gold Mining Stocks', 'Gold Futures', 'Gold Options', 'Jewelry Investment', 'Gold Saving Schemes'],
    'Government Schemes': ['Sukanya Samriddhi Yojana', 'Senior Citizen Savings Scheme', 'Kisan Vikas Patra', 'National Savings Certificate', 'Pradhan Mantri Vaya Vandana Yojana', 'Post Office Monthly Income Scheme', 'Atal Pension Yojana', 'PM Jan Dhan Yojana', 'RBI Floating Rate Bonds', 'Mahila Samman Savings Certificate'],
    'Corporate Bonds': ['Secured Bonds', 'Unsecured Bonds', 'Convertible Bonds', 'Non-Convertible Debentures (NCD)', 'Zero Coupon Bonds', 'Floating Rate Bonds', 'Junk Bonds', 'Investment Grade Bonds', 'Tax-Free Bonds', 'Perpetual Bonds'],
    'Treasury Bills': ['91-Day T-Bill', '182-Day T-Bill', '364-Day T-Bill', 'Cash Management Bills', 'State Development Loans', 'Zero Coupon T-Bills', 'Short Term Sovereign Paper', 'Retail Direct T-Bills', 'Bank Auction T-Bills', 'Institutional T-Bills'],
    'REITs': ['Commercial REITs', 'Retail REITs', 'Residential REITs', 'Healthcare REITs', 'Data Center REITs', 'Infrastructure REITs', 'Mortgage REITs', 'Hotel/Resort REITs', 'Industrial REITs', 'Diversified REITs'],
    'International Investments': ['US Tech Stocks', 'Global ETFs', 'Emerging Market Funds', 'International Mutual Funds', 'European Equities', 'Asian Growth Funds', 'Global Real Estate', 'Foreign Government Bonds', 'International Index Funds', 'Global Dividend Funds'],
    'Mutual Funds': ['Large Cap Funds', 'Mid Cap Funds', 'Small Cap Funds', 'Flexi Cap Funds', 'ELSS Tax Saving Funds', 'Hybrid Funds', 'Debt Funds', 'Liquid Funds', 'Sectoral/Thematic Funds', 'Value Funds'],
    'SIP Investments': ['Equity SIP', 'Debt SIP', 'Index Fund SIP', 'Gold SIP', 'Top-up SIP', 'Perpetual SIP', 'Trigger SIP', 'Flexible SIP', 'Micro SIP', 'Multi-Asset SIP'],
    'Stocks': ['Blue-Chip Stocks', 'Dividend Yield Stocks', 'Growth Stocks', 'Value Stocks', 'Penny Stocks', 'Tech Sector Stocks', 'FMCG Stocks', 'Banking/Financial Stocks', 'Energy Stocks', 'Pharma Stocks'],
    'Cryptocurrency': ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Stablecoins (USDT/USDC)', 'Altcoins (ADA/SOL)', 'DeFi Tokens', 'NFT Platform Tokens', 'Layer-2 Solutions', 'Exchange Tokens', 'Privacy Coins', 'Meme Coins (High Risk)'],
    'Real Estate': ['Residential Property', 'Commercial Office Space', 'Retail Shops', 'Agricultural Land', 'Warehousing', 'Real Estate Crowdfunding', 'Rental Properties', 'Flipping Houses', 'Co-working Spaces', 'Vacation Rentals'],
    'ETFs': ['Nifty 50 ETF', 'Bank Nifty ETF', 'Gold ETF', 'Nasdaq 100 ETF', 'Sectoral ETF (IT/Pharma)', 'Dividend ETF', 'Smart Beta ETF', 'Liquid ETF', 'Bond/Debt ETF', 'International ETF'],
    'Index Funds': ['Nifty 50 Index Fund', 'Sensex Index Fund', 'Nifty Next 50', 'S&P 500 Index Fund', 'Nifty Midcap 150', 'Nifty Smallcap 250', 'Nasdaq 100 Index', 'Equal Weight Index', 'Factor Based Index', 'Global Equity Index']
};

const prosDb = [
    'Highly regulated and secure', 'Excellent long-term growth potential', 'Good hedge against inflation', 'Tax benefits under Section 80C', 'High liquidity', 'Diversification of risk', 'Professionally managed', 'Low entry cost', 'Guaranteed returns', 'Passive income generation'
];
const consDb = [
    'Market volatility risk', 'Lock-in period applies', 'Lower returns compared to equity', 'Capital loss possible', 'Requires constant monitoring', 'Subject to interest rate changes', 'Taxable upon withdrawal', 'High management fees', 'Currency exchange risk', 'Illiquid asset'
];

let ideas = [];

categories.forEach(cat => {
    const subs = subTypes[cat.name] || [];
    subs.forEach((sub, i) => {
        const title = sub;
        const category = cat.name;
        const riskLevel = cat.riskLevel;
        const expectedReturns = cat.returns;
        const horizon = cat.horizon;
        const suitableFor = cat.suitableFor;
        
        const overview = `Explore the potential of ${title}, a tailored variant of ${category} designed to offer ${expectedReturns} over a horizon of ${horizon}. Ideal for ${suitableFor} investors looking for ${riskLevel} risk exposure.`;
        
        const pros = [prosDb[i % prosDb.length], prosDb[(i+1) % prosDb.length]];
        const cons = [consDb[i % consDb.length], consDb[(i+1) % consDb.length]];

        const detailedContent = `
### Understanding ${title}

${title} is a prominent strategy within the **${category}** segment. It caters to ${suitableFor.toLowerCase()} investors aiming for ${expectedReturns}. 

#### 💡 Educational Insights
This investment carries a **${riskLevel.toUpperCase()}** risk profile. The primary mechanics involve capital allocation over a duration of ${horizon}, allowing the asset to compound or yield fixed returns depending on market conditions. 

When you invest in ${title}, you are essentially utilizing a financial instrument that balances risk and reward according to your personal financial goals.

#### 📊 Who Should Invest?
*   **Suitability:** ${suitableFor}s who want to diversify their portfolio.
*   **Risk Appetite:** Perfect for those comfortable with a ${riskLevel} degree of risk.
*   **Horizon:** It is highly recommended to stay invested for ${horizon} to realize the maximum benefits.

#### ⚖️ Things to Consider
Before committing your capital, remember that every investment has trade-offs. Ensure that the ${riskLevel} risk aligns with your emergency funds and long-term targets.

_Disclaimer: All investments are subject to market risks. Please read all related documents carefully before investing._
        `;

        ideas.push({
            title,
            category,
            riskLevel,
            expectedReturns,
            horizon,
            overview,
            pros,
            cons,
            detailedContent
        });
    });
});

fs.writeFileSync('server/seed/investmentIdeas.json', JSON.stringify(ideas, null, 2));
console.log(`Generated ${ideas.length} investment ideas.`);
