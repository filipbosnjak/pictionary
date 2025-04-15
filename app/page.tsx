"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";

export default function Home() {
  return (
    <main className="container mx-auto p-4 flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Pictionary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <CreateRoom />
        <JoinRoom />
      </div>
    </main>
  );
}
