"use client";

import { useState } from "react";
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
import { useAccount } from "@/hooks/useAccount";
import type { UpdateAccountRequest } from "@/types/api";

interface EditProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditProfileForm({ onCancel, onSuccess }: EditProfileFormProps) {
  const { account, updateAccount, isUpdating, updateError } = useAccount();

  const [formData, setFormData] = useState<UpdateAccountRequest>({
    first_name: account?.first_name || "",
    last_name: account?.last_name || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateAccount(formData, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  const handleInputChange =
    (field: keyof UpdateAccountRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleInputChange("first_name")}
              required
              disabled={isUpdating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleInputChange("last_name")}
              required
              disabled={isUpdating}
            />
          </div>

          {updateError && (
            <div className="text-red-600 text-sm">
              Error updating profile: {updateError.message}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
