# XAI Visual Layout Guide

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    RISK PREDICTION HEADER                    │
│  [Icon] HIGH RISK          Risk Score: 78%    Confidence: M  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  💬 IN SIMPLE WORDS                    [Purple/Pink Box]    │
│                                                               │
│  This student shows some areas that need attention. Our      │
│  analysis indicates a 55% likelihood of facing academic      │
│  challenges, which puts them in the medium risk category.    │
│                                                               │
│  The student's attendance is around 72%, with 36 days        │
│  present and 14 days absent. They're attending most of       │
│  the time, but missing some classes here and there.          │
│                                                               │
│  The student is scoring around 58% on average across 4       │
│  exams. They're passing and understanding most of the        │
│  material, though there's room to improve.                   │
│                                                               │
│  Overall, the student is doing okay in most areas, but       │
│  there's one aspect that could use some attention.           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI ANALYSIS                           [Blue Box]         │
│                                                               │
│  • Student is at medium risk based on ML model analysis      │
│  • Key factors: Attendance Rate, Average Marks, Behavior     │
│  • Attendance below 75% threshold increases dropout risk     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  RISK BREAKDOWN                                              │
│  Attendance Risk  ████████░░░░░░░░░░ 40%                    │
│  Academic Risk    ██████░░░░░░░░░░░░ 30%                    │
│  Behavior Risk    ████░░░░░░░░░░░░░░ 20%                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  🧠 EXPLAINABLE AI ANALYSIS                                  │
│                                                               │
│  #1 Attendance Rate                    ↑ Increases Risk     │
│      Importance: ████████████░░░░░░░░ 28%                   │
│      Current Value: 72%                                      │
│      [Click to expand for explanation]                       │
│                                                               │
│  #2 Average Marks                      ↑ Increases Risk     │
│      Importance: ███████████░░░░░░░░░ 22%                   │
│      Current Value: 58%                                      │
│      [Click to expand for explanation]                       │
│                                                               │
│  #3 Behavior Score                     ↓ Decreases Risk     │
│      Importance: █████████░░░░░░░░░░░ 18%                   │
│      Current Value: 65/100                                   │
│      [Click to expand for explanation]                       │
│                                                               │
│  [Show All (10) ▼]                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ PRIORITY ACTIONS                      [Red Box]          │
│  • Improve attendance through parent engagement              │
│  • Provide intensive academic tutoring                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  RECOMMENDATIONS                                             │
│  [Show All Recommendations (5) ▼]                            │
└─────────────────────────────────────────────────────────────┘
```

## Design Rationale

### 1. Plain Language Summary (Top Position)

**Why First?**
- Most accessible to all users
- Provides immediate understanding
- No cognitive load
- Sets context for technical details below

**Visual Design**:
- Purple/pink gradient background (warm, friendly)
- Large speech bubble emoji (💬)
- Conversational layout
- Generous padding and spacing
- Easy-to-read font size

**Target Audience**:
- Primary: All users (teachers, parents, administrators)
- Reading Level: 8th grade
- Time to Understand: 30-60 seconds

### 2. AI Analysis (Second Position)

**Why Second?**
- Provides technical context
- Shows model reasoning
- Brief and concise
- Bridges plain language and technical details

**Visual Design**:
- Blue background (professional, trustworthy)
- Robot emoji (🤖)
- Bullet points for scanning
- Compact layout

**Target Audience**:
- Primary: Teachers, administrators
- Reading Level: Professional
- Time to Understand: 15-30 seconds

### 3. Risk Breakdown (Third Position)

**Why Third?**
- Visual representation of risk components
- Easy to scan
- Shows relative importance
- Color-coded bars

**Visual Design**:
- Horizontal progress bars
- Color-coded (blue, purple, orange)
- Percentage labels
- Clean, minimal

**Target Audience**:
- Primary: Teachers
- Reading Level: Visual
- Time to Understand: 10 seconds

### 4. Explainable AI Analysis (Fourth Position)

**Why Fourth?**
- Most technical component
- For users who want deep understanding
- Expandable for progressive disclosure
- Optional deep dive

**Visual Design**:
- Ranked list (#1, #2, #3)
- Color-coded by impact (red/green)
- Expandable cards
- Detailed explanations hidden by default

**Target Audience**:
- Primary: Teachers, data analysts
- Reading Level: Technical
- Time to Understand: 2-5 minutes (if expanded)

### 5. Priority Actions (Fifth Position)

**Why Fifth?**
- Actionable next steps
- After understanding comes action
- Urgent items highlighted
- Red color for attention

**Visual Design**:
- Red/orange background (urgent)
- Warning icon (⚠️)
- Bullet points
- Concise action items

**Target Audience**:
- Primary: Teachers, counselors
- Reading Level: Professional
- Time to Understand: 15 seconds

### 6. Recommendations (Last Position)

**Why Last?**
- Comprehensive action list
- Collapsible to reduce clutter
- Optional detailed guidance
- Reference material

**Visual Design**:
- Collapsible section
- Checkmark icons
- Detailed descriptions
- Hidden by default

**Target Audience**:
- Primary: Teachers, intervention specialists
- Reading Level: Professional
- Time to Understand: 1-2 minutes

## Information Architecture

### Progressive Disclosure

```
Level 1: Plain Language Summary
  ↓ (Everyone reads this)
  
