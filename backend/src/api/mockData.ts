
export const MOCK_EXTRACTED_DATA = {
    patientFirstName: "Sarah",
    patientLastName: "Johnson",
    patientEmail: "sarah.johnson@email.com",
    age: 58,
    specialty: "Cardiology",
    payer: "Blue Cross Blue Shield",
    plan: "Blue Cross PPO Plus",
    urgency: "urgent",
    appointmentDate: null,
    referralDate: "2025-11-10T14:00:00Z",
    providerName: "Dr. James Mitchell",
    facilityName: "Downtown Medical Center",
    reason: "Chest pain and irregular heartbeat"
};

export const MOCK_UPLOAD_RESPONSE = {
    success: true,
    data: {
        extractedData: MOCK_EXTRACTED_DATA,
        confidence: 0.95,
        documentId: "doc-12345678",
        needsReview: false,
        warnings: []
    },
    message: "Document processed successfully"
};

export const MOCK_ORCHESTRATION_RESPONSE = {
    success: true,
    data: {
        referralId: "ref-001",
        status: "Scheduled",
        orchestrationId: "orch-98765432",
        completedSteps: [
            {
                id: "step-1",
                label: "Intake",
                status: "completed",
                completedAt: "2025-11-10T14:15:00Z"
            },
            {
                id: "step-2",
                label: "Eligibility",
                status: "completed",
                completedAt: "2025-11-11T09:30:00Z"
            },
            {
                id: "step-3",
                label: "Prior Authorization",
                status: "completed",
                completedAt: "2025-11-13T16:45:00Z"
            },
            {
                id: "step-4",
                label: "Scheduled",
                status: "completed",
                completedAt: "2025-11-15T11:20:00Z"
            }
        ],
        appointmentDetails: {
            appointmentDate: "2025-11-22T10:30:00Z",
            providerName: "Dr. James Mitchell",
            facilityName: "Downtown Medical Center",
            facilityAddress: "123 Main St, New York, NY 10001"
        },
        notificationsSent: {
            sms: true,
            email: true
        },
        estimatedCompletionTime: "2025-11-15T11:30:00Z"
    },
    message: "Referral orchestration completed successfully"
};

export const MOCK_REFERRALS_LIST = {
    success: true,
    data: {
        referrals: [
            {
                id: "ref-001",
                patientFirstName: "Sarah",
                patientLastName: "Johnson",
                patientEmail: "sarah.johnson@email.com",
                specialty: "Cardiology",
                payer: "Blue Cross Blue Shield",
                status: "Scheduled",
                appointmentDate: "2025-11-22T10:30:00Z",
                referralDate: "2025-11-10T14:00:00Z",
                noShowRisk: 15
            },
            {
                id: "ref-002",
                patientFirstName: "Michael",
                patientLastName: "Chen",
                patientEmail: "michael.chen@email.com",
                specialty: "Orthopedics",
                payer: "UnitedHealthcare",
                status: "Pending",
                appointmentDate: "2025-11-25T14:00:00Z",
                referralDate: "2025-11-15T09:30:00Z",
                noShowRisk: 42
            }
        ],
        pagination: {
            page: 1,
            limit: 50,
            total: 62,
            totalPages: 2,
            hasNextPage: true,
            hasPreviousPage: false
        }
    },
    message: "Referrals retrieved successfully"
};

