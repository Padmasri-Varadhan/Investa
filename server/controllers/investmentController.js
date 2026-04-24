const InvestmentIdea = require('../models/InvestmentIdea');

// ─── Rich seed data (auto-inserted if collection is empty) ───────────────────
const dummyIdeas = [
    {
        title: 'S&P 500 Index Fund',
        description: 'Invest in the top 500 US companies through a low-cost index fund. This passive strategy has historically outperformed most actively managed funds over the long term.',
        content: `An S&P 500 index fund is one of the simplest and most powerful investment vehicles available to everyday investors. By purchasing a single fund, you gain proportional ownership in 500 of America's largest publicly-traded companies, spanning every major industry sector.

The beauty of index investing lies in its passive nature. Rather than relying on a fund manager to pick winning stocks — a task most actively managed funds fail to achieve consistently — an index fund simply mirrors the composition of the S&P 500 index. This means dramatically lower expense ratios, often just 0.03–0.10% annually versus 1–2% for active funds.

The historical track record is compelling. Over any 20-year rolling period in US market history, the S&P 500 has delivered positive returns. The long-term average annual return is approximately 10% (7–8% adjusted for inflation). Warren Buffett himself has repeatedly stated that a low-cost S&P 500 index fund is the ideal investment for most Americans.

Dollar-Cost Averaging (DCA) amplifies this strategy further. By investing a fixed amount every month regardless of market conditions, you automatically buy more shares when prices are low and fewer when prices are high — reducing the impact of volatility over time.

This strategy is the cornerstone of any diversified, long-term portfolio. It requires minimal maintenance and provides broad market exposure with built-in diversification across sectors like technology, healthcare, financials, consumer goods, and energy.`,
        riskLevel: 'low',
        expectedReturn: '7-10% annually',
        expectedReturns: '7-10% annually',
        timeHorizon: '5+ years',
        investmentHorizon: 'long_term',
        category: 'index_fund',
        suitableFor: 'all',
        allocation: 40,
        pros: [
            'Instant diversification across 500 large-cap US companies',
            'Very low expense ratios (as low as 0.03%)',
            'Historically outperforms most active fund managers',
            'No stock-picking skill required',
            'Highly liquid — can buy/sell any trading day',
            'Tax-efficient due to low turnover',
        ],
        cons: [
            'No protection during broad market downturns',
            'Returns capped at market average — no alpha potential',
            'US-centric exposure; lacks international diversification unless combined',
            'Short-term volatility can be unsettling for new investors',
        ],
        tags: ['index fund', 'passive investing', 'S&P 500', 'beginner', 'long-term', 'low cost'],
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    },
    {
        title: 'Technology Sector ETF',
        description: 'Gain concentrated exposure to high-growth technology companies through a sector ETF. The tech sector has been a major driver of market returns.',
        content: `Technology Sector ETFs provide concentrated exposure to the companies driving the digital transformation of the global economy. Top holdings typically include mega-cap tech giants like Apple, Microsoft, NVIDIA, Meta, Alphabet, and Amazon — firms with massive network effects, recurring revenue streams, and dominant market positions.

The tech sector has been the single largest driver of US equity market returns over the last decade. The NASDAQ-100, which is heavily weighted toward technology, has averaged over 15% annually in recent years. Sector ETFs like QQQ, XLK, and VGT provide efficient access to this high-growth universe.

However, concentration risk is the key consideration. Because your entire investment is in one sector, poor performance in tech (regulatory headwinds, rising interest rates, valuation compression) affects your entire holding. The sector saw a 33% drawdown in 2022, a sobering reminder of its volatility.

The ideal use case is as a satellite position — perhaps 15–25% of your portfolio — alongside a broad market core. This allows you to express a bullish view on technology's long-term growth without overconcentrating your wealth.

Key sub-sectors within technology ETFs include semiconductors (NVIDIA, AMD, Intel), cloud computing (Microsoft Azure, AWS, Google Cloud), cybersecurity, AI software, and consumer electronics. Some ETFs offer more specific exposure to AI, semiconductors, or software as a service (SaaS).`,
        riskLevel: 'medium',
        expectedReturn: '12-18% annually',
        expectedReturns: '12-18% annually',
        timeHorizon: '3-7 years',
        investmentHorizon: 'medium_term',
        category: 'etf',
        suitableFor: 'some_experience',
        allocation: 20,
        pros: [
            'Exposure to the highest-growth companies in the economy',
            'Strong long-term track record — sector has outperformed the broad market',
            'Diversified within the tech sector — reduces single-stock risk',
            'Liquid and transparent — traded like a stock',
            'Captures AI, cloud, and semiconductor megatrends',
        ],
        cons: [
            'Highly sensitive to interest rate changes (growth stocks are long-duration assets)',
            'Sector concentration risk — vulnerable to regulatory crackdown',
            'Valuation multiples are historically high, limiting margin of safety',
            'Significant drawdowns possible in bear markets',
        ],
        tags: ['ETF', 'technology', 'growth', 'NASDAQ', 'AI', 'cloud', 'semiconductors'],
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    },
    {
        title: 'Dividend Aristocrats Portfolio',
        description: 'Build a portfolio of companies that have consistently increased dividends for 25+ consecutive years — blue-chip stocks providing steady income and resilience.',
        content: `Dividend Aristocrats are S&P 500 companies that have increased their dividend every single year for at least 25 consecutive years. This elite group of roughly 65 companies represents the most financially stable, consistently profitable businesses in the US economy.

The dividend growth track record is the key differentiator. Companies like Johnson & Johnson, Procter & Gamble, Coca-Cola, and Colgate-Palmolive have raised their dividends through recessions, financial crises, and global pandemics. This consistency signals extraordinary financial discipline, strong competitive moats, and durable business models.

The strategy delivers returns through two streams: capital appreciation as the company grows, and a steadily rising dividend income. Dividend reinvestment (DRIP) amplifies compounding significantly — reinvesting dividends to buy more shares accelerates wealth building, particularly over decades.

During market downturns, Dividend Aristocrats have historically held up better than the broad market. Their defensive business models (necessity goods, healthcare, consumer staples) generate reliable cash flows regardless of economic conditions, reducing downside volatility.

A Dividend Aristocrats ETF (like NOBL) is an easy way to access the full basket. Alternatively, building a custom portfolio of 15–20 individual Aristocrats across sectors provides direct ownership and the ability to tailor your income stream.

The yield on the Dividend Aristocrats index typically ranges from 1.8–2.5%, but the growing yield on cost makes this strategy exceptionally powerful over a 10–20 year horizon.`,
        riskLevel: 'low',
        expectedReturn: '5-8% annually + dividends',
        expectedReturns: '5-8% annually + dividends',
        timeHorizon: '5+ years',
        investmentHorizon: 'long_term',
        category: 'stocks',
        suitableFor: 'beginner',
        allocation: 30,
        pros: [
            'Steady, growing passive income stream',
            'Lower volatility than the broad market during downturns',
            'Companies with proven financial discipline and durable competitive moats',
            'Dividend reinvestment (DRIP) amplifies compounding over time',
            'Inflation protection — dividend growth often exceeds inflation',
        ],
        cons: [
            'Lower growth potential compared to high-growth tech or small-cap stocks',
            'Sector concentration in consumer staples, healthcare, industrials',
            'Rising interest rates can make dividend stocks less attractive versus bonds',
            'Individual selection requires fundamental analysis skills',
        ],
        tags: ['dividend', 'income investing', 'blue chip', 'defensive', 'DRIP', 'passive income'],
        imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    },
    {
        title: 'Global Real Estate (REIT)',
        description: 'Invest in a diversified basket of Real Estate Investment Trusts for exposure to commercial real estate without directly owning property.',
        content: `Real Estate Investment Trusts (REITs) democratize access to commercial real estate — an asset class that was previously only accessible to wealthy investors and institutions. By law, REITs must distribute at least 90% of their taxable income to shareholders as dividends, making them one of the highest-yielding investment vehicles available.

REITs own and operate income-generating properties: office buildings, shopping centers, apartment complexes, data centers, cell towers, warehouses, hospitals, and hotels. Each segment has different demand drivers and risk profiles. For example, data center REITs (like Equinix and Digital Realty) benefit from the explosive growth of cloud computing and AI, while residential REITs benefit from housing supply shortages.

Global REIT ETFs (like VNQ for US or VNQI for international) provide instant diversification across dozens of property types and geographies. This eliminates the concentration risk of owning individual properties and removes the management headaches of direct real estate ownership.

The yield advantage of REITs is significant. US REITs have historically yielded 3–5% in dividends, substantially higher than the S&P 500's ~1.5% yield. Combined with property appreciation over time, total returns have historically rivaled the stock market.

One critical consideration: REITs are interest-rate sensitive. When rates rise, REIT prices tend to fall (higher rates increase borrowing costs and make the dividend yield relatively less attractive). This was evident in 2022 when REITs sold off sharply. However, over long periods, the income and appreciation combination has delivered excellent risk-adjusted returns.`,
        riskLevel: 'medium',
        expectedReturn: '6-10% annually',
        expectedReturns: '6-10% annually',
        timeHorizon: '5-10 years',
        investmentHorizon: 'long_term',
        category: 'real_estate',
        suitableFor: 'all',
        allocation: 15,
        pros: [
            'High dividend yields (3–5%), significantly above broad market average',
            'Real estate exposure without property management responsibilities',
            'Mandatory 90% income distribution provides reliable cash flows',
            'Inflation hedge — rents and property values tend to rise with inflation',
            'Diversification benefit — low correlation with stocks and bonds',
        ],
        cons: [
            'Highly sensitive to interest rate increases',
            'Dividend income is taxed as ordinary income (not at lower dividend rate)',
            'Sector-specific risks (e.g., retail REITs hurt by e-commerce)',
            'Less liquidity than direct property ownership can imply — price can be volatile',
        ],
        tags: ['REIT', 'real estate', 'passive income', 'dividends', 'property', 'inflation hedge'],
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    },
    {
        title: 'Emerging Markets Fund',
        description: 'Tap into the growth potential of developing economies in Asia, Latin America, and Africa — higher risk with potentially higher rewards.',
        content: `Emerging markets encompass rapidly developing economies including China, India, Brazil, Taiwan, South Korea, and many others. These nations are characterized by younger populations, growing middle classes, rapid urbanization, and accelerating adoption of technology and financial services.

The theoretical case for emerging market investing is compelling: GDP growth rates in these countries often run 2–3x higher than developed markets, and as their economies mature, their stock markets should generate superior returns. India, for example, is projected to become the world's third-largest economy by 2030.

In practice, the reality is more complex. Emerging markets carry significant additional risks: political instability, currency devaluation, regulatory unpredictability, accounting transparency issues, and governance concerns. China's regulatory crackdowns on tech companies in 2021 wiped out hundreds of billions in market value — a stark reminder of these risks.

Currency risk is a major factor often overlooked by first-time EM investors. Even if the local market performs well, a weakening local currency against the US dollar can erase those gains. Funds denoted in USD partially mitigate this through hedging, but not completely.

The recommended approach is a 5–15% allocation as a satellite position — enough to meaningfully benefit if EM outperforms, but not so much that underperformance devastates your portfolio. Diversified EM ETFs (like VWO, EEM, or IEMG) spread risk across dozens of countries and hundreds of companies, preventing overconcentration in any single market.`,
        riskLevel: 'high',
        expectedReturn: '10-20% annually',
        expectedReturns: '10-20% annually',
        timeHorizon: '7-10 years',
        investmentHorizon: 'long_term',
        category: 'etf',
        suitableFor: 'experienced',
        allocation: 10,
        pros: [
            'Access to higher GDP growth rates than developed markets',
            'Diversification beyond US/Europe market cycles',
            'Demographic tailwinds — young, growing populations driving consumption',
            'Undervalued relative to US markets on traditional metrics',
            'Potential for significant outperformance during bull cycles',
        ],
        cons: [
            'High political and regulatory risk — government actions can devastate returns',
            'Currency devaluation can erode USD returns even when local markets perform',
            'Lower corporate governance standards and accounting transparency',
            'More volatile and less liquid than developed market equivalents',
            'Long periods of underperformance relative to US markets (e.g., 2010–2020)',
        ],
        tags: ['emerging markets', 'developing countries', 'India', 'China', 'high growth', 'diversification'],
        imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    },
    {
        title: 'US Treasury Bond Ladder',
        description: 'Create a series of US Treasury bonds with staggered maturity dates to provide predictable income while managing interest rate risk.',
        content: `A bond ladder is a portfolio of individual bonds with different maturity dates — for example, bonds maturing in 1, 2, 3, 4, and 5 years respectively. As each bond matures, the principal is reinvested in a new long-dated bond, maintaining the ladder structure. This strategy provides predictable income, liquidity at regular intervals, and natural protection against interest rate risk.

US Treasury bonds are backed by the full faith and credit of the US federal government — making them the safest investment in the world (in nominal USD terms). They have never defaulted. This makes them the ideal instrument for capital preservation with income.

The interest rate risk management benefit of a ladder is elegant: in a rising rate environment, maturing bonds are reinvested at higher yields, automatically increasing your income. In a falling rate environment, longer-dated bonds in the ladder appreciate in value. No active management decisions required.

In the current environment (2024–2025 with rates at multi-decade highs), Treasury bonds offer yields of 4–5%, providing an attractive risk-free return. Short-term T-bills (3–6 months) offer similar yields with virtually no duration risk, representing exceptional value for cash management.

Treasury Inflation-Protected Securities (TIPS) are a variation worth considering — these bonds adjust their principal with CPI inflation, ensuring your purchasing power is maintained. They're particularly valuable in inflationary environments.

Building a ladder through TreasuryDirect.gov eliminates fees entirely. Alternatively, Treasury ETFs (like IEI, IEF, TLT) provide easy access but sacrifice the maturity certainty of individual bonds.`,
        riskLevel: 'low',
        expectedReturn: '3-5% annually',
        expectedReturns: '3-5% annually',
        timeHorizon: '1-10 years',
        investmentHorizon: 'medium_term',
        category: 'bonds',
        suitableFor: 'beginner',
        allocation: 25,
        pros: [
            'Backed by the US government — zero default risk in nominal terms',
            'Predictable, scheduled income payments (semi-annual coupons)',
            'Natural interest rate risk management through staggered maturities',
            'Highly liquid — can sell on secondary market if needed',
            'Current yields (4–5%) are at decade highs — excellent entry point',
        ],
        cons: [
            'Returns lag equities over long time horizons',
            'Inflation risk — fixed coupon loses purchasing power if CPI rises above yield',
            'Bond prices fall when interest rates rise (inverse relationship)',
            'Requires more active management than a simple bond fund',
        ],
        tags: ['bonds', 'treasury', 'fixed income', 'capital preservation', 'income', 'low risk'],
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    },
    {
        title: 'Small-Cap Value Stocks',
        description: 'Invest in smaller companies trading below their intrinsic value. Small-cap value has historically delivered premium returns over large-cap growth.',
        content: `Small-cap value investing combines two of the most consistently rewarded factors in academic finance research: the size premium (small companies outperform large companies over time) and the value premium (cheap stocks outperform expensive ones). Together, these factors have historically produced significant alpha over the broad market.

The academic foundation comes from the Fama-French Three-Factor Model and decades of empirical research showing that small-cap value stocks have outperformed large-cap growth stocks by 2–4% annually over long periods — a premium that has persisted across geographies and time periods.

The intuition: small companies have more room to grow, and value companies are often underpriced relative to their fundamental worth due to investor pessimism, neglect, or temporary headwinds. When sentiment turns, the combination of improving fundamentals and rerating higher creates powerful return potential.

However, the small-cap value premium requires patience. It doesn't outperform every year — often it lags for years at a stretch (as it did relative to US large-cap growth from 2010–2020). Investors must have sufficient conviction and time horizon (7+ years ideally) to capture the premium.

Practical implementation: ETFs like VBR (Vanguard Small-Cap Value ETF), IJS (iShares S&P Small-Cap 600 Value), or AVUV (Avantis US Small Cap Value) provide diversified exposure. Individual stock picking in small-caps is rewarding but requires substantial research capabilities.

Position sizing matters: given the higher volatility of small-caps, limit this allocation to 10–20% of your equity portfolio and maintain a long time horizon.`,
        riskLevel: 'high',
        expectedReturn: '12-20% annually',
        expectedReturns: '12-20% annually',
        timeHorizon: '5+ years',
        investmentHorizon: 'long_term',
        category: 'stocks',
        suitableFor: 'experienced',
        allocation: 15,
        pros: [
            'Historically proven size and value factor premiums over full market cycles',
            'Less analyst coverage creates opportunities for mispriced stocks',
            'Greater potential for acquisition targets at premium to market price',
            'More room to grow compared to large-cap companies',
            'ETF-based implementation provides diversification at low cost',
        ],
        cons: [
            'Higher volatility and larger drawdowns compared to large-cap benchmarks',
            'Factor premiums can go unrewarded for extended periods (multi-year)',
            'Less liquidity — bid-ask spreads higher for individual small-cap stocks',
            'More vulnerable to economic recessions and credit tightening',
        ],
        tags: ['small cap', 'value investing', 'factor investing', 'contrarian', 'growth'],
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    },
    {
        title: 'Bitcoin & Ethereum Core Position',
        description: 'Allocate a small percentage of your portfolio to the two largest cryptocurrencies as a speculative hedge and digital asset exposure.',
        content: `Bitcoin and Ethereum represent the two most established and liquid digital assets in the cryptocurrency ecosystem. While the crypto space includes thousands of tokens, Bitcoin and Ethereum account for over 60% of total market capitalization and occupy fundamentally different roles.

Bitcoin is increasingly positioned as "digital gold" — a scarce, decentralized store of value with a fixed supply of 21 million coins. Institutional adoption has accelerated dramatically with the approval of Bitcoin spot ETFs (BlackRock iShares, Fidelity, etc.) in January 2024, bringing mainstream financial legitimacy. Bitcoin's 4-year halving cycle (where block rewards are cut in half) has historically preceded major bull markets.

Ethereum is the world's leading programmable blockchain platform, hosting the majority of decentralized finance (DeFi), non-fungible tokens (NFTs), and smart contract applications. Its transition to Proof-of-Stake consensus (The Merge, 2022) dramatically reduced its energy consumption and introduced deflationary tokenomics — ETH is now "burned" with each transaction.

Portfolio allocation theory suggests 1–5% in crypto provides meaningful return potential without catastrophic downside to overall wealth. At 3% allocation, even an 80% drawdown (which crypto has experienced) reduces total portfolio value by only 2.4% — containing the damage while allowing for asymmetric upside.

Risk management is paramount: use hardware wallets (Ledger, Trezor) for long-term storage rather than exchange custody, never invest money you cannot afford to lose entirely, and be psychologically prepared for 50–80% drawdowns at any time. Dollar-cost averaging is strongly recommended over lump-sum entry.

With Bitcoin ETFs now available through traditional brokerages, investors can access BTC without managing private keys, making the strategy accessible to a broader audience.`,
        riskLevel: 'high',
        expectedReturn: '20-100%+ or significant loss',
        expectedReturns: '20-100%+ or significant loss',
        timeHorizon: '3-5+ years',
        investmentHorizon: 'medium_term',
        category: 'crypto',
        suitableFor: 'experienced',
        allocation: 5,
        pros: [
            'Asymmetric upside potential — small allocation can generate outsized returns',
            'Bitcoin is non-correlated with traditional assets in some market regimes',
            'Institutional adoption is accelerating (Bitcoin ETFs approved in the US)',
            'Fixed Bitcoin supply (21M coins) provides built-in scarcity',
            'Ethereum network generates real economic activity and fee revenue',
        ],
        cons: [
            'Extreme volatility — 50–80% drawdowns are historically common',
            'Regulatory risk: governments could restrict or ban crypto activity',
            'Technological risk: protocol flaws, hacks, or smart contract bugs',
            'No cash flows or intrinsic value — entirely sentiment-driven price discovery',
            'Ecosystem fragmentation — thousands of competing projects dilute attention',
        ],
        tags: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'digital assets', 'speculative', 'DeFi'],
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    },
];

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Get all investment ideas (seeds data if collection empty)
 * @route   GET /api/investment-ideas
 * @access  Public
 */
