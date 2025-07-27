"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChildProfileForm } from "@/components/parent/ChildProfileForm";
import { ChildProfileCard } from "@/components/parent/ChildProfileCard";
import {
  Account,
  ChildProfile,
  CreateChildProfileData,
  UpdateChildProfileData,
} from "@/types/parent-dashboard";
import {
  getCurrentAccount,
  getChildrenProfiles,
  createChildProfile,
  updateChildProfile,
  deleteChildProfile,
} from "@/lib/parent-dashboard-api";

type ViewMode = "dashboard" | "add" | "edit";

export default function ParentDashboardPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [childrenProfiles, setChildrenProfiles] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [editingProfile, setEditingProfile] = useState<ChildProfile | null>(
    null
  );
  const [deletingProfileId, setDeletingProfileId] = useState<number | null>(
    null
  );

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current account
      const { data: accountData, error: accountError } =
        await getCurrentAccount();

      if (accountError) {
        setError(accountError);
        return;
      }

      if (!accountData) {
        setError(
          "No account found. Please make sure you're signed up properly."
        );
        return;
      }

      setAccount(accountData);

      // Get children profiles
      const { data: childrenData, error: childrenError } =
        await getChildrenProfiles(accountData.id);

      if (childrenError) {
        setError(childrenError);
        return;
      }

      setChildrenProfiles(childrenData || []);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (profileData: CreateChildProfileData) => {
    if (!account) return;

    setActionLoading(true);
    try {
      const { data, error: createError } = await createChildProfile(
        account.id,
        profileData
      );

      if (createError) {
        setError(createError);
        return;
      }

      if (data) {
        setChildrenProfiles(prev => [...prev, data]);
        setViewMode("dashboard");
        setError(null);
      }
    } catch {
      setError("Failed to create child profile");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditChild = async (profileData: CreateChildProfileData) => {
    if (!account || !editingProfile) return;

    setActionLoading(true);
    try {
      const updateData: UpdateChildProfileData = {
        id: editingProfile.id,
        ...profileData,
      };

      const { data, error: updateError } = await updateChildProfile(
        account.id,
        updateData
      );

      if (updateError) {
        setError(updateError);
        return;
      }

      if (data) {
        setChildrenProfiles(prev =>
          prev.map(profile => (profile.id === data.id ? data : profile))
        );
        setViewMode("dashboard");
        setEditingProfile(null);
        setError(null);
      }
    } catch {
      setError("Failed to update child profile");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteChild = async (profileId: number) => {
    if (!account) return;

    setDeletingProfileId(profileId);
    try {
      const { error: deleteError } = await deleteChildProfile(
        account.id,
        profileId
      );

      if (deleteError) {
        setError(deleteError);
        return;
      }

      setChildrenProfiles(prev =>
        prev.filter(profile => profile.id !== profileId)
      );
      setError(null);
    } catch {
      setError("Failed to delete child profile");
    } finally {
      setDeletingProfileId(null);
    }
  };

  const startEditingProfile = (profile: ChildProfile) => {
    setEditingProfile(profile);
    setViewMode("edit");
  };

  const cancelForm = () => {
    setViewMode("dashboard");
    setEditingProfile(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You need to have a valid account to access the parent dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === "add") {
    return (
      <div className="container mx-auto px-4 py-8">
        <ChildProfileForm
          onSubmit={handleAddChild}
          onCancel={cancelForm}
          loading={actionLoading}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (viewMode === "edit" && editingProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ChildProfileForm
          onSubmit={handleEditChild}
          onCancel={cancelForm}
          initialData={editingProfile}
          isEditing={true}
          loading={actionLoading}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Parent Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {account.first_name}! Manage your children&apos;s
          profiles below.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {/* Add New Child Button */}
      <div className="mb-8">
        <Button
          onClick={() => setViewMode("add")}
          style={{ backgroundColor: "rgb(13, 148, 71)" }}
          className="text-white"
        >
          + Add New Child Profile
        </Button>
      </div>

      {/* Children Profiles Grid */}
      {childrenProfiles.length === 0 ? (
        <Card className="w-full">
          <CardHeader className="text-center py-12">
            <CardTitle className="text-gray-600">
              No Child Profiles Yet
            </CardTitle>
            <CardDescription>
              Click the &quot;Add New Child Profile&quot; button above to create
              your first child&apos;s profile.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childrenProfiles.map(profile => (
            <ChildProfileCard
              key={profile.id}
              profile={profile}
              onEdit={startEditingProfile}
              onDelete={handleDeleteChild}
              deleting={deletingProfileId === profile.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
