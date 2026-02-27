# Plain Language Summary Examples

## Purpose

The Plain Language Summary translates technical risk predictions into simple, human-friendly explanations that anyone can understand - teachers, parents, administrators, or counselors.

## Design Principles

1. **No Jargon**: Use everyday words, not technical terms
2. **Tell, Don't Suggest**: Explain what IS, not what SHOULD BE
3. **Conversational**: Write like you're talking to a colleague
4. **Contextual**: Adapt language to the situation
5. **Respectful**: Professional but warm tone

## Example Scenarios

### Scenario 1: Low Risk Student (Doing Well)

**Data**:
- Risk Score: 15%
- Attendance: 92%
- Average Marks: 78%
- Behavior Score: 85/100
- Days Present: 46, Days Absent: 4
- Exams: 5 completed

**Plain Language Output**:

> This student is doing well overall. Our analysis shows a 15% likelihood of facing academic challenges, which is considered low risk. This means the student is generally on track with their education.
>
> The student has been coming to school regularly - about 92% of the time. They've been present for 46 days, which shows good commitment to attending classes.
>
> Academically, the student is performing well with an average of 78% across 5 exams. They're understanding the material and doing good work.
>
> In terms of behavior, the student is doing great with a score of 85 out of 100. They've had 3 positive recognitions, showing they're engaged and following expectations.
>
> Overall, the student is managing well across attendance, academics, and behavior. They're engaged with their education and showing up consistently.

---

### Scenario 2: Medium Risk Student (Some Concerns)

**Data**:
- Risk Score: 55%
- Attendance: 72%
- Average Marks: 58%
- Behavior Score: 65/100
- Days Present: 36, Days Absent: 14
- Exams: 4 completed
- Negative Incidents: 2

**Plain Language Output**:

> This student shows some areas that need attention. Our analysis indicates a 55% likelihood of facing academic challenges, which puts them in the medium risk category. This means there are a few concerns, but nothing critical yet.
>
> The student's attendance is around 72%, with 36 days present and 14 days absent. They're attending most of the time, but missing some classes here and there.
>
> The student is scoring around 58% on average across 4 exams. They're passing and understanding most of the material, though there's room to improve.
>
> The student's behavior is mostly okay with a score of 65 out of 100. There have been 2 incidents noted, but nothing too serious. They generally follow expectations.
>
> Overall, the student is doing okay in most areas, but there's one aspect that could use some attention. Addressing this early can help keep them on track.

---

### Scenario 3: High Risk Student (Multiple Challenges)

**Data**:
- Risk Score: 78%
- Attendance: 58%
- Average Marks: 42%
- Behavior Score: 48/100
- Days Present: 29, Days Absent: 21
- Exams: 3 completed
- Negative Incidents: 5

**Plain Language Output**:

> This student needs support in several areas. Our analysis shows a 78% likelihood of facing serious academic challenges, placing them in the high risk category. This means multiple factors are affecting their education.
>
> The student has been absent quite a bit - only attending about 58% of the time. Out of the tracked period, they were present for 29 days but missed 21 days. This means they're missing a lot of what happens in class.
>
> The student's exam scores average around 42% across 3 exams. They're just getting by, which suggests they might be struggling to keep up with some of the coursework.
>
> The student has had some behavioral challenges, with a score of 48 out of 100. There have been 5 incidents recorded, suggesting they're having trouble following expectations or staying focused.
>
> Overall, the student is facing challenges in a couple of areas. These issues are connected - when one area struggles, it often affects the others. That's why the risk level is elevated.

---

### Scenario 4: Critical Risk Student (Urgent Attention Needed)

**Data**:
- Risk Score: 92%
- Attendance: 35%
- Average Marks: 28%
- Behavior Score: 32/100
- Days Present: 18, Days Absent: 33
- Exams: 2 completed
- Negative Incidents: 8

**Plain Language Output**:

> This student requires immediate attention. Our analysis indicates a 92% likelihood of facing severe academic challenges, which is critical. This means urgent support is needed across multiple areas.
>
> The student has significant attendance issues, only showing up about 35% of the time. They've been present for just 18 days while missing 33 days. This means they're missing most of their classes.
>
> The student is having difficulty with their studies, averaging 28% across 2 exams. This indicates they're finding the material challenging and may not be grasping key concepts.
>
> The student is experiencing significant behavioral difficulties with a score of 32 out of 100. With 8 incidents on record, they're struggling to meet behavioral expectations in the classroom.
>
> Overall, the student is struggling across multiple areas - attendance, academics, and behavior. These challenges tend to reinforce each other, which is why the risk level is high. The student needs comprehensive support.

---

## Language Patterns

### Attendance

| Rate | Language Used |
|------|---------------|
| ≥85% | "coming to school regularly", "shows good commitment" |
| 70-84% | "attending most of the time", "missing some classes here and there" |
| 50-69% | "absent quite a bit", "missing a lot of what happens in class" |
| <50% | "significant attendance issues", "missing most of their classes" |

### Academic Performance

| Marks | Language Used |
|-------|---------------|
| ≥75% | "performing well", "understanding the material and doing good work" |
| 60-74% | "doing okay", "passing and understanding most of the material" |
| 40-59% | "just getting by", "might be struggling to keep up" |
| <40% | "having difficulty", "finding the material challenging" |

### Behavior

| Score | Language Used |
|-------|---------------|
| ≥80 | "doing great", "engaged and following expectations" |
| 60-79 | "mostly okay", "generally follow expectations" |
| 40-59 | "some challenges", "having trouble following expectations" |
| <40 | "significant difficulties", "struggling to meet expectations" |

### Risk Level

| Level | Opening Statement |
|-------|-------------------|
| Low | "doing well overall", "generally on track" |
| Medium | "shows some areas that need attention", "a few concerns" |
| High | "needs support in several areas", "multiple factors affecting" |
| Critical | "requires immediate attention", "urgent support needed" |

## Key Differences from Technical Explanation

| Technical | Plain Language |
|-----------|----------------|
| "Attendance rate: 72.5%" | "attending about 72% of the time" |
| "Below threshold of 75%" | "missing some classes here and there" |
| "Academic performance indicator" | "how they're doing with their studies" |
| "Behavioral incidents: 2" | "there have been 2 incidents noted" |
| "Risk score: 0.55" | "55% likelihood of facing challenges" |
| "Data tier: 2" | (not mentioned - too technical) |
| "Feature importance" | (not mentioned - too technical) |

## Testing the Language

Ask yourself:
1. Would a parent understand this?
2. Would a non-educator understand this?
3. Does it sound like a conversation?
4. Is it respectful and professional?
5. Does it explain without judging?

If yes to all, the language is appropriate.

---

**Status**: ✅ Implemented
**Component**: `PlainLanguageSummary.jsx`
**Location**: Top of Risk Explanation tab (most prominent position)
