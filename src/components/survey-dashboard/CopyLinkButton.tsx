"use client";

import { Button } from "@/components/ui/button";
import { LinkIcon, Check } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ surveyId }: { surveyId: string }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    // Construct the public URL for the survey
    const url = `${window.location.origin}/surveys/${surveyId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="secondary" onClick={copyUrl} className="gap-2">
      {copied ? <Check size={16} /> : <LinkIcon size={16} />}
      {copied ? "Copied!" : "Copy Public Link"}
    </Button>
  );
}
