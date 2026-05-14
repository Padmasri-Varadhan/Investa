const fs = require('fs');
const path = require('path');

/**
 * GENERATE HIGH-QUALITY, BEGINNER-FRIENDLY SEED DATA
 * Goal: 150 Articles, 150 Investment Ideas, 150 Videos
 * All categories included. Simple, professional language.
 */

const categories = [
    'stocks', 'etf', 'index_fund', 'mutual_fund', 'bonds', 'crypto', 'real_estate', 
    'savings_account', 'fixed_deposit', 'recurring_deposit', 'ppf', 'epf', 'nps', 
    'gold_investment', 'government_schemes', 'corporate_bonds', 'treasury_bills', 
    'reits', 'international_investments'
];

const riskLevels = ['low', 'medium', 'high'];

// Helper to get random item
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- 1. GENERATE INVESTMENT IDEAS ---
const generateInvestmentIdeas = () => {
    const ideas = [];
    
    const ideaTemplates = {
        savings_account: {
            titles: ['Basic Savings Plan', 'High-Interest Savings', 'Emergency Fund Starter'],
            overview: 'A safe place to keep your money while earning a small amount of interest. It is perfect for money you might need quickly.',
            detailed: 'A savings account is the simplest way to start your financial journey. It is a bank account where you deposit money and the bank pays you interest for keeping it there. It is extremely safe and your money is available whenever you need it.'
        },
        fixed_deposit: {
            titles: ['Secure FD Plan', 'Tax-Saver Fixed Deposit', 'Senior Citizen Special FD'],
            overview: 'A way to grow your savings by locking them for a set time at a guaranteed interest rate.',
            detailed: 'A Fixed Deposit (FD) is a safe investment where you put a lump sum of money in a bank for a specific period. In return, the bank gives you a higher interest rate than a regular savings account.'
        },
        recurring_deposit: {
            titles: ['Monthly Savings Booster', 'Goal-Based RD', 'Smart Recurring Deposit'],
            overview: 'Save a small amount every month and watch it grow into a larger sum with guaranteed interest.',
            detailed: 'A Recurring Deposit (RD) helps you build a habit of saving. You invest a fixed amount every month for a pre-set period, and at the end, you get your total savings plus interest.'
        },
        ppf: {
            titles: ['Public Provident Fund (PPF)', 'Long-Term Tax Saver', 'Retirement Safety Net'],
            overview: 'A government-backed savings scheme that helps you save for the long term while reducing your taxes.',
            detailed: 'PPF is one of the safest investments in India. It is a 15-year long-term plan that offers tax benefits and guaranteed returns, making it perfect for retirement or children\'s education.'
        },
        epf: {
            titles: ['Employee Provident Fund', 'Workplace Retirement Plan', 'Salary-Based Savings'],
            overview: 'A retirement saving tool where both you and your employer contribute a part of your salary every month.',
            detailed: 'EPF is a mandatory saving for salaried employees. A portion of your basic salary goes into this fund, and your employer matches it. It earns a steady interest and builds a massive corpus over your working years.'
        },
        nps: {
            titles: ['National Pension System', 'Flexible Retirement Plan', 'Tier-1 Pension Scheme'],
            overview: 'A flexible retirement plan that lets you invest in stocks and bonds to build a bigger pension for your future.',
            detailed: 'NPS is a voluntary retirement scheme. You can choose how much of your money goes into stocks versus safe government bonds. It offers extra tax benefits and a regular pension after you retire.'
        },
        gold_investment: {
            titles: ['Digital Gold Savings', 'Gold ETF Strategy', 'Sovereign Gold Bonds'],
            overview: 'A smart way to invest in gold without the worry of physical storage or safety.',
            detailed: 'Investing in gold is a traditional way to protect your wealth. Today, you can buy "Digital Gold" or Gold Bonds which track the price of real gold but are much safer to hold and easier to sell.'
        },
        government_schemes: {
            titles: ['Kisan Vikas Patra', 'National Savings Certificate', 'Post Office Monthly Income'],
            overview: 'Safe investment plans run by the government to help citizens grow their money securely.',
            detailed: 'Government schemes are designed for maximum safety. They offer fixed returns and are ideal for people who do not want to take any risk with their hard-earned money.'
        },
        corporate_bonds: {
            titles: ['Top-Rated Company Bonds', 'High-Yield Corporate Debt', 'Monthly Income Bonds'],
            overview: 'Lend your money to large companies for a fixed period in exchange for regular interest payments.',
            detailed: 'Corporate bonds are like loans you give to a company. They usually pay a higher interest rate than bank deposits because they carry slightly more risk.'
        },
        treasury_bills: {
            titles: ['Government Treasury Bills', 'Short-Term Debt Security', 'Ultra-Safe T-Bills'],
            overview: 'Very short-term investments where you lend money to the government. They are considered risk-free.',
            detailed: 'Treasury Bills (T-Bills) are short-term money market tools used by the government to manage cash. Since they are issued by the government, they are extremely safe.'
        },
        reits: {
            titles: ['Commercial Real Estate REIT', 'Residential Property Trust', 'Infrastructure REIT'],
            overview: 'Earn regular rental income from large office buildings or malls without actually buying them.',
            detailed: 'REITs (Real Estate Investment Trusts) allow you to invest in expensive properties like IT parks and shopping malls with just a small amount of money. You get a share of the rent collected.'
        },
        international_investments: {
            titles: ['US Tech Giant Basket', 'Global Equity Fund', 'International Index Plan'],
            overview: 'Invest in world-famous companies like Apple, Google, and Amazon from your home country.',
            detailed: 'International investments allow you to grow your money in global markets. This protects you if your local market is not doing well and gives you exposure to the world\'s biggest brands.'
        },
        stocks: {
            titles: ['Blue Chip Growth Stocks', 'Dividend Paying Giants', 'Small Cap Opportunities'],
            overview: 'Buying a piece of a company. If the company grows, your money grows too.',
            detailed: 'Stocks represent ownership in a company. They offer the highest potential for growth over many years but can be volatile in the short term. It is best to hold them for at least 5-10 years.'
        },
        etf: {
            titles: ['Nifty 50 ETF', 'Global Technology ETF', 'Banking Sector ETF'],
            overview: 'A basket of stocks that you can buy easily like a single stock. It is a low-cost way to diversify.',
            detailed: 'An Exchange Traded Fund (ETF) tracks a specific index or group of assets. Instead of picking one stock, you buy the whole group, which reduces your risk significantly.'
        },
        index_fund: {
            titles: ['Passive Index Strategy', 'Broad Market Fund', 'Low-Cost Market Tracker'],
            overview: 'A simple fund that copies the performance of the entire stock market.',
            detailed: 'Index funds are perfect for beginners. They automatically invest in the biggest companies in the market, ensuring you get the market\'s average return without paying high management fees.'
        },
        mutual_fund: {
            titles: ['Diversified Equity Fund', 'Balanced Advantage Plan', 'Flexi-Cap Growth Fund'],
            overview: 'A pool of money from many investors that is managed by experts to buy stocks and bonds.',
            detailed: 'Mutual funds allow you to benefit from professional money management. A fund manager decides where to invest your money to get the best possible returns based on the fund\'s goal.'
        },
        bonds: {
            titles: ['Government Security Bond', 'Stable Income Bond', 'Long-Term Infrastructure Bond'],
            overview: 'A safe way to earn regular interest by lending your money to the government or big institutions.',
            detailed: 'Bonds are debt instruments. When you buy a bond, you are lending money to the issuer for a fixed time. In return, you get regular interest payments (called coupons) and your money back at the end.'
        },
        crypto: {
            titles: ['Bitcoin Core Strategy', 'Ethereum Ecosystem Plan', 'Stablecoin Savings'],
            overview: 'Digital assets that use technology to act as money or investments. Highly volatile but innovative.',
            detailed: 'Cryptocurrencies are digital tokens. While they offer massive growth potential, they are very risky and prices can change rapidly. Only invest a small part of your savings here.'
        },
        real_estate: {
            titles: ['Residential Plot Strategy', 'Commercial Space Plan', 'Holiday Home Investment'],
            overview: 'Buying physical property to earn rent or profit when you sell it later at a higher price.',
            detailed: 'Real estate is a tangible asset. It provides a sense of security and can generate regular rental income. However, it requires a lot of money to start and is not easy to sell quickly.'
        }
    };

    // Generate 150 Ideas
    for (let i = 0; i < 155; i++) {
        const cat = rand(categories);
        const template = ideaTemplates[cat] || ideaTemplates.index_fund;
        const risk = (cat === 'crypto' || cat === 'stocks') ? 'high' : 
                     (cat === 'etf' || cat === 'mutual_fund' || cat === 'reits' || cat === 'international_investments') ? 'medium' : 'low';
        
        const returns = risk === 'high' ? '12-25%' : risk === 'medium' ? '8-15%' : '4-8%';
        const horizon = risk === 'high' ? '5-10 Years' : risk === 'medium' ? '3-7 Years' : '1-5 Years';

        ideas.push({
            title: `${rand(template.titles)} #${i+1}`,
            category: cat,
            riskLevel: risk,
            expectedReturns: returns,
            horizon: horizon,
            overview: template.overview,
            detailedContent: `
# ${rand(template.titles)}

${template.detailed}

## Why this is good for you (Benefits)
*   **Simple to understand**: No complex math needed to get started.
*   **Low starting cost**: You can start with a very small amount.
*   **Safety**: Designed to help you keep your money secure.
*   **Growth**: Helps your money beat rising prices over time.

## Things to keep in mind (Risks)
*   **Market changes**: Prices can go up and down occasionally.
*   **Time**: You should be willing to wait for a few years to see real growth.
*   **Inflation**: Make sure your interest rate is higher than the rising cost of living.

## How to get started?
1.  **Check your budget**: See how much you can comfortably set aside.
2.  **Open an account**: Most of these can be started via your bank app or a specialized broker.
3.  **Start Small**: Don't feel pressured to invest a lot at once.
4.  **Stay Consistent**: Investing a little bit regularly is better than a lot once.

## Pro-Tips for Beginners
*   **Emergency Fund First**: Always keep some money aside for emergencies before you start investing.
*   **Read the basics**: Spend 10 minutes a week learning about your investment.
*   **Don't panic**: Market ups and downs are normal. Stay focused on your long-term goal.
            `.trim()
        });
    }
    return ideas;
};