export const MOCK_REFERRAL_DETAILS = {
    success: true,
    data: {
        id: "ref-001",
        patientFirstName: "Sarah",
        patientLastName: "Johnson",
        patientEmail: "sarah.johnson@email.com",
        age: 58,
        specialty: "Cardiology",
        payer: "Blue Cross Blue Shield",
        plan: "Blue Cross PPO Plus",
        status: "Scheduled",
        urgency: "urgent",
        appointmentDate: "2025-11-22T10:30:00Z",
        referralDate: "2025-11-10T14:00:00Z",
        noShowRisk: 15,
        providerName: "Dr. James Mitchell",
        facilityName: "Downtown Medical Center",
        reason: "Chest pain and irregular heartbeat",
        steps: [
            {
                id: "step-1",
                label: "Intake",
                status: "completed",
                completedAt: "2025-11-10T14:15:00Z",
                description: "Initial referral received and processed"
            },
            {
                id: "step-2",
                label: "Eligibility",
                status: "completed",
                completedAt: "2025-11-11T09:30:00Z",
                description: "Insurance eligibility verified"
            },
            {
                id: "step-3",
                label: "Prior Authorization",
                status: "completed",
                completedAt: "2025-11-13T16:45:00Z",
                description: "PA approved for specialist consultation"
            },
            {
                id: "step-4",
                label: "Scheduled",
                status: "current",
                completedAt: "2025-11-15T11:20:00Z",
                description: "Appointment scheduled with provider"
            },
            {
                id: "step-5",
                label: "Completed",
                status: "upcoming",
                description: "Appointment attended"
            }
        ],
        actionLog: [
            {
                id: "log-1",
                event: "Referral Created",
                type: "system",
                timestamp: "2025-11-10T14:00:00Z",
                user: "Dr. Emma Wilson",
                description: "Referral created by primary care physician",
                details: {
                    source: "EHR Integration"
                }
            },
            {
                id: "log-2",
                event: "Intake Completed",
                type: "user",
                timestamp: "2025-11-10T14:15:00Z",
                user: "Linda Martinez",
                description: "Patient demographics and insurance information verified"
            },
            {
                id: "log-3",
                event: "Eligibility Check Started",
                type: "eligibility",
                timestamp: "2025-11-11T09:00:00Z",
                user: "System",
                description: "Automated eligibility verification initiated"
            },
            {
                id: "log-4",
                event: "Eligibility Verified",
                type: "eligibility",
                timestamp: "2025-11-11T09:30:00Z",
                user: "System",
                description: "Insurance active, benefits confirmed",
                details: {
                    copay: "$40",
                    coinsurance: "20%"
                }
            },
            {
                id: "log-5",
                event: "PA Request Submitted",
                type: "pa",
                timestamp: "2025-11-12T10:15:00Z",
                user: "Sarah Chen",
                description: "Prior authorization request submitted to payer"
            },
            {
                id: "log-6",
                event: "PA Approved",
                type: "pa",
                timestamp: "2025-11-13T16:45:00Z",
                user: "Blue Cross Blue Shield",
                description: "Prior authorization approved - Authorization #PA-2025-8847",
                details: {
                    authNumber: "PA-2025-8847",
                    validUntil: "2026-02-13"
                }
            },
            {
                id: "log-7",
                event: "Appointment Scheduled",
                type: "scheduling",
                timestamp: "2025-11-15T11:20:00Z",
                user: "Mike Johnson",
                description: "Appointment scheduled for Nov 22, 2025 at 10:30 AM"
            },
            {
                id: "log-8",
                event: "Confirmation SMS Sent",
                type: "message",
                timestamp: "2025-11-15T11:25:00Z",
                user: "System",
                description: "Appointment confirmation sent via SMS"
            },
            {
                id: "log-9",
                event: "Reminder Email Sent",
                type: "message",
                timestamp: "2025-11-19T09:00:00Z",
                user: "System",
                description: "3-day appointment reminder sent via email"
            },
            {
                id: "log-10",
                event: "Patient Confirmed Attendance",
                type: "message",
                timestamp: "2025-11-19T14:30:00Z",
                user: "Sarah Johnson",
                description: "Patient replied 'YES' to confirmation request"
            }
        ],
        messages: [
            {
                id: "msg-1",
                channel: "SMS",
                content: "Hi Sarah, your cardiology appointment with Dr. James Mitchell is scheduled for Nov 22 at 10:30 AM at Downtown Medical Center. Please reply YES to confirm or CANCEL to reschedule.",
                timestamp: "2025-11-15T11:25:00Z",
                status: "delivered",
                direction: "outbound",
                recipient: "sarah.johnson@email.com"
            },
            {
                id: "msg-2",
                channel: "SMS",
                content: "YES",
                timestamp: "2025-11-19T14:30:00Z",
                status: "delivered",
                direction: "inbound"
            },
            {
                id: "msg-3",
                channel: "Email",
                content: "Dear Sarah Johnson,\\n\\nThis is a reminder that you have an appointment scheduled:\\n\\nDate: Friday, November 22, 2025\\nTime: 10:30 AM\\nProvider: Dr. James Mitchell\\nLocation: Downtown Medical Center, 123 Main St\\nSpecialty: Cardiology\\n\\nPlease bring your insurance card and a valid ID. If you need to reschedule, please call us at (555) 123-4567.\\n\\nThank you!",
                timestamp: "2025-11-19T09:00:00Z",
                status: "delivered",
                direction: "outbound",
                recipient: "sarah.johnson@email.com"
            }
        ]
    },
    message: "Referral details retrieved successfully"
};

