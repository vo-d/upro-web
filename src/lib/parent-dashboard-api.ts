import { supabase } from "@/lib/supabase";
import {
  Account,
  ChildProfile,
  CreateChildProfileData,
  UpdateChildProfileData,
} from "@/types/parent-dashboard";

// Get the account information for the current authenticated user
export async function getCurrentAccount(): Promise<{
  data: Account | null;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "No authenticated user" };
    }

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch {
    return { data: null, error: "Failed to fetch account" };
  }
}

// Get all children profiles for a specific account
export async function getChildrenProfiles(
  accountId: number
): Promise<{ data: ChildProfile[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("account_id", accountId)
      .order("created_at", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch {
    return { data: null, error: "Failed to fetch children profiles" };
  }
}

// Create a new child profile
export async function createChildProfile(
  accountId: number,
  profileData: CreateChildProfileData
): Promise<{ data: ChildProfile | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...profileData,
          account_id: accountId,
          experience_total: 0.0,
          subscription_type: 1, // Default to freemium
          upro_gold: 0.0,
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch {
    return { data: null, error: "Failed to create child profile" };
  }
}

// Update a child profile
export async function updateChildProfile(
  accountId: number,
  profileData: UpdateChildProfileData
): Promise<{ data: ChildProfile | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(profileData)
      .eq("id", profileData.id)
      .eq("account_id", accountId) // Ensure parent can only update their own children
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch {
    return { data: null, error: "Failed to update child profile" };
  }
}

// Delete a child profile
export async function deleteChildProfile(
  accountId: number,
  childId: number
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", childId)
      .eq("account_id", accountId); // Ensure parent can only delete their own children

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch {
    return { error: "Failed to delete child profile" };
  }
}
