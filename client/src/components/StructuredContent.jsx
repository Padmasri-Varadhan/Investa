import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Maps section heading text → a visual accent color/icon for premium cards
 */
const SECTION_META = {
    'overview':              { icon: '📋', color: '#007DA3' },
    'beginner explanation':  { icon: '🌱', color: '#2e7d32' },
    'key concepts':          { icon: '💡', color: '#6d4c41' },
    'advantages':            { icon: '✅', color: '#1565c0' },
    'risks':                 { icon: '⚠️',  color: '#c62828' },
    'examples':              { icon: '📊', color: '#6a1b9a' },
    'tips':                  { icon: '🎯', color: '#e65100' },
    'conclusion':            { icon: '🏁', color: '#004d40' },
    // Strategy / Idea variants
    'strategy overview':     { icon: '🗺️',  color: '#007DA3' },
    'execution plan':        { icon: '⚙️',  color: '#1565c0' },
    'risk management':       { icon: '🛡️',  color: '#c62828' },
    'target allocation':     { icon: '🎯', color: '#e65100' },
};

const getSectionMeta = (heading) => {
    const key = heading.toLowerCase().trim();
    return SECTION_META[key] || { icon: '📌', color: '#007DA3' };
};

/**
 * Renders a single paragraph that may contain **bold** inline markers.
 */
const RichParagraph = ({ text, sx = {} }) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <Typography
            variant="body1"
            sx={{ color: '#374151', lineHeight: 1.9, fontSize: '1.05rem', mb: 2, ...sx }}
        >
            {parts.map((part, k) =>
                part.startsWith('**') && part.endsWith('**')
                    ? <Box component="span" key={k} sx={{ fontWeight: 700, color: '#111827' }}>{part.slice(2, -2)}</Box>
                    : part
            )}
        </Typography>
    );
};

/**
 * Renders a bullet list block.
 */
const BulletList = ({ text }) => (
    <Box sx={{ mb: 3, pl: 1 }}>
        {text.split('\n').filter(l => l.trim()).map((item, j) => {
            const cleanItem = item.replace(/^-\s*/, '').trim();
            const parts = cleanItem.split(/(\*\*.*?\*\*)/g);
            return (
                <Box key={j} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
                    <Box component="span" sx={{ color: '#007DA3', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1.7, flexShrink: 0 }}>•</Box>
                    <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.8, fontSize: '1.05rem' }}>
                        {parts.map((part, k) =>
                            part.startsWith('**') && part.endsWith('**')
                                ? <Box component="span" key={k} sx={{ fontWeight: 700, color: '#111827' }}>{part.slice(2, -2)}</Box>
                                : part
                        )}
                    </Typography>
                </Box>
            );
        })}
    </Box>
);

/**
 * Main StructuredContent component.
 * Parses the `content` string (Markdown-lite) and renders premium UI blocks.
 *
 * Props:
 *  - content: string  (the fullContent / detailedContent from MongoDB)
 *  - accentColor: string (optional, default '#007DA3')
 */
const StructuredContent = ({ content, accentColor = '#007DA3' }) => {
    if (!content) {
        return (
            <Typography variant="body1" sx={{ color: '#9CA3AF', fontStyle: 'italic' }}>
                Content coming soon...
            </Typography>
        );
    }

    const blocks = content.split('\n\n').filter(b => b.trim());
    const sections = [];
    let currentSection = null;

    blocks.forEach(block => {
        const trimmed = block.trim();

        if (trimmed.startsWith('## ')) {
            // H2 = major section heading — start a new visual card section
            if (currentSection) sections.push(currentSection);
            const title = trimmed.replace(/^## /, '').trim();
            const meta = getSectionMeta(title);
            currentSection = { type: 'section', title, meta, blocks: [] };
        } else if (trimmed.startsWith('### ')) {
            // H3 = sub-heading inside a section
            const title = trimmed.replace(/^### /, '').trim();
            const meta = getSectionMeta(title);
            if (!currentSection) {
                currentSection = { type: 'section', title: '', meta: { icon: '📌', color: accentColor }, blocks: [] };
            }
            currentSection.blocks.push({ type: 'h3', title, meta });
        } else if (trimmed.startsWith('- ')) {
            if (!currentSection) {
                currentSection = { type: 'section', title: '', meta: { icon: '📌', color: accentColor }, blocks: [] };
            }
            currentSection.blocks.push({ type: 'bullets', text: trimmed });
        } else {
            if (!currentSection) {
                currentSection = { type: 'section', title: '', meta: { icon: '📌', color: accentColor }, blocks: [] };
            }
            currentSection.blocks.push({ type: 'paragraph', text: trimmed });
        }
    });

    if (currentSection) sections.push(currentSection);

    return (
        <Box>
            {sections.map((section, i) => (
                <Box
                    key={i}
                    sx={{
                        mb: 5,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #F3F4F6',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                >
                    {/* Section Header */}
                    {section.title && (
                        <Box
                            sx={{
                                px: 4,
                                py: 2.5,
                                background: `linear-gradient(135deg, ${section.meta.color}12 0%, ${section.meta.color}06 100%)`,
                                borderBottom: `2px solid ${section.meta.color}22`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box component="span" sx={{ fontSize: '1.4rem', lineHeight: 1 }}>
                                {section.meta.icon}
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 900,
                                    color: section.meta.color,
                                    letterSpacing: '-0.025em',
                                    fontSize: { xs: '1.05rem', md: '1.2rem' },
                                }}
                            >
                                {section.title}
                            </Typography>
                        </Box>
                    )}

                    {/* Section Body */}
                    <Box sx={{ px: { xs: 3, md: 4 }, py: 3 }}>
                        {section.blocks.map((block, j) => {
                            if (block.type === 'h3') {
                                return (
                                    <Typography
                                        key={j}
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 800,
                                            color: block.meta.color || '#1F2937',
                                            mt: j > 0 ? 3 : 0,
                                            mb: 1.5,
                                            fontSize: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Box component="span">{block.meta.icon}</Box>
                                        {block.title}
                                    </Typography>
                                );
                            }
                            if (block.type === 'bullets') {
                                return <BulletList key={j} text={block.text} />;
                            }
                            return <RichParagraph key={j} text={block.text} />;
                        })}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default StructuredContent;