export const MOCK_REFERRAL_LOGS = {
    success: true,
    data: {
        referralId: "ref-001",
        logs: [
            {
                id: "log-10",
                event: "Patient Confirmed Attendance",
                type: "message",
                timestamp: "2025-11-19T14:30:00Z",
                user: "Sarah Johnson",
                description: "Patient replied 'YES' to confirmation request",
                details: null
            },
            {
                id: "log-9",
                event: "Reminder Email Sent",
                type: "message",
                timestamp: "2025-11-19T09:00:00Z",
                user: "System",
                description: "3-day appointment reminder sent via email",
                details: null
            },
            {
                id: "log-8",
                event: "Confirmation SMS Sent",
                type: "message",
                timestamp: "2025-11-15T11:25:00Z",
                user: "System",
                description: "Appointment confirmation sent via SMS",
                details: null
            },
            {
                id: "log-7",
                event: "Appointment Scheduled",
                type: "scheduling",
                timestamp: "2025-11-15T11:20:00Z",
                user: "Mike Johnson",
                description: "Appointment scheduled for Nov 22, 2025 at 10:30 AM",
                details: null
            },
            {
                id: "log-6",
                event: "PA Approved",
                type: "pa",
                timestamp: "2025-11-13T16:45:00Z",
                user: "Blue Cross Blue Shield",
                description: "Prior authorization approved - Authorization #PA-2025-8847",
                details: {
                    authNumber: "PA-2025-8847",
                    validUntil: "2026-02-13"
                }
            },
            {
                id: "log-5",
                event: "PA Request Submitted",
                type: "pa",
                timestamp: "2025-11-12T10:15:00Z",
                user: "Sarah Chen",
                description: "Prior authorization request submitted to payer",
                details: null
            },
            {
                id: "log-4",
                event: "Eligibility Verified",
                type: "eligibility",
                timestamp: "2025-11-11T09:30:00Z",
                user: "System",
                description: "Insurance active, benefits confirmed",
                details: {
                    copay: "$40",
                    coinsurance: "20%"
                }
            },
            {
                id: "log-3",
                event: "Eligibility Check Started",
                type: "eligibility",
                timestamp: "2025-11-11T09:00:00Z",
                user: "System",
                description: "Automated eligibility verification initiated",
                details: null
            },
            {
                id: "log-2",
                event: "Intake Completed",
                type: "user",
                timestamp: "2025-11-10T14:15:00Z",
                user: "Linda Martinez",
                description: "Patient demographics and insurance information verified",
                details: null
            },
            {
                id: "log-1",
                event: "Referral Created",
                type: "system",
                timestamp: "2025-11-10T14:00:00Z",
                user: "Dr. Emma Wilson",
                description: "Referral created by primary care physician",
                details: {
                    source: "EHR Integration"
                }
            }
        ],
        pagination: {
            limit: 100,
            offset: 0,
            total: 10,
            hasMore: false
        }
    },
    message: "Logs retrieved successfully"
};
