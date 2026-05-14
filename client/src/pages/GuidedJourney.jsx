import React, { useState, useEffect } from 'react';
import {
    Box, Button, Card, CardContent, Typography, LinearProgress,
    Grid, Chip, Stepper, Step, StepLabel, Alert, Snackbar
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, TrendingUp, Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getInvestmentIdeas } from '../services/api';

/**
 * Guided Journey Page
 * Multi-step questionnaire to determine user's investment profile
 */

const steps = ['Welcome', 'Experience', 'Goals', 'Risk Tolerance', 'Time Horizon', 'Result'];

const questions = [
    {
        id: 0,
        title: 'Welcome to Your Guided Journey!',
        subtitle: 'Answer a few questions to get your personalized investment plan',
        type: 'info',
    },
    {
        id: 1,
        title: "What's Your Investment Experience?",
        subtitle: 'Help us understand your background so we can personalize your journey',
        type: 'choice',
        options: [
            { label: 'Complete Beginner', sublabel: 'Never invested before', value: 'beginner' },
            { label: 'Some Experience', sublabel: 'Made a few investments', value: 'some_experience' },
            { label: 'Experienced', sublabel: 'Regular investor', value: 'experienced' },
        ],
    },
    {
        id: 2,
        title: "What's Your Primary Investment Goal?",
        subtitle: 'Select the goal that best describes your financial objectives',
        type: 'choice',
        options: [
            { label: 'Build Emergency Fund', sublabel: 'Safety net for unexpected costs', value: 'emergency' },
            { label: 'Grow Wealth Long-term', sublabel: 'Build wealth over 10+ years', value: 'wealth' },
            { label: 'Generate Passive Income', sublabel: 'Regular income from investments', value: 'income' },
        ],
    },
    {
        id: 3,
        title: "What's Your Risk Tolerance?",
        subtitle: 'How comfortable are you with potential investment losses?',
        type: 'choice',
        options: [
            { label: 'Conservative', sublabel: 'Prefer safety over high returns', value: 'low' },
            { label: 'Moderate', sublabel: 'Balance between risk and return', value: 'medium' },
            { label: 'Aggressive', sublabel: 'Comfortable with high volatility for high returns', value: 'high' },
        ],
    },
    {
        id: 4,
        title: 'What Is Your Investment Time Horizon?',
        subtitle: 'How long do you plan to keep your money invested?',
        type: 'choice',
        options: [
            { label: 'Short-term', sublabel: 'Less than 2 years', value: 'short' },
            { label: 'Medium-term', sublabel: '2–7 years', value: 'medium' },
            { label: 'Long-term', sublabel: '7+ years', value: 'long' },
        ],
    },
];

const getRecommendation = (answers, ideasPool = []) => {
    const { experience, risk } = answers;
    
    let level, color, description, nextStep;
    let minCount, maxCount;
    let targetRisk;

    if (experience === 'beginner' || risk === 'low') {
        level = 'Beginner';
        color = '#007DA3';
        description = 'You\'re ready to start your investment journey! We recommend starting with index funds and bonds to build a solid foundation.';
        nextStep = 'Start with our Beginner Investment Guides';
        minCount = 3;
        maxCount = 5;
        targetRisk = 'low';
    } else if (experience === 'some_experience' || risk === 'medium') {
        level = 'Intermediate';
        color = '#00897b';
        description = 'You have a good foundation! Consider diversifying with ETFs, sector funds, and some real estate exposure.';
        nextStep = 'Explore our Intermediate Investment Strategies';
        minCount = 5;
        maxCount = 7;
        targetRisk = 'medium';
    } else {
        level = 'Advanced';
        color = '#7b1fa2';
        description = 'You\'re an experienced investor! Explore advanced strategies including individual stocks, crypto, and alternative investments.';
        nextStep = 'Access Advanced Market Analysis Tools';
        minCount = 7;
        maxCount = 10;
        targetRisk = 'high';
    }

    // Dynamic suggestions logic
    let pool = [...ideasPool];
    
    // Sort logic: 
    // 1. Matches target risk level
    const scoredPool = pool.map(idea => {
        let score = 0;
        // Simple score based on risk match
        if (idea.riskLevel === targetRisk) score += 10;
        
        return { ...idea, score };
    });

    // Sort by score descending
    scoredPool.sort((a, b) => b.score - a.score);

    // Pick top suggestions (titles only)
    const suggestions = scoredPool
        .slice(0, Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount)
        .map(i => i.title);

    // Fallback if pool is empty
    const fallbackSuggestions = {
        'Beginner': ['S&P 500 Index Fund', 'US Treasury Bond Ladder', 'Dividend Aristocrats Portfolio'],
        'Intermediate': ['Technology Sector ETF', 'Global Real Estate (REIT)', 'Emerging Markets Fund', 'Sustainable ESG Fund', 'Global Healthcare ETF'],
        'Advanced': ['Small-Cap Value Stocks', 'Bitcoin & Ethereum Core Position', 'Options Strategies', 'AI & Robotics Growth Fund', 'Emerging Tech Venture Fund']
    };

    return {
        level,
        color,
        description,
        suggestions: suggestions.length > 0 ? suggestions : fallbackSuggestions[level],
        nextStep,
    };
};

