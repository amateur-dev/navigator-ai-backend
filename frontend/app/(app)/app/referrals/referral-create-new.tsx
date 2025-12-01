"use client";

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { ReferralFileUpload } from "./referral-file-upload";

export const ReferralCreateNew = () => {
  const [action, setAction] = useQueryState("action");

  return (
    <Drawer
      open={action === "create-referral"}
      onOpenChange={(open) => setAction(open ? "create-referral" : null)}
    >
      <DrawerTrigger asChild>
        <Button
          variant="default"
          className="h-10"
          onClick={() => setAction("create-referral")}
        >
          <span>New Referral</span>
          <Plus className="size-4" strokeWidth={1.8} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen px-10 pb-6">
        <DrawerHeader className="items-start gap-0!">
          <DrawerTitle>Create New Referral</DrawerTitle>
          <DrawerDescription>
            Upload patient's referral document to get started
          </DrawerDescription>
        </DrawerHeader>
        <ReferralFileUpload />
      </DrawerContent>
    </Drawer>
  );
};
