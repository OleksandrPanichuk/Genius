"use client"
import { Settings } from "lucide-react";

import { Heading } from "@/components/ui";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    checkSubscription().then(isSubscribed => {
      setIsPro(isSubscribed)
    })
  }, [])

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
}

export default SettingsPage;