"use client"

import * as React from "react"
import { useApp } from "@/contexts/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function SettingsView() {
  const { user } = useApp()
  const { toast } = useToast()

  const getInitials = (name: string) => {
    const names = name.split(" ")
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Profile & Settings</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
              <Badge variant="outline" className="mt-2 capitalize">{user.role}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Account Settings</CardTitle>
            <CardDescription>Update your account information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handlePasswordChange}>
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                </div>
                <Button type="submit">Change Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
