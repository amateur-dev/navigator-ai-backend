# `/metrics` Endpoint - Dashboard Metrics Specification

This document outlines the proposed `/metrics` endpoint for the Navigator-AI dashboard, providing comprehensive analytics and key performance indicators (KPIs) for the medical referral management system.

## 📋 Table of Contents

- [Overview](#overview)
- [Endpoint Structure](#endpoint-structure)
- [Metric Categories](#metric-categories)
- [Dashboard Widget Recommendations](#dashboard-widget-recommendations)
- [SQL Implementation Examples](#sql-implementation-examples)
- [Response Format](#response-format)

---

## Overview

**Endpoint:** `GET /metrics`

**Purpose:** Provide real-time analytics and KPIs for monitoring referral management performance, provider utilization, insurance metrics, and system efficiency.

**Authentication:** Required (Admin/Dashboard access)

**Cache Strategy:** Cache for 5 minutes to reduce database load

---

## Endpoint Structure

### Full Response Example

```json
{
  "success": true,
  "data": {
    "overview": { /* KPIs */ },
    "referralsByStatus": { /* Status breakdown */ },
    "topSpecialties": [ /* Specialty distribution */ ],
    "insuranceBreakdown": { /* Payer metrics */ },
    "appointments": { /* Appointment stats */ },
    "providers": { /* Specialist metrics */ },
    "trends": { /* Time-based trends */ },
    "urgencyLevels": { /* Urgency breakdown */ },
    "efficiency": { /* Processing metrics */ },
    "alerts": { /* Action items */ },
    "financial": { /* Revenue indicators */ },
    "timestamp": "2025-12-01T10:30:00Z",
    "lastUpdated": "2025-12-01T10:30:00Z"
  }
}
```

---

## Metric Categories

### 1. Overview Metrics (KPIs)

**Purpose:** High-level performance indicators for executive dashboard

```json
{
  "overview": {
    "totalReferrals": 1247,
    "activeReferrals": 342,
    "completedThisMonth": 128,
    "pendingReview": 23,
    "averageProcessingTime": "2.3 days",
    "successRate": 94.5
  }
}
```

**Calculations:**
- `totalReferrals`: Total count from referrals table
- `activeReferrals`: Count where status IN ('Pending', 'Scheduled', 'InProgress')
- `completedThisMonth`: Count where status = 'Completed' AND created_at >= start of month
- `pendingReview`: Count where status = 'Pending'
- `averageProcessingTime`: AVG(completed_at - created_at) for completed referrals
- `successRate`: (completed / total) * 100

---

### 2. Referral Status Breakdown

**Purpose:** Visual status distribution for workflow monitoring

```json
{
  "referralsByStatus": {
    "pending": 89,
    "scheduled": 156,
    "inProgress": 97,
    "completed": 892,
    "cancelled": 13
  }
}
```

**Widget Type:** Donut/Pie Chart or Status Cards

---

### 3. Top Specialties

**Purpose:** Identify most common referral types and resource allocation needs

```json
{
  "topSpecialties": [
    {
      "specialty": "Cardiology",
      "count": 234,
      "percentage": 18.8,
      "trend": "+5.2%"
    },
    {
      "specialty": "Orthopedics",
      "count": 189,
      "percentage": 15.2,
      "trend": "+2.1%"
    },
    {
      "specialty": "Dermatology",
      "count": 156,
      "percentage": 12.5,
      "trend": "-1.3%"
    },
    {
      "specialty": "Neurology",
      "count": 142,
      "percentage": 11.4,
      "trend": "+8.7%"
    },
    {
      "specialty": "Pediatrics",
      "count": 128,
      "percentage": 10.3,
      "trend": "+3.4%"
    }
  ]
}
```

**Widget Type:** Horizontal Bar Chart or Ranked List

---

### 4. Insurance/Payer Metrics

**Purpose:** Track insurance approval rates and payer performance

```json
{
  "insuranceBreakdown": {
    "topPayers": [
      {
        "payer": "Blue Cross Blue Shield",
        "count": 312,
        "approvalRate": 96,
        "avgApprovalTime": "1.5 days"
      },
      {
        "payer": "UnitedHealthcare",
        "count": 289,
        "approvalRate": 94,
        "avgApprovalTime": "1.8 days"
      },
      {
        "payer": "Aetna",
        "count": 198,
        "approvalRate": 92,
        "avgApprovalTime": "2.1 days"
      },
      {
        "payer": "Cigna",
        "count": 145,
        "approvalRate": 89,
        "avgApprovalTime": "2.4 days"
      },
      {
        "payer": "Humana",
        "count": 123,
        "approvalRate": 91,
        "avgApprovalTime": "1.9 days"
      }
    ],
    "averageApprovalTime": "1.8 days",
    "totalApprovals": 967,
    "totalDenials": 67
  }
}
```

**Widget Type:** Table with sparklines or comparison chart

---

### 5. Appointment Metrics

**Purpose:** Monitor scheduling efficiency and no-show risk

```json
{
  "appointments": {
    "upcomingToday": 12,
    "upcomingThisWeek": 67,
    "upcomingThisMonth": 234,
    "noShowRate": 8.5,
    "highRiskNoShows": 15,
    "averageWaitTime": "5.2 days",
    "cancelledLast30Days": 23,
    "rescheduledLast30Days": 45
  }
}
```

**Widget Types:** 
- Number cards for upcoming counts
- Gauge for no-show rate
- Alert badge for high-risk

---

### 6. Provider/Specialist Metrics

**Purpose:** Track specialist availability and utilization

```json
{
  "providers": {
    "totalSpecialists": 48,
    "availableSpecialists": 42,
    "availableSlots": 156,
    "mostBookedDoctors": [
      {
        "name": "Dr. James Mitchell",
        "specialty": "Cardiology",
        "bookings": 34,
        "rating": 4.8
      },
      {
        "name": "Dr. Sarah Chen",
        "specialty": "Orthopedics",
        "bookings": 28,
        "rating": 4.9
      },
      {
        "name": "Dr. Emily Rodriguez",
        "specialty": "Neurology",
        "bookings": 26,
        "rating": 4.7
      }
    ],
    "utilizationRate": 78.5,
    "averageSlotsPerSpecialist": 3.25
  }
}
```

**Widget Type:** Leaderboard table or utilization gauge

---

### 7. Time-Based Trends

**Purpose:** Identify patterns and forecast capacity needs

```json
{
  "trends": {
    "dailyReferrals": [
      { "date": "2025-11-01", "count": 12, "completed": 8 },
      { "date": "2025-11-02", "count": 15, "completed": 11 },
      { "date": "2025-11-03", "count": 18, "completed": 14 },
      { "date": "2025-11-04", "count": 14, "completed": 12 },
      { "date": "2025-11-05", "count": 16, "completed": 13 }
      // ... last 30 days
    ],
    "weekOverWeek": {
      "change": 8.3,
      "current": 89,
      "previous": 82,
      "trend": "increasing"
    },
    "monthOverMonth": {
      "change": 12.5,
      "current": 342,
      "previous": 304,
      "trend": "increasing"
    },
    "peakHours": [9, 10, 11, 14, 15],
    "peakDays": ["Monday", "Tuesday", "Wednesday"]
  }
}
```

**Widget Types:**
- Line/Area chart for daily trends
- Comparison cards for week/month over time
- Heatmap for peak times

---

### 8. Urgency Levels

**Purpose:** Prioritize high-urgency cases

```json
{
  "urgencyLevels": {
    "emergency": 5,
    "urgent": 34,
    "routine": 203,
    "nonUrgent": 100,
    "distribution": {
      "emergency": 1.5,
      "urgent": 9.9,
      "routine": 59.4,
      "nonUrgent": 29.2
    }
  }
}
```

**Widget Type:** Stacked bar or priority list

---

### 9. Processing Efficiency

**Purpose:** Monitor system performance and identify bottlenecks

```json
{
  "efficiency": {
    "averageExtractionTime": "3.2 seconds",
    "averageOrchestrationTime": "1.8 seconds",
    "averageConfirmationTime": "0.9 seconds",
    "totalProcessed24h": 45,
    "totalProcessedThisWeek": 287,
    "peakHours": [9, 10, 14, 15],
    "bottlenecks": [
      {
        "stage": "Prior Authorization",
        "avgTime": "36 hours",
        "status": "attention_needed"
      }
    ],
    "automationRate": 87.5
  }
}
```

**Widget Types:** 
- Time metrics cards
- Performance timeline
- Bottleneck alerts

---

### 10. Alerts & Warnings

**Purpose:** Action items requiring immediate attention

```json
{
  "alerts": {
    "expiringPriorAuths": 7,
    "upcomingHighRiskNoShows": 12,
    "pendingOver48h": 3,
    "insuranceIssues": 2,
    "missedAppointments": 5,
    "unassignedReferrals": 8,
    "totalAlerts": 37
  }
}
```

**Widget Type:** Alert badge or notification panel

---

### 11. Financial Indicators (Optional)

**Purpose:** Revenue tracking and financial forecasting

```json
{
  "financial": {
    "estimatedRevenue": "$45,600",
    "estimatedRevenueThisMonth": "$12,300",
    "averageReferralValue": "$350",
    "topPayersByValue": [
      {
        "payer": "Blue Cross Blue Shield",
        "totalValue": "$12,400",
        "referralCount": 312
      },
      {
        "payer": "UnitedHealthcare",
        "totalValue": "$10,800",
        "referralCount": 289
      }
    ],
    "revenueBySpecialty": [
      { "specialty": "Cardiology", "value": "$8,900" },
      { "specialty": "Orthopedics", "value": "$7,200" }
    ]
  }
}
```

**Widget Type:** Revenue cards and breakdown charts

---

## Dashboard Widget Recommendations

### Priority 1 - Must Have (Core Dashboard)

1. **Total Referrals Card**
   - Large number display
   - Trend indicator (↑ 8.3%)
   - Subtitle: "Active referrals"

2. **Status Breakdown Chart**
   - Donut or pie chart
   - Color-coded segments
   - Click to filter

3. **Top Specialties Bar Chart**
   - Horizontal bars
   - Top 5-7 specialties
   - Percentage labels

4. **Upcoming Appointments**
   - Three number cards
   - Today / This Week / This Month
   - Color-coded by urgency

5. **Processing Time Metric**
   - Large number with unit
   - Comparison to target
   - Trend indicator

6. **Success Rate Gauge**
   - Circular progress indicator
   - Target line at 95%
   - Color changes based on threshold

### Priority 2 - Nice to Have (Enhanced Dashboard)

7. **Trends Line Chart**
   - 30-day view
   - Referrals vs Completions
   - Hover tooltips

8. **No-Show Risk Alert**
   - Badge with count
   - List of high-risk appointments
   - Action buttons

9. **Provider Utilization**
   - Progress bars per specialty
   - Available slots count
   - Most booked list

10. **Insurance Approval Rate**
    - Table with sparklines
    - Sort by payer
    - Filter options

11. **Recent Activity Feed**
    - Last 10 referrals
    - Status changes
    - Real-time updates

12. **Alerts Badge**
    - Notification dot
    - Count of action items
    - Expandable panel

---

## SQL Implementation Examples

### Total Referrals
```sql
SELECT COUNT(*) as total
FROM referrals;
```

### By Status
```sql
SELECT 
  status,
  COUNT(*) as count
FROM referrals
GROUP BY status;
```

### Top Specialties
```sql
SELECT 
  s.specialty,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM referrals), 1) as percentage
FROM referrals r
JOIN specialists s ON r.specialist_id = s.id
GROUP BY s.specialty
ORDER BY count DESC
LIMIT 5;
```

### Average Processing Time
```sql
SELECT 
  AVG(julianday(updated_at) - julianday(created_at)) as avg_days
FROM referrals
WHERE status = 'Completed';
```

### Upcoming Appointments
```sql
-- Today
SELECT COUNT(*) 
FROM referrals 
WHERE status = 'Scheduled' 
AND date(appointment_date) = date('now');

-- This Week
SELECT COUNT(*) 
FROM referrals 
WHERE status = 'Scheduled' 
AND appointment_date BETWEEN date('now') AND date('now', '+7 days');

-- This Month
SELECT COUNT(*) 
FROM referrals 
WHERE status = 'Scheduled' 
AND strftime('%Y-%m', appointment_date) = strftime('%Y-%m', 'now');
```

### Insurance Breakdown
```sql
SELECT 
  insurance_provider as payer,
  COUNT(*) as count,
  ROUND(
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
    1
  ) as approval_rate
FROM referrals
GROUP BY insurance_provider
ORDER BY count DESC
LIMIT 5;
```

### Provider Utilization
```sql
SELECT 
  COUNT(DISTINCT s.id) as total_specialists,
  SUM(CASE WHEN sl.is_booked = 0 THEN 1 ELSE 0 END) as available_slots,
  ROUND(
    SUM(CASE WHEN sl.is_booked = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(sl.id),
    1
  ) as utilization_rate
FROM specialists s
LEFT JOIN slots sl ON s.id = sl.specialist_id;
```

### Daily Trends (Last 30 Days)
```sql
SELECT 
  date(created_at) as date,
  COUNT(*) as count,
  SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
FROM referrals
WHERE created_at >= date('now', '-30 days')
GROUP BY date(created_at)
ORDER BY date;
```

### Alerts - Pending Over 48h
```sql
SELECT COUNT(*) 
FROM referrals
WHERE status = 'Pending'
AND julianday('now') - julianday(created_at) > 2;
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // All metrics as described above
  },
  "timestamp": "2025-12-01T10:30:00Z",
  "lastUpdated": "2025-12-01T10:30:00Z",
  "cacheExpiry": "2025-12-01T10:35:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "METRICS_ERROR",
    "message": "Failed to retrieve metrics",
    "statusCode": 500
  }
}
```

---

## Implementation Notes

### Performance Considerations

1. **Caching Strategy**
   - Cache metrics for 5 minutes using KV Cache
   - Use background refresh for seamless updates
   - Cache key: `metrics:dashboard:v1`

2. **Database Optimization**
   - Add indexes on frequently queried columns:
     - `referrals(status, created_at)`
     - `referrals(specialist_id, status)`
     - `specialists(specialty)`
     - `slots(specialist_id, is_booked, start_time)`

3. **Query Optimization**
   - Use single query with multiple CTEs for better performance
   - Consider materialized views for complex aggregations
   - Implement pagination for large result sets

### Real-Time Updates (Optional)

For real-time dashboard updates, consider:
- WebSocket connection for live metrics
- Server-Sent Events (SSE) for push updates
- Polling interval: 30-60 seconds

### Access Control

- Admin role: Full access to all metrics
- Provider role: Limited to their own specialty metrics
- Staff role: View-only access to overview metrics

---

## Example Implementation (Hono)

```typescript
// GET /metrics endpoint
app.get('/metrics', async (c) => {
  try {
    const db = c.env.REFERRALS_DB;
    const cache = c.env.KV_CACHE;
    
    // Check cache first
    const cached = await cache.get('metrics:dashboard:v1');
    if (cached) {
      return c.json(JSON.parse(cached));
    }
    
    // Build metrics object
    const metrics = {
      overview: await getOverviewMetrics(db),
      referralsByStatus: await getStatusBreakdown(db),
      topSpecialties: await getTopSpecialties(db),
      // ... other metrics
    };
    
    const response = {
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    // Cache for 5 minutes
    await cache.put(
      'metrics:dashboard:v1',
      JSON.stringify(response),
      { expirationTtl: 300 }
    );
    
    return c.json(response);
  } catch (error) {
    return c.json({
      success: false,
      error: {
        code: 'METRICS_ERROR',
        message: error.message,
        statusCode: 500
      }
    }, 500);
  }
});
```

---

## Future Enhancements

1. **Predictive Analytics**
   - ML-based no-show predictions
   - Capacity forecasting
   - Seasonal trend analysis

2. **Comparative Metrics**
   - Benchmark against industry standards
   - Historical comparisons
   - Goal tracking

3. **Drill-Down Capabilities**
   - Click metrics to see detailed breakdowns
   - Filter by date range, specialty, payer
   - Export to CSV/PDF

4. **Custom Dashboards**
   - User-configurable widgets
   - Role-based views
   - Saved filters

---

**Document Version:** 1.0  
**Last Updated:** December 1, 2025  
**Author:** Navigator-AI Team

