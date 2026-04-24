import React, { useState } from 'react';
import {
    Box, Button, Card, CardContent, Typography, LinearProgress,
    Grid, Chip, Stepper, Step, StepLabel, Alert, Snackbar
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

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

const getRecommendation = (answers) => {
    const { experience, risk } = answers;
    if (experience === 'beginner' || risk === 'low') {
        return {
            level: 'Beginner',
            color: '#007DA3',
            description: 'You\'re ready to start your investment journey! We recommend starting with index funds and bonds to build a solid foundation.',
            suggestions: ['S&P 500 Index Fund', 'US Treasury Bonds', 'Dividend Stocks'],
            nextStep: 'Start with our Beginner Investment Guides',
        };
    } else if (experience === 'some_experience' || risk === 'medium') {
        return {
            level: 'Intermediate',
            color: '#00897b',
            description: 'You have a good foundation! Consider diversifying with ETFs, sector funds, and some real estate exposure.',
            suggestions: ['Technology ETF', 'Real Estate REITs', 'Emerging Markets Fund'],
            nextStep: 'Explore our Intermediate Investment Strategies',
        };
    } else {
        return {
            level: 'Advanced',
            color: '#7b1fa2',
            description: 'You\'re an experienced investor! Explore advanced strategies including individual stocks, crypto, and alternative investments.',
            suggestions: ['Small-Cap Value Stocks', 'Cryptocurrency (BTC/ETH)', 'Options Strategies'],
            nextStep: 'Access Advanced Market Analysis Tools',
        };
    }
};

function GuidedJourney({ user }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});

    const currentQ = questions[step];
    const progress = Math.min(Math.round((step / questions.length) * 100), 100);
    const isLast = step === questions.length;
    const isQuestioning = step > 0 && step < questions.length;
    const recommendation = isLast ? getRecommendation(answers) : null;

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
            <PageHeader 
                title="Guided Journey" 
                subtitle="Start your personalized learning and investment roadmap"
                icon={<TrendingUp />}
            />

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
                                                '&:hover': { border: '2px solid #007DA3', bgcolor: '#e6f5fa' },
                                            }}
                                        >
                                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                {selected && <CheckCircle sx={{ color: '#007DA3', mb: 1 }} />}
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
                                sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}
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
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <CheckCircle sx={{ fontSize: 64, color: recommendation.color, mb: 2 }} />
                        <Chip
                            label={`Your Level: ${recommendation.level} Investor`}
                            sx={{ bgcolor: recommendation.color, color: '#fff', fontWeight: 700, fontSize: 15, px: 2, py: 0.5, mb: 2 }}
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
                                    onClick={() => navigate(`/articles?search=${encodeURIComponent(s)}`)}
                                    sx={{ bgcolor: '#e6f5fa', color: '#007DA3', fontWeight: 600, cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: '#007DA3', color: '#fff' } }} 
                                />
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button variant="contained" onClick={() => navigate('/investment-ideas')} sx={{ borderRadius: 2, fontWeight: 700 }}>
                                View Investment Ideas
                            </Button>
                            <Button variant="outlined" onClick={() => navigate('/articles')} sx={{ borderRadius: 2 }}>
                                Read Articles
                            </Button>
                            <Button variant="text" onClick={() => { setStep(0); setAnswers({}); }}>
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
