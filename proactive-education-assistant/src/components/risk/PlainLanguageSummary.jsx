import React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * Plain Language Summary Component
 * Provides a simple, human-friendly explanation of the risk prediction
 * No technical jargon, no recommendations - just clear understanding
 */
const PlainLanguageSummary = ({ features, prediction, riskLevel }) => {
  if (!features || !prediction) return null;

  const summary = generatePlainLanguageSummary(features, prediction, riskLevel);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="text-3xl mt-1">💬</div>
        <div className="flex-1">
          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            In Simple Words
          </h4>
          <div className="text-purple-900 leading-relaxed space-y-3">
            {summary.map((paragraph, idx) => (
              <p key={idx} className="text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Generate plain language summary based on student data
 * Returns array of paragraphs explaining the situation
 */
function generatePlainLanguageSummary(features, prediction, riskLevel) {
  const paragraphs = [];
  
  // Extract key metrics
  const attendanceRate = features.attendance_rate || 0;
  const avgMarks = features.avg_marks_percentage || 0;
  const behaviorScore = features.behavior_score || 0;
  const daysPresent = features.days_present || 0;
  const daysAbsent = features.days_absent || 0;
  const examsCompleted = features.exams_completed || 0;
  const negativeIncidents = features.negative_incidents || 0;
  const positiveIncidents = features.positive_incidents || 0;
  
  // Opening statement based on risk level
  const riskScore = (prediction.risk_score * 100).toFixed(0);
  
  if (riskLevel === 'low') {
    paragraphs.push(
      `This student is doing well overall. Our analysis shows a ${riskScore}% likelihood of facing academic challenges, which is considered low risk. This means the student is generally on track with their education.`
    );
  } else if (riskLevel === 'medium') {
    paragraphs.push(
      `This student shows some areas that need attention. Our analysis indicates a ${riskScore}% likelihood of facing academic challenges, which puts them in the medium risk category. This means there are a few concerns, but nothing critical yet.`
    );
  } else if (riskLevel === 'high') {
    paragraphs.push(
      `This student needs support in several areas. Our analysis shows a ${riskScore}% likelihood of facing serious academic challenges, placing them in the high risk category. This means multiple factors are affecting their education.`
    );
  } else {
    paragraphs.push(
      `This student requires immediate attention. Our analysis indicates a ${riskScore}% likelihood of facing severe academic challenges, which is critical. This means urgent support is needed across multiple areas.`
    );
  }
  
  // Attendance explanation
  const attendancePercent = (attendanceRate * 100).toFixed(0);
  if (attendanceRate >= 0.85) {
    paragraphs.push(
      `The student has been coming to school regularly - about ${attendancePercent}% of the time. They've been present for ${daysPresent} days, which shows good commitment to attending classes.`
    );
  } else if (attendanceRate >= 0.70) {
    paragraphs.push(
      `The student's attendance is around ${attendancePercent}%, with ${daysPresent} days present and ${daysAbsent} days absent. They're attending most of the time, but missing some classes here and there.`
    );
  } else if (attendanceRate >= 0.50) {
    paragraphs.push(
      `The student has been absent quite a bit - only attending about ${attendancePercent}% of the time. Out of the tracked period, they were present for ${daysPresent} days but missed ${daysAbsent} days. This means they're missing a lot of what happens in class.`
    );
  } else {
    paragraphs.push(
      `The student has significant attendance issues, only showing up about ${attendancePercent}% of the time. They've been present for just ${daysPresent} days while missing ${daysAbsent} days. This means they're missing most of their classes.`
    );
  }
  
  // Academic performance explanation
  if (avgMarks >= 75) {
    paragraphs.push(
      `Academically, the student is performing well with an average of ${avgMarks.toFixed(0)}% across ${examsCompleted} exams. They're understanding the material and doing good work.`
    );
  } else if (avgMarks >= 60) {
    paragraphs.push(
      `The student is scoring around ${avgMarks.toFixed(0)}% on average across ${examsCompleted} exams. They're passing and understanding most of the material, though there's room to improve.`
    );
  } else if (avgMarks >= 40) {
    paragraphs.push(
      `The student's exam scores average around ${avgMarks.toFixed(0)}% across ${examsCompleted} exams. They're just getting by, which suggests they might be struggling to keep up with some of the coursework.`
    );
  } else {
    paragraphs.push(
      `The student is having difficulty with their studies, averaging ${avgMarks.toFixed(0)}% across ${examsCompleted} exams. This indicates they're finding the material challenging and may not be grasping key concepts.`
    );
  }
  
  // Behavior explanation
  if (behaviorScore >= 80) {
    if (positiveIncidents > 0) {
      paragraphs.push(
        `In terms of behavior, the student is doing great with a score of ${behaviorScore.toFixed(0)} out of 100. They've had ${positiveIncidents} positive recognition${positiveIncidents !== 1 ? 's' : ''}, showing they're engaged and following expectations.`
      );
    } else {
      paragraphs.push(
        `The student's behavior is good with a score of ${behaviorScore.toFixed(0)} out of 100. They're following the rules and participating appropriately in class.`
      );
    }
  } else if (behaviorScore >= 60) {
    if (negativeIncidents > 0) {
      paragraphs.push(
        `The student's behavior is mostly okay with a score of ${behaviorScore.toFixed(0)} out of 100. There have been ${negativeIncidents} incident${negativeIncidents !== 1 ? 's' : ''} noted, but nothing too serious. They generally follow expectations.`
      );
    } else {
      paragraphs.push(
        `The student's behavior is acceptable with a score of ${behaviorScore.toFixed(0)} out of 100. They're managing to follow most expectations in class.`
      );
    }
  } else if (behaviorScore >= 40) {
    paragraphs.push(
      `The student has had some behavioral challenges, with a score of ${behaviorScore.toFixed(0)} out of 100. There have been ${negativeIncidents} incident${negativeIncidents !== 1 ? 's' : ''} recorded, suggesting they're having trouble following expectations or staying focused.`
    );
  } else {
    paragraphs.push(
      `The student is experiencing significant behavioral difficulties with a score of ${behaviorScore.toFixed(0)} out of 100. With ${negativeIncidents} incident${negativeIncidents !== 1 ? 's' : ''} on record, they're struggling to meet behavioral expectations in the classroom.`
    );
  }
  
  // Closing statement based on overall picture
  const issueCount = [
    attendanceRate < 0.75,
    avgMarks < 50,
    behaviorScore < 60
  ].filter(Boolean).length;
  
  if (issueCount === 0) {
    paragraphs.push(
      `Overall, the student is managing well across attendance, academics, and behavior. They're engaged with their education and showing up consistently.`
    );
  } else if (issueCount === 1) {
    paragraphs.push(
      `Overall, the student is doing okay in most areas, but there's one aspect that could use some attention. Addressing this early can help keep them on track.`
    );
  } else if (issueCount === 2) {
    paragraphs.push(
      `Overall, the student is facing challenges in a couple of areas. These issues are connected - when one area struggles, it often affects the others. That's why the risk level is elevated.`
    );
  } else {
    paragraphs.push(
      `Overall, the student is struggling across multiple areas - attendance, academics, and behavior. These challenges tend to reinforce each other, which is why the risk level is high. The student needs comprehensive support.`
    );
  }
  
  return paragraphs;
}

export default PlainLanguageSummary;
