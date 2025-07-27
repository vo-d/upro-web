"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChildProfile, AGE_GROUPS } from "@/types/parent-dashboard";

interface ChildProfileCardProps {
  profile: ChildProfile;
  onEdit: (profile: ChildProfile) => void;
  onDelete: (profileId: number) => void;
  deleting?: boolean;
}

export function ChildProfileCard({
  profile,
  onEdit,
  onDelete,
  deleting = false,
}: ChildProfileCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getAgeGroupLabel = (ageGroup: number): string => {
    const group = AGE_GROUPS.find(g => g.value === ageGroup);
    return group?.label || "Unknown";
  };

  const getDominantFootLabel = (dominantFoot?: boolean): string => {
    if (dominantFoot === undefined) return "Not specified";
    return dominantFoot ? "Right Foot" : "Left Foot";
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(profile.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Card className="w-full transition-shadow hover:shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profile.profile_picture ? (
              <Image
                src={profile.profile_picture}
                alt={`${profile.name}'s avatar`}
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <div className="text-2xl text-gray-500">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-xl">{profile.name}</CardTitle>
        <CardDescription>{getAgeGroupLabel(profile.age_group)}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Gender:</span>
            <div>{profile.gender}</div>
          </div>

          {profile.weight && (
            <div>
              <span className="font-medium text-gray-600">Weight:</span>
              <div>{profile.weight} kg</div>
            </div>
          )}

          {profile.height && (
            <div>
              <span className="font-medium text-gray-600">Height:</span>
              <div>{profile.height} cm</div>
            </div>
          )}

          <div>
            <span className="font-medium text-gray-600">Dominant Foot:</span>
            <div>{getDominantFootLabel(profile.dominant_foot)}</div>
          </div>

          {profile.playing_position && (
            <div className="col-span-2">
              <span className="font-medium text-gray-600">Position:</span>
              <div>{profile.playing_position}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Experience:</span>
            <div>{profile.experience_total} XP</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">U-Pro Gold:</span>
            <div className="text-yellow-600 font-medium">
              🪙 {profile.upro_gold}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          {!showDeleteConfirm ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(profile)}
                className="flex-1 mr-2"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="flex-1 ml-2 text-red-600 border-red-200 hover:bg-red-50"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelDelete}
                className="flex-1 mr-2"
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDelete}
                className="flex-1 ml-2 bg-red-600 hover:bg-red-700 text-white"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