// --- 2. GENERATE ARTICLES ---
const generateArticles = () => {
    const articles = [];
    
    const articlePool = {
        savings_account: [
            { title: 'The Ultimate Guide to Emergency Funds', summary: 'Why a savings account is your best friend during unexpected financial crises.' },
            { title: 'Choosing the Right Savings Account', summary: 'Not all savings accounts are equal. Learn what features to look for.' },
            { title: 'How Savings Interest Works', summary: 'A simple breakdown of how banks calculate and pay interest on your balance.' },
            { title: 'Savings vs. Under the Mattress', summary: 'The hidden risks of keeping cash at home and why banks are safer.' },
            { title: 'Maximizing Your Savings Yield', summary: 'Tips to get the highest possible interest rate from your regular bank.' },
            { title: 'Automating Your Monthly Savings', summary: 'How to use auto-pay features to build your wealth without thinking.' },
            { title: 'Small Savings, Big Future', summary: 'How tiny monthly deposits grow into significant amounts over time.' },
            { title: 'Bank Safety 101', summary: 'Understanding how your deposits are protected by government insurance.' }
        ],
        fixed_deposit: [
            { title: 'Beginner Guide to Fixed Deposits', summary: 'Learn how FDs offer guaranteed returns and complete peace of mind.' },
            { title: 'FD Laddering Strategy Explained', summary: 'A smart way to get high interest and liquidity at the same time.' },
            { title: 'Tax-Saving FDs: What You Need to Know', summary: 'How to reduce your tax bill while earning steady interest.' },
            { title: 'FD vs. Savings: The Interest Gap', summary: 'Why moving idle cash to an FD can boost your earnings significantly.' },
            { title: 'Understanding FD Tenure and Maturity', summary: 'How to pick the right time period for your fixed deposit.' },
            { title: 'Premature Withdrawal Risks', summary: 'What happens if you need your FD money before the term ends.' },
            { title: 'Senior Citizen FD Benefits', summary: 'Special interest rates and perks available for our elders.' },
            { title: 'Compounding in Fixed Deposits', summary: 'How interest-on-interest works in cumulative FD schemes.' }
        ],
        recurring_deposit: [
            { title: 'Building a Habit with Recurring Deposits', summary: 'The perfect tool for people who want to save small amounts monthly.' },
            { title: 'RD vs. SIP: Which is Better?', summary: 'A head-to-head comparison of two popular monthly saving methods.' },
            { title: 'Planning Your Vacation with an RD', summary: 'How to use a 12-month RD to fund your dream trip.' },
            { title: 'RD Interest Rates Decoded', summary: 'Why RD rates are similar to FDs but the calculation is different.' },
            { title: 'Flexi-RD: Saving with Freedom', summary: 'A look at RD schemes where you can change your monthly deposit amount.' },
            { title: 'Tax on RD Interest', summary: 'Understanding the tax implications of your recurring savings.' },
            { title: 'RD for Children\'s Education', summary: 'How small monthly steps can fund a bright future.' },
            { title: 'Is RD Risk-Free?', summary: 'Evaluating the safety and reliability of bank recurring deposits.' }
        ],
        ppf: [
            { title: 'How PPF Builds Long-Term Wealth', summary: 'The power of a 15-year government-backed tax-free investment.' },
            { title: 'PPF Withdrawal Rules Explained', summary: 'When and how you can take money out of your PPF account.' },
            { title: 'The Power of Compounding in PPF', summary: 'Why starting a PPF account early is a financial superpower.' },
            { title: 'PPF vs. ELSS: The Tax Saving Battle', summary: 'Which one should you choose for your 80C tax deductions?' },
            { title: 'Managing Your PPF Account Online', summary: 'Tips for tracking and contributing to your PPF easily.' },
            { title: 'PPF for Minors', summary: 'How to open an account for your children and secure their future.' },
            { title: 'Extension of PPF After 15 Years', summary: 'The benefits of continuing your account in blocks of 5 years.' },
            { title: 'Is PPF the Safest Investment in India?', summary: 'Understanding the sovereign guarantee behind your PPF funds.' }
        ],
        epf: [
            { title: 'Understanding Your EPF Statement', summary: 'A guide to reading your passbook and tracking your retirement money.' },
            { title: 'How EPF Interest is Calculated', summary: 'The math behind the attractive interest rates of the Provident Fund.' },
            { title: 'VPF: The Secret to Higher Returns', summary: 'How Voluntary Provident Fund can help you save more tax-free.' },
            { title: 'Withdrawal Rules for EPF', summary: 'Legal ways to take out money for home, health, or wedding.' },
            { title: 'Transferring EPF Between Jobs', summary: 'How the Universal Account Number (UAN) makes your money portable.' },
            { title: 'EPF vs. NPS: Retirement Comparison', summary: 'Which workplace retirement tool should you prioritize?' },
            { title: 'Pension Benefits Under EPS', summary: 'The often-forgotten pension component of your EPF contribution.' },
            { title: 'Checking Your EPF Balance via SMS', summary: 'Quick and easy ways to stay updated on your savings.' }
        ],
        nps: [
            { title: 'Beginner Guide to NPS', summary: 'Everything you need to know about the National Pension System.' },
            { title: 'NPS Tier 1 vs. Tier 2 Accounts', summary: 'Understanding the differences between retirement and savings tiers.' },
            { title: 'Tax Benefits of NPS Explained', summary: 'How to save an extra ₹50,000 in tax every year using NPS.' },
            { title: 'Choosing Your NPS Fund Manager', summary: 'How to pick the right experts to manage your retirement corpus.' },
            { title: 'Active vs. Auto Choice in NPS', summary: 'Deciding how much of your money goes into stocks automatically.' },
            { title: 'NPS Withdrawal and Annuity Rules', summary: 'What happens to your money when you reach age 60.' },
            { title: 'Investing in Corporate Debt via NPS', summary: 'How NPS uses safe corporate bonds to boost your returns.' },
            { title: 'Is NPS Better than Mutual Funds?', summary: 'A comparison of costs, taxes, and long-term performance.' }
        ],
        gold_investment: [
            { title: 'Gold Investment vs FD', summary: 'Which traditional asset is better for your portfolio in 2024?' },
            { title: 'What is Digital Gold?', summary: 'The easiest way to buy 24K gold with as little as ₹1.' },
            { title: 'Sovereign Gold Bonds (SGB) Explained', summary: 'How to get 2.5% extra interest on your gold investment.' },
            { title: 'Gold ETFs: Gold for the Stock Market', summary: 'Buying gold through your brokerage account simplified.' },
            { title: 'Safety of Digital Gold Platforms', summary: 'How to ensure your digital gold is backed by real physical bars.' },
            { title: 'Why Gold is a Hedge Against Inflation', summary: 'The role of gold in protecting your purchasing power.' },
            { title: 'Tax on Gold Investments', summary: 'Understanding physical vs. digital gold tax implications.' },
            { title: 'Gold Jewelry vs. Gold Bonds', summary: 'Why jewelry is a lifestyle choice but bonds are an investment.' }
        ],
        government_schemes: [
            { title: 'Top 5 Government Schemes for Safety', summary: 'The most reliable ways to grow your money with zero risk.' },
            { title: 'Kisan Vikas Patra: Doubling Your Money', summary: 'How this time-tested scheme works for long-term growth.' },
            { title: 'National Savings Certificate (NSC) Guide', summary: 'A popular safe investment for tax-saving and fixed income.' },
            { title: 'Sukanya Samriddhi Yojana (SSY) 101', summary: 'The best investment plan for a daughter\'s future.' },
            { title: 'Post Office Monthly Income Scheme', summary: 'How to get a regular "salary" from your one-time investment.' },
            { title: 'Atal Pension Yojana Explained', summary: 'A government-backed pension for workers in the unorganized sector.' },
            { title: 'Mahila Samman Savings Certificate', summary: 'A special high-interest scheme for women and girls.' },
            { title: 'Senior Citizen Savings Scheme (SCSS)', summary: 'Highest safety and regular income for retirees.' }
        ],
        corporate_bonds: [
            { title: 'Corporate Bonds vs. FDs', summary: 'Are corporate bonds worth the slightly higher risk for better pay?' },
            { title: 'Understanding Bond Credit Ratings', summary: 'How AAA, AA, and A ratings protect you from bad investments.' },
            { title: 'High Yield Corporate Bonds Guide', summary: 'A look at bonds that pay more but require more careful research.' },
            { title: 'The Role of Bonds in a Balanced Portfolio', summary: 'Why every investor needs some fixed-income stability.' },
            { title: 'Taxation on Corporate Bond Interest', summary: 'How your bond earnings are taxed compared to stocks.' },
            { title: 'How to Buy Bonds on an Exchange', summary: 'A step-by-step guide to using your demat account for bonds.' },
            { title: 'Bond Duration and Interest Rates', summary: 'Why bond prices change when the central bank changes rates.' },
            { title: 'Secured vs. Unsecured Corporate Bonds', summary: 'Learning which bonds have collateral and which don\'t.' }
        ],
        treasury_bills: [
            { title: 'Treasury Bills Explained Simply', summary: 'Understanding the ultra-safe short-term debt of the government.' },
            { title: 'How to Buy T-Bills via RBI Retail Direct', summary: 'The new way for regular people to invest directly with the RBI.' },
            { title: 'T-Bills vs. Liquid Mutual Funds', summary: 'Which short-term tool is better for parking your idle cash?' },
            { title: 'Understanding 91-Day and 364-Day T-Bills', summary: 'The different time horizons available for government debt.' },
            { title: 'Why T-Bills are Considered Risk-Free', summary: 'The ultimate safety of government-backed money market tools.' },
            { title: 'Yield Calculation in Treasury Bills', summary: 'Why T-bills are sold at a discount instead of paying interest.' },
            { title: 'T-Bills for Emergency Fund Parking', summary: 'Using government debt as a safe storage for your "rainy day" money.' },
            { title: 'Liquidity of Treasury Bills', summary: 'How easy is it to get your money back from a T-bill?' }
        ],
        reits: [
            { title: 'Best REIT Strategies for Beginners', summary: 'How to own pieces of large commercial properties with small capital.' },
            { title: 'Dividend Yields in Indian REITs', summary: 'A look at the regular income potential of real estate trusts.' },
            { title: 'REITs vs. Physical Property', summary: 'Why REITs are often a better choice than buying a flat for rent.' },
            { title: 'Understanding REIT Portfolio Quality', summary: 'How to evaluate the buildings owned by a Real Estate Trust.' },
            { title: 'Tax on REIT Dividends and Capital Gains', summary: 'The complex but important tax rules for REIT investors.' },
            { title: 'REITs as an Inflation Hedge', summary: 'How rising rents help REITs grow during inflationary periods.' },
            { title: 'The Growth of Commercial Real Estate', summary: 'Why office spaces and malls are good long-term bets.' },
            { title: 'How to Research a REIT IPO', summary: 'What to look for when a new real estate trust hits the market.' }
        ],
        international_investments: [
            { title: 'How to Invest in US Stocks from India', summary: 'A guide to global diversification using US tech giants.' },
            { title: 'Benefits of Global Diversification', summary: 'Why investing in different countries reduces your total portfolio risk.' },
            { title: 'US ETFs for Indian Investors', summary: 'Buying the whole S&P 500 or Nasdaq from your home country.' },
            { title: 'Currency Fluctuation Risks', summary: 'How the USD-INR exchange rate affects your global investments.' },
            { title: 'Taxation on Foreign Investments (LRS)', summary: 'Understanding the 20% TCS and other rules for sending money abroad.' },
            { title: 'Top Global Tech Stocks Overview', summary: 'A look at Apple, Google, and Amazon as investment assets.' },
            { title: 'European and Asian Markets Guide', summary: 'Looking beyond the US for international investment opportunities.' },
            { title: 'Feeder Funds: The Easy Way to Go Global', summary: 'Using local mutual funds to invest in international markets.' }
        ],
        stocks: [
            { title: 'Stock Market Basics for Beginners', summary: 'Everything you need to know to start your equity journey today.' },
            { title: 'Finding Your First Multi-Bagger Stock', summary: 'What to look for in companies that can grow 10X over time.' },
            { title: 'Dividend Growth Investing Strategy', summary: 'How to build a portfolio that pays you regular "passive income".' },
            { title: 'Technical vs. Fundamental Analysis', summary: 'A simple comparison of the two main ways to study stocks.' },
            { title: 'Avoiding Common Stock Market Scams', summary: 'How to protect your capital from "get rich quick" tips.' },
            { title: 'Long-Term vs. Day Trading', summary: 'Why long-term investing is usually better for most people.' },
            { title: 'Understanding P/E Ratio Simply', summary: 'How to tell if a stock is cheap or expensive using one number.' },
            { title: 'Building a Sector-Neutral Portfolio', summary: 'Why spreading your stocks across industries is vital.' }
        ],
        etf: [
            { title: 'Why ETFs are Better than Mutual Funds', summary: 'The low-cost, high-flexibility revolution in investing.' },
            { title: 'The Power of the Nifty 50 ETF', summary: 'How to own the top 50 companies in India with one single click.' },
            { title: 'Smart Beta ETFs Explained', summary: 'Advanced ETFs that try to get better returns than a regular index.' },
            { title: 'ETF Liquidity: Why It Matters', summary: 'Making sure you can always sell your ETF units when you need to.' },
            { title: 'Global Sector ETFs Guide', summary: 'Investing in specific themes like Green Energy or AI globally.' },
            { title: 'Passive Investing: The Lazy Way to Wealth', summary: 'How doing less can actually help you earn more in the long run.' },
            { title: 'Gold vs. Silver ETFs', summary: 'A comparison of precious metal ETFs for your portfolio.' },
            { title: 'ETF Tracking Error Simplified', summary: 'Why some ETFs don\'t perfectly match the market and how to find them.' }
        ]
    };

    // Fill the articles array by looping through categories to ensure equal distribution
    for (let i = 0; i < 160; i++) {
        const cat = categories[i % categories.length];
        const pool = articlePool[cat] || articlePool.stocks;
        const topic = pool[Math.floor(i / categories.length) % pool.length];
        
        articles.push({
            title: `${topic.title}`,
            category: cat,
            summary: topic.summary,
            riskLevel: (cat === 'crypto' || cat === 'stocks') ? 'high' : 
                       (cat === 'etf' || cat === 'mutual_fund' || cat === 'reits' || cat === 'international_investments') ? 'medium' : 'low',
            readTime: `${Math.floor(Math.random() * 8) + 4} min read`,
            imageUrl: `https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop&sig=${i}`,
            tags: [cat, 'investing', 'education', 'beginner'],
            fullContent: `
# ${topic.title}

Welcome to your guide on **${topic.title}**. In the world of finance, knowledge is the most valuable asset you can own.

## Why This Matters
Understanding ${topic.title} is crucial because it directly impacts how your money grows over time. Whether you are looking for safety, high returns, or tax benefits, this category has unique features that can help you reach your goals.

## The Core Concept
The main idea here is simplicity. You don't need to be a math genius to succeed. You just need to understand the basic mechanics:
1.  **Safety**: How secure is your principal?
2.  **Growth**: What is the expected interest or profit?
3.  **Liquidity**: How quickly can you get your money back?

## Step-by-Step Action Plan
*   **Step 1**: Evaluate if this matches your current risk tolerance.
*   **Step 2**: Compare different providers (banks, brokers, or platforms).
*   **Step 3**: Start with a small, comfortable amount to test the waters.
*   **Step 4**: Set up an automated reminder or auto-pay to stay consistent.

## Expert Insights for Beginners
Many new investors make the mistake of overcomplicating things. Remember that consistency beats intensity. It is better to invest ₹1,000 every month for 10 years than to invest ₹100,000 once and forget about it.

## Key Takeaways
*   Always read the fine print regarding fees and lock-in periods.
*   Diversify your holdings across multiple categories to stay safe.
*   Think in years, not days or weeks.

Investing is a journey, not a race. By reading this, you are already ahead of 90% of the population!
            `.trim()
        });
    }
    return articles;
};

