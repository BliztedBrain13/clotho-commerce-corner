
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { ProfilePayment } from "@/components/profile/ProfilePayment";
import { ProfileMessages } from "@/components/profile/ProfileMessages";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Personal Details</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ProfileDetails />
          </TabsContent>

          <TabsContent value="payment">
            <ProfilePayment />
          </TabsContent>

          <TabsContent value="messages">
            <ProfileMessages />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
