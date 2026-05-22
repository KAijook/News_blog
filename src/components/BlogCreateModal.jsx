import { useEffect } from "react";
import { blogAPI } from "../api";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import z from "zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  userId: z
    .string()
    .min(1, "User ID is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "User ID must be a number",
    }),
  tags: z.string().min(1, "Tags are required"),
  body: z.string().min(1, "Body is required"),
});

export default function BlogCreateModal({ isOpen, onClose, onBlogCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      userId: "",
      tags: "",
      body: "",
    },
  });

  const { mutate: createBlog, isPending } = useMutation({
    mutationFn: (blogData) => blogAPI.createPost(blogData),
    onSuccess: (data) => {
      toast.success("Blog created successfully!");
      onBlogCreated(data);
      setTimeout(() => {
        onClose();
      }, 1500);
    },
    onError: (err) => {
      console.error("Failed to create blog:", err);
      toast.error("Failed to create blog");
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (formData) => {
    const payload = {
      title: formData.title.trim(),
      body: formData.body.trim(),
      userId: parseInt(formData.userId, 10),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    createBlog(payload);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new blog post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-[24px]">
          <div className="mb-[20px]">
            <label htmlFor="title" className="block mb-[8px] font-semibold text-[#111827] text-[0.95rem]">Blog Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter blog title"
              disabled={isPending}
              {...register("title")}
              className="w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
            />

            {errors.title && <p className="text-[#dc2626] text-[0.9rem] mb-[12px] mt-[8px] p-[8px_12px] bg-[#dc2626]/10 rounded-[6px]">{errors.title.message}</p>}
          </div>

          <div className="mb-[20px]">
            <label htmlFor="userId" className="block mb-[8px] font-semibold text-[#111827] text-[0.95rem]">User ID</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter user ID"
              disabled={isPending}
              {...register("userId")}
              className="w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
            />
            {errors.userId && <p className="text-[#dc2626] text-[0.9rem] mb-[12px] mt-[8px] p-[8px_12px] bg-[#dc2626]/10 rounded-[6px]">{errors.userId.message}</p>}
          </div>

          <div className="mb-[20px]">
            <label htmlFor="tags" className="block mb-[8px] font-semibold text-[#111827] text-[0.95rem]">Tags (comma separated)</label>
            <input
              id="tags"
              type="text"
              placeholder="e.g. tech, programming"
              disabled={isPending}
              {...register("tags")}
              className="w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
            />
            {errors.tags && <p className="text-[#dc2626] text-[0.9rem] mb-[12px] mt-[8px] p-[8px_12px] bg-[#dc2626]/10 rounded-[6px]">{errors.tags.message}</p>}
          </div>

          <div className="mb-[20px]">
            <label htmlFor="body" className="block mb-[8px] font-semibold text-[#111827] text-[0.95rem]">Blog Body</label>
            <textarea
              id="body"
              placeholder="Enter blog content"
              disabled={isPending}
              {...register("body")}
              className="h-[100px] w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
            />
            {errors.body && <p className="text-[#dc2626] text-[0.9rem] mb-[12px] mt-[8px] p-[8px_12px] bg-[#dc2626]/10 rounded-[6px]">{errors.body.message}</p>}
          </div>

          <div className="flex gap-[12px] justify-end mt-[24px]">
            <button 
              type="submit" 
              disabled={isPending} 
              className="border-none rounded-[8px] p-[10px_16px] font-semibold cursor-pointer transition-all duration-200 text-[0.95rem] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white hover:not:disabled:-translate-y-[2px] hover:not:disabled:shadow-[0_10px_22px_rgba(102,126,234,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Create Blog"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="border-none rounded-[8px] p-[10px_16px] font-semibold cursor-pointer transition-all duration-200 text-[0.95rem] bg-[#e5e7eb] text-[#111827] hover:not:disabled:bg-[#d1d5db] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}