// --- 3. GENERATE VIDEOS ---
const generateVideos = () => {
    const videos = [];
    const videoData = [
        { id: 'S9WAtS_EOfQ', title: 'Investing for Beginners 101', level: 'beginner' },
        { id: 'f5j9v9j9', title: 'How to Read a Stock Chart', level: 'intermediate' },
        { id: 'dQw4w9WgXcQ', title: 'Advanced Options Trading', level: 'advanced' },
        { id: 'L9L9L9', title: 'Mutual Fund Deep Dive', level: 'beginner' }
    ];

    for (let i = 0; i < 155; i++) {
        const v = rand(videoData);
        videos.push({
            title: `${v.title} - Session ${i+1}`,
            youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
            thumbnail: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
            category: v.level,
            level: v.level,
            duration: '12:45',
            views: '15K',
            advisor: 'Investa Expert'
        });
    }
    return videos;
};

// Write files
const outputDir = path.join(__dirname, 'seed');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(path.join(outputDir, 'investmentIdeas.json'), JSON.stringify(generateInvestmentIdeas(), null, 2));
fs.writeFileSync(path.join(outputDir, 'articles.json'), JSON.stringify(generateArticles(), null, 2));
fs.writeFileSync(path.join(outputDir, 'videos.json'), JSON.stringify(generateVideos(), null, 2));

console.log('✅ 150+ Beginner-Friendly Seed Files Generated Successfully!');