const getInvestmentIdeas = async (req, res) => {
    try {
        const { riskLevel, suitableFor, search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        if (riskLevel) query.riskLevel = riskLevel;

        let ideas = await InvestmentIdea.find(query).sort({ createdAt: -1 });

        // Auto-seed on first run
        if (ideas.length === 0 && !search && !riskLevel && !suitableFor) {
            ideas = await InvestmentIdea.insertMany(dummyIdeas);
        }

        // Client-side suitability filter (supports 'all' logic)
        if (suitableFor) {
            ideas = ideas.filter(
                (idea) => idea.suitableFor === suitableFor || idea.suitableFor === 'all'
            );
        }

        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get a single investment idea by ID (includes related ideas)
 * @route   GET /api/investment-ideas/:id
 * @access  Public
 */
const getIdeaById = async (req, res) => {
    try {
        const idea = await InvestmentIdea.findById(req.params.id);
        if (!idea) return res.status(404).json({ message: 'Investment idea not found' });

        // Fetch related ideas: same category or overlapping tags, excluding this one
        const related = await InvestmentIdea.find({
            _id: { $ne: idea._id },
            $or: [
                { category: idea.category },
                { tags: { $in: idea.tags.length ? idea.tags : [''] } },
            ],
        })
            .limit(3)
            .select('title description riskLevel expectedReturn timeHorizon category allocation tags imageUrl');

        res.json({ idea, related });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getInvestmentIdeas, getIdeaById };