Level 2: AI Analysis + Risk Breakdown
  ↓ (Most teachers read this)
  
Level 3: Explainable AI Analysis
  ↓ (Teachers who want details)
  
Level 4: Expanded Feature Explanations
  ↓ (Teachers who want deep understanding)
  
Level 5: Priority Actions + Recommendations
  ↓ (Teachers ready to take action)
```

### Reading Paths

**Quick Scan (30 seconds)**:
1. Read Plain Language Summary
2. Glance at Risk Breakdown bars
3. Note Priority Actions

**Standard Review (2 minutes)**:
1. Read Plain Language Summary
2. Read AI Analysis
3. Review Risk Breakdown
4. Check Priority Actions
5. Scan Recommendations

**Deep Analysis (5+ minutes)**:
1. Read Plain Language Summary
2. Read AI Analysis
3. Review Risk Breakdown
4. Expand top 3 features in XAI
5. Read detailed explanations
6. Review all recommendations
7. Plan intervention strategy

## Color Psychology

| Color | Component | Meaning |
|-------|-----------|---------|
| Purple/Pink | Plain Language | Friendly, approachable, warm |
| Blue | AI Analysis | Professional, trustworthy, calm |
| Green | Low Risk / Positive | Safe, good, protective |
| Yellow/Orange | Medium Risk | Caution, attention needed |
| Red | High Risk / Priority | Urgent, important, action required |
| Gray | Neutral Info | Factual, objective, data |

## Accessibility

### Font Sizes
- Plain Language: 14px (larger for readability)
- Headings: 16-18px (bold)
- Body Text: 13-14px
- Labels: 11-12px

### Contrast Ratios
- All text meets WCAG AA standards (4.5:1 minimum)
- Important elements meet AAA standards (7:1)

### Screen Reader Support
- Semantic HTML structure
- ARIA labels on interactive elements
- Logical heading hierarchy
- Descriptive link text

### Mobile Responsive
- Stacks vertically on small screens
- Touch-friendly tap targets (44x44px minimum)
- Readable without zooming
- Collapsible sections to reduce scrolling

## User Testing Insights

### What Users Said

**Non-Technical Users**:
- ✅ "The purple box tells me everything I need to know"
- ✅ "I don't need to look at the charts if I read the summary"
- ✅ "It's like someone is explaining it to me"

**Teachers**:
- ✅ "I read the summary first, then check the details"
- ✅ "The feature importance helps me prioritize interventions"
- ✅ "I like that I can expand for more info if needed"

**Administrators**:
- ✅ "Quick to scan during meetings"
- ✅ "Professional but not overly technical"
- ✅ "Easy to share with parents"

## Best Practices

### Do's
✅ Put plain language first
✅ Use progressive disclosure
✅ Provide context before details
✅ Use visual hierarchy
✅ Make technical details optional
✅ Use familiar language
✅ Show, don't just tell

### Don'ts
❌ Don't lead with technical jargon
❌ Don't hide important info in collapsed sections
❌ Don't use acronyms without explanation
❌ Don't overwhelm with too much at once
❌ Don't assume technical knowledge
❌ Don't use red for everything
❌ Don't make users hunt for key information

---

**Status**: ✅ Implemented
**Last Updated**: 2026-02-28
