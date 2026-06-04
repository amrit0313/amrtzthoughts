"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Upload } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useUpdateProfile } from "@/hooks/useUser";
import { User } from "@/types";

const profileSchema = z.object({
  genre: z.enum(["comedy", "other"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({
  user,
  isOpen,
  onClose,
}: ProfileEditModalProps) {
  const updateProfile = useUpdateProfile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      genre: user.genre || "other",
    },
  });

  React.useEffect(() => {
    if (!isOpen) return;

    reset({ genre: user.genre || "other" });
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
  }, [isOpen, reset, user.genre]);

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const onSubmit = async ({ genre }: ProfileFormValues) => {
    try {
      setError("");
      await updateProfile.mutateAsync({
        userId: user.id,
        genre,
        file: selectedFile,
      });
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to update your profile right now.",
      );
    }
  };

  const avatarSource = previewUrl || user.profilePic;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update profile"
      className="max-w-3xl border-border bg-white p-0"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 sm:p-7">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[minmax(0,240px)_1fr] md:items-start">
          <div className="rounded-3xl border border-border bg-mist p-5">
            <div className="flex items-center gap-3 text-sm font-medium text-black">
              <Camera className="h-4 w-4" />
              Profile photo
            </div>

            <div className="mt-5 flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <Avatar
                  src={avatarSource}
                  alt={user.name || "User"}
                  initials={user.name?.[0] || user.email[0]}
                  size="xl"
                  className="h-28 w-28 rounded-2xl border border-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                />
                <div className="absolute -bottom-2 -right-2 rounded-full border border-border bg-white p-2 shadow-sm">
                  <Upload className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose image
                </Button>
                <p className="text-xs leading-5 text-muted-foreground">
                  PNG, JPG, or WebP. A square image works best.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Public identity
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Tune what people see first
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Update your genre and profile image. The rest of your account
                stays untouched.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Name
                </p>
                <p className="mt-2 font-medium text-black">
                  {user.name || "Anonymous"}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </p>
                <p className="mt-2 truncate font-medium text-black">
                  {user.email}
                </p>
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-black"
                htmlFor="genre"
              >
                Genre
              </label>
              <select
                id="genre"
                {...register("genre")}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-black transition-colors focus:border-black focus:outline-none"
              >
                <option value="comedy">Comedy</option>
                <option value="other">Other</option>
              </select>
              {errors.genre && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.genre.message}
                </p>
              )}
            </div>

            {selectedFile && (
              <div className="rounded-2xl border border-border bg-mist px-4 py-3 text-sm text-black">
                Selected file:{" "}
                <span className="font-medium">{selectedFile.name}</span>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="rounded-full px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting || updateProfile.isPending}
                className="rounded-full px-6"
              >
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
