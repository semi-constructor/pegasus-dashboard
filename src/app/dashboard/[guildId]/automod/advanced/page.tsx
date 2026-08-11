"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldBan, ShieldCheck, Plus, Trash2, Search, Settings2, History } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const recentActions = [
  { id: "ACT-1234", user: "spammer99", rule: "Anti-Spam", action: "Timeout (1h)", time: "2 mins ago", status: "Auto" },
  { id: "ACT-1235", user: "toxic_gamer", rule: "Profanity Filter", action: "Deleted Message", time: "15 mins ago", status: "Auto" },
  { id: "ACT-1236", user: "scambot2024", rule: "Suspicious Links", action: "Ban", time: "1 hour ago", status: "Manual Override" },
  { id: "ACT-1237", user: "annoying_user", rule: "Mass Mentions", action: "Warn", time: "3 hours ago", status: "Auto" },
];

export default function AutoModAdvancedPage() {
  const [blockedWords, setBlockedWords] = useState([
    "badword1", "scamlink.com", "freemoney", "clickbait"
  ]);
  const [newWord, setNewWord] = useState("");

  const [filters, setFilters] = useState({
    antiSpam: true,
    profanity: true,
    capsLock: false,
    massMentions: true,
    suspiciousLinks: true,
    zalgoText: false,
  });

  const handleToggle = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Filter setting updated");
  };

  const handleAddWord = () => {
    if (newWord.trim() && !blockedWords.includes(newWord.trim())) {
      setBlockedWords([...blockedWords, newWord.trim()]);
      setNewWord("");
      toast.success("Word added to blocklist");
    }
  };

  const handleRemoveWord = (word: string) => {
    setBlockedWords(blockedWords.filter(w => w !== word));
    toast.success("Word removed from blocklist");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Advanced AutoMod
          </h1>
          <p className="text-muted-foreground">Manage spam filters, blocked words, and review recent automated actions.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Global Settings
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              {Object.values(filters).filter(Boolean).length} / {Object.keys(filters).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Actions Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-500" />
              1,248
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blocked Words</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <ShieldBan className="w-5 h-5 text-red-500" />
              {blockedWords.length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 bg-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="filters" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="filters" className="gap-2"><Shield className="w-4 h-4" /> Filters & Rules</TabsTrigger>
          <TabsTrigger value="blocklist" className="gap-2"><ShieldBan className="w-4 h-4" /> Blocked Words</TabsTrigger>
          <TabsTrigger value="logs" className="gap-2"><History className="w-4 h-4" /> Action Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="filters" className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Core Protection Filters</CardTitle>
              <CardDescription>Enable or disable primary automated moderation modules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                
                <div className="flex items-center justify-between space-x-4 border border-border/50 p-4 rounded-lg bg-background/50">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">Anti-Spam</Label>
                    <p className="text-sm text-muted-foreground">Prevents repetitive messages and rapid sending.</p>
                  </div>
                  <Switch checked={filters.antiSpam} onCheckedChange={() => handleToggle('antiSpam')} />
                </div>

                <div className="flex items-center justify-between space-x-4 border border-border/50 p-4 rounded-lg bg-background/50">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">Profanity Filter</Label>
                    <p className="text-sm text-muted-foreground">Blocks common offensive words and slurs.</p>
                  </div>
                  <Switch checked={filters.profanity} onCheckedChange={() => handleToggle('profanity')} />
                </div>

                <div className="flex items-center justify-between space-x-4 border border-border/50 p-4 rounded-lg bg-background/50">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">Mass Mentions</Label>
                    <p className="text-sm text-muted-foreground">Blocks messages containing too many @mentions.</p>
                  </div>
                  <Switch checked={filters.massMentions} onCheckedChange={() => handleToggle('massMentions')} />
                </div>

                <div className="flex items-center justify-between space-x-4 border border-border/50 p-4 rounded-lg bg-background/50">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">Suspicious Links</Label>
                    <p className="text-sm text-muted-foreground">Detects and removes known phishing or scam URLs.</p>
                  </div>
                  <Switch checked={filters.suspiciousLinks} onCheckedChange={() => handleToggle('suspiciousLinks')} />
                </div>

                <div className="flex items-center justify-between space-x-4 border border-border/50 p-4 rounded-lg bg-background/50">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">Excessive Caps</Label>
                    <p className="text-sm text-muted-foreground">Warns users who type mostly in CAPITAL LETTERS.</p>
                  </div>
                  <Switch checked={filters.capsLock} onCheckedChange={() => handleToggle('capsLock')} />
                </div>

                <div className="flex items-center justify-between space-x-4 border border-border/50 p-4 rounded-lg bg-background/50">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold">Zalgo Text</Label>
                    <p className="text-sm text-muted-foreground">Prevents heavily corrupted/glitched characters.</p>
                  </div>
                  <Switch checked={filters.zalgoText} onCheckedChange={() => handleToggle('zalgoText')} />
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocklist" className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Custom Blocked Words</CardTitle>
              <CardDescription>Messages containing these exact phrases will be automatically deleted.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6 max-w-md">
                <Input 
                  placeholder="Enter word or phrase to block..." 
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                />
                <Button onClick={handleAddWord} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {blockedWords.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No blocked words added yet.</p>
                ) : (
                  blockedWords.map((word) => (
                    <Badge key={word} variant="secondary" className="px-3 py-1.5 text-sm gap-2">
                      {word}
                      <button onClick={() => handleRemoveWord(word)} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Actions Logs</CardTitle>
                <CardDescription>Live feed of AutoMod interventions across your server.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Triggered Rule</TableHead>
                      <TableHead>Action Taken</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActions.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell className="font-medium">@{action.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{action.rule}</Badge>
                        </TableCell>
                        <TableCell className="text-red-400 font-medium">{action.action}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{action.time}</TableCell>
                        <TableCell>
                          <Badge variant={action.status === "Auto" ? "secondary" : "default"} className="text-xs">
                            {action.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
