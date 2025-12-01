import { Phone } from "lucide-react";

interface SmsNotificationProps {
  to: string;
  message: string;
}

export const ReferralSmsNotification = ({
  to,
  message,
}: SmsNotificationProps) => {
  return (
    <div className="w-full flex flex-col border rounded-xl corner-smooth bg-background p-4">
      <h4 className="text-sm flex items-center gap-2 font-semibold text-default">
        <Phone className="size-4" />
        <span>SMS Notification</span>
      </h4>
      <p className="text-sm text-muted-foreground mb-2">To: {to}</p>
      <p className="text-sm text-default bg-muted p-5 corner-smooth border border-border rounded-xl">{message}</p>
    </div>
  );
};
