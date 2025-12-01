import { Mail } from "lucide-react";

interface EmailNotificationProps {
  to: string;
  subject: string;
  body: string;
}

export const ReferralEmailNotification = ({
  to,
  subject,
  body,
}: EmailNotificationProps) => {
  return (
    <div className="border rounded-xl corner-smooth bg-background p-4">
      <h4 className="text-sm flex items-center gap-2 font-semibold text-default">
        <Mail className="size-4" />
        <span>Email Notification</span>
      </h4>
      <p className="text-sm text-muted-foreground mb-2">To: {to}</p>
      <p className="text-sm font-medium text-default mb-2">
        Subject: {subject}
      </p>
      <div className="text-sm text-default bg-muted p-5 corner-smooth border border-border rounded-xl max-h-[200px] overflow-auto whitespace-pre-wrap">
        {body}
      </div>
    </div>
  );
};