function GuidedJourney({ user }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(() => {
        const saved = localStorage.getItem('investa_guided_journey');
        return saved ? JSON.parse(saved).step : 0;
    });
    const [answers, setAnswers] = useState(() => {
        const saved = localStorage.getItem('investa_guided_journey');
        return saved ? JSON.parse(saved).answers : {};
    });

    const [ideas, setIdeas] = useState([]);

    useEffect(() => {
        localStorage.setItem('investa_guided_journey', JSON.stringify({ step, answers }));
    }, [step, answers]);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const res = await getInvestmentIdeas({ limit: 100 }); // Fetch enough ideas for the pool
                setIdeas(res.data.data || []);
            } catch (err) {
                console.error("Error fetching ideas for navigation:", err);
            }
        };
        fetchIdeas();
    }, []);

    const handleRecommendationClick = (suggestion) => {
        const match = ideas.find(i => i.title.toLowerCase() === suggestion.toLowerCase());
        if (match) {
            navigate(`/idea/${match._id}`);
        } else {
            // Fallback to search in investment ideas
            navigate(`/investment-ideas?search=${encodeURIComponent(suggestion)}`);
        }
    };

    const currentQ = questions[step];
    const recommendation = getRecommendation(answers, ideas);
    const progress = Math.min(Math.round((step / questions.length) * 100), 100);
    const isLast = step === questions.length;
    const isQuestioning = step > 0 && step < questions.length;

    const handleSelect = (key, value) => {
        setAnswers((prev) => ({ ...prev, [key]: value }));
    };

    const handleNext = () => {
        if (step < questions.length) setStep((s) => s + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep((s) => s - 1);
    };

    const keys = ['', 'experience', 'goal', 'risk', 'horizon'];

    return (
        <Box className="fade-in" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto', pb: 6 }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    fontWeight: 900, 
                    color: '#007DA3',
                    mb: 4,
                    letterSpacing: -1,
                    fontSize: { xs: '1.75rem', md: '2.5rem' }
                }}
            >
                Guided Journey
            </Typography>

            {/* Intro Card */}
            {step === 0 && (
                <Card sx={{ mb: 3, textAlign: 'center', p: 2 }}>
                    <CardContent>
                        <Typography variant="h5" fontWeight={800} mb={1}>Learn · Invest · Grow</Typography>
                        <Typography variant="body1" color="text.secondary" mb={4} maxWidth={480} mx="auto">
                            Your personalized investment journey begins here. Answer a few questions to get tailored recommendations.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
                            {[
                                { value: '50+', label: 'Investment Guides' },
                                { value: '10K+', label: 'Active Learners' },
                                { value: '4.8★', label: 'User Rating' },
                            ].map((s) => (
                                <Box key={s.label} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, px: 3, py: 1.5, textAlign: 'center' }}>
                                    <Typography variant="h6" fontWeight={800} color="primary">{s.value}</Typography>
                                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Button variant="contained" size="large" endIcon={<ArrowForward />} onClick={handleNext}
                            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}>
                            Start Learning
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Questionnaire Steps */}
            {isQuestioning && (
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        {/* Progress */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" fontWeight={600} color="text.secondary">
                                Step {step} of {questions.length - 1}
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="primary">{progress}% complete</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate" value={progress}
                            sx={{ height: 8, borderRadius: 4, mb: 3, bgcolor: '#e0e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#007DA3' } }}
                        />

                        <Typography variant="h6" fontWeight={700} textAlign="center" mb={0.5}>{currentQ.title}</Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>{currentQ.subtitle}</Typography>

                        {/* Options */}
                        <Grid container spacing={2} justifyContent="center">
                            {currentQ.options?.map((opt) => {
                                const key = keys[step];
                                const selected = answers[key] === opt.value;
                                return (
                                    <Grid item xs={12} sm={4} key={opt.value}>
                                        <Card
                                            onClick={() => handleSelect(key, opt.value)}
                                            sx={{
                                                cursor: 'pointer', border: selected ? '2px solid #007DA3' : '2px solid #e0e8f0',
                                                bgcolor: selected ? '#e6f5fa' : '#fff',
                                                transition: 'all 0.2s',
                                                position: 'relative',
                                                '&:hover': { border: '2px solid #007DA3', bgcolor: '#e6f5fa' },
                                            }}
                                        >
                                            {selected && (
                                                <Check 
                                                    sx={{ 
                                                        color: '#007DA3', 
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        fontSize: 24,
                                                        fontWeight: 900
                                                    }} 
                                                />
                                            )}
                                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                                <Typography variant="subtitle1" fontWeight={700} color="primary">{opt.label}</Typography>
                                                <Typography variant="caption" color="text.secondary">{opt.sublabel}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Navigation */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ color: '#546e7a' }}>
                                Previous
                            </Button>
                            <Button
                                variant="contained" endIcon={<ArrowForward />} onClick={handleNext}
                                disabled={!answers[keys[step]]}
                                sx={{ 
                                    px: 4, 
                                    borderRadius: 2, 
                                    fontWeight: 700,
                                    bgcolor: '#007DA3',
                                    '&:hover': { bgcolor: '#005b7a' }
                                }}
                            >
                                NEXT
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Result */}
            {isLast && recommendation && (
                <Card>
                    <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 3 }}>
                            <CheckCircle sx={{ fontSize: 72, color: '#008000' }} />
                        </Box>
                        <Chip
                            label={`Your Level: ${recommendation.level} Investor`}
                            sx={{ bgcolor: '#008000', color: '#fff', fontWeight: 700, fontSize: 16, px: 3, py: 2.5, mb: 3, borderRadius: '12px' }}
                        />
                        <Typography variant="h6" fontWeight={700} mb={1}>Your Personalized Investment Plan is Ready!</Typography>
                        <Typography variant="body2" color="text.secondary" mb={4} maxWidth={500} mx="auto">
                            {recommendation.description}
                        </Typography>

                        <Typography variant="subtitle1" fontWeight={700} mb={2}>Recommended Investments</Typography>
                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
                            {recommendation.suggestions.map((s) => (
                                <Chip 
                                    key={s} 
                                    label={s} 
                                    onClick={() => handleRecommendationClick(s)}
                                    sx={{ bgcolor: '#e6f5fa', color: '#007DA3', fontWeight: 600, cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: '#007DA3', color: '#fff' } }} 
                                />
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate('/investment-ideas')} 
                                sx={{ 
                                    borderRadius: 3, 
                                    fontWeight: 700, 
                                    bgcolor: '#007DA3',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { bgcolor: '#005b7a' }
                                }}
                            >
                                View Investment Ideas
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate('/articles')} 
                                sx={{ 
                                    borderRadius: 3, 
                                    fontWeight: 700, 
                                    bgcolor: '#007DA3',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { bgcolor: '#005b7a' }
                                }}
                            >
                                Read Articles
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => { 
                                    setStep(0); 
                                    setAnswers({}); 
                                    localStorage.removeItem('investa_guided_journey');
                                }}
                                sx={{ 
                                    borderRadius: 3, 
                                    fontWeight: 700, 
                                    bgcolor: '#007DA3',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { bgcolor: '#005b7a' }
                                }}
                            >
                                Retake Journey
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}

export default GuidedJourney;
