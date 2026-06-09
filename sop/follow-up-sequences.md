# Follow-Up Sequences - Local Liquidators

## Overview

| Sequence | Trigger | Duration | Touchpoints |
|----------|---------|----------|-------------|
| Immediate | New lead submitted | 0-1 hours | 3 |
| 24 Hour | Lead not contacted | 24 hours | 3 |
| 72 Hour | No response to initial | 72 hours | 3 |
| 7 Day | Warm lead nurture | 7 days | 3-4 |
| 30 Day | Long-term nurture | 30 days | 2-3 |
| 90 Day | Reactivation attempt | 90 days | 2 |
| Reactivation | Cold lead revival | 180 days | 2 |

## Immediate Sequence (0-1 Hour)

**Trigger:** Form submission, referral, or inbound inquiry

### Step 1: Auto-Response (Immediate)
- **Channel:** Email + SMS (if phone provided)
- **Message:** "Thanks for contacting Local Liquidators. [Name] will call you within 24 hours. Reply URGENT if you need immediate assistance."

### Step 2: Internal Alert (Immediate)
- **Action:** Hub notification + SMS to assigned agent
- **Content:** New lead alert with score and contact info

### Step 3: CRM Entry (Within 15 min)
- **Action:** Create contact record
- **Tags:** New, [Lead Type], [Source]
- **Next Action:** Initial call scheduled

## 24 Hour Sequence

**Trigger:** Lead not contacted within 24 hours

### Day 1 - Hour 2: First Call Attempt
- **Channel:** Phone
- **Script:** "Hi [Name], this is [Agent] from Local Liquidators. I received your inquiry about [property/selling/buying]. Do you have 5 minutes now, or should I call back at [preferred time]?"

### Day 1 - Hour 4: SMS Follow-Up
- **Message:** "Hi [Name], [Agent] from Local Liquidators. Tried calling about your property inquiry. When's a good time to chat for 5 min? Reply or call [number]."

### Day 1 - Hour 6: Email Follow-Up
- **Subject:** "Quick question about your property"
- **Body:** Brief personalization + value proposition + CTA to schedule call

## 72 Hour Sequence

**Trigger:** No response to 24-hour attempts

### Day 2: Second Call Attempt
- **Time:** Different time of day than first attempt
- **Script:** Reference previous attempt, emphasize value

### Day 2: Alternative Channel
- If email ignored → Try SMS
- If SMS ignored → Try email
- **Message:** "Still interested in [selling/buying] in [area]? I have [specific opportunity]. Takes 2 minutes."

### Day 3: Final Attempt + Nurture Shift
- **Call:** Final direct attempt
- **If no contact:** Move to nurture sequence, tag as "Nurture-Long"

## 7 Day Sequence (Warm Lead Nurture)

**Trigger:** Made contact but not ready to move forward

### Day 4: Value Touch
- **Channel:** Email
- **Content:** Market report, recent sale in their area, or educational content
- **CTA:** "Questions? Reply or call"

### Day 6: Social Proof
- **Channel:** Email or SMS
- **Content:** Recent success story, testimonial, or case study
- **Focus:** Similar situation to theirs

### Day 7: Check-In Call
- **Script:** "Hi [Name], following up on our conversation last week. Any changes to your timeline? I have [relevant update]."

## Success Metrics

- **Contact Rate:** % of leads contacted within 24 hours (Target: 90%+)
- **Response Rate:** % who respond to any touchpoint (Target: 40%+)
- **Conversion Rate:** % who move to appointment/offer (Target: 15%+)
- **Speed to Lead:** Average time from submission to first contact (Target: <2 hours)
