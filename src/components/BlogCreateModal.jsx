import { useEffect } from "react";
import { blogAPI } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
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
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxValue,
  ComboboxChipsInput,
} from "@/components/ui/combobox";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  userId: z
    .string()
    .min(1, "User ID is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "User ID must be a number",
    }),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .refine((tags) => tags.every((tag) => tag.trim().length > 0), {
      message: "Tags cannot be empty",
    }),
  body: z.string().min(1, "Body is required"),
});

export default function BlogCreateModal({ isOpen, onClose, onBlogCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      userId: "",
      tags: [],
      body: "",
    },
  });
  const queryClient = useQueryClient();
  //get tags for suggestions
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => blogAPI.getTagList().then((res) => res.data),
  });

  // Mutation for creating a new blog post
  const { mutate: createBlog, isPending } = useMutation({
    mutationFn: (blogData) => blogAPI.createPost(blogData),
    onSuccess: (data) => {
      toast.success("Blog created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onBlogCreated?.(data);
      reset();
      onClose();
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
      tags: formData.tags.map((tag) => tag.trim()).filter(Boolean),
    };

    createBlog(payload);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Blog</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new blog post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-[24px]">
          {/* Title Field */}
          <div className="mb-[20px]">
            <label
              htmlFor="title"
              className="block mb-[8px] font-semibold text-[#111827] text-[0.95rem]"
            >
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter blog title"
              disabled={isPending}
              {...register("title")}
              className="w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
            />
            {errors.title && (
              <p className="text-[#dc2626] text-[0.9rem] mb-[12px] mt-[8px] p-[8px_12px] bg-[#dc2626]/10 rounded-[6px]">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* User ID Field */}
          <div className="mb-[20px]">
            <label
              htmlFor="userId"
              className="block mb-[8px] font-semibold text-[#111827] text-[0.95rem]"
            >
              User ID
            </label>
            <input
              id="userId"
              type="text"
              placeholder="Enter user ID"
              disabled={isPending}
              {...register("userId")}
              className="w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
            />
            {errors.userId && (
              <p className="text-[#dc2626] text-[0.9rem] mb-[12px] mt-[8px] p-[8px_12px] bg-[#dc2626]/10 rounded-[6px]">
                {errors.userId.message}
              </p>
            )}
          </div>

          {/* Tags Field with Combobox */}
          <div className="mb-[20px]">
            <label
              htmlFor="tags"
              className="block mb-[8px] font-[400] text-[#111827] text-[0.95rem]"
            >
              Tags
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Combobox
                  items={tagsData || []}
                  multiple
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                  portal={false}
                >
                  <ComboboxChips className="w-full bg-[#fff] min-h-[42px] p-[6px_12px] border border-slate-900/10 rounded-[8px] transition-[border-color,box-shadow] duration-200 focus-within:border-[#667eea] focus-within:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]">
                    <ComboboxValue>
                      {field.value.map((item) => (
                        <ComboboxChip
                          key={item}
                          className="bg-[#667eea] text-[#fff] px-[10px]  rounded-[6px] text-[0.875rem] flex items-center gap-[6px] m-[2px]"
                        >
                          {item}
                        </ComboboxChip>
                      ))}
                    </ComboboxValue>
                    <ComboboxChipsInput
                      placeholder={
                        field.value.length === 0
                          ? "Type to add or select tags..."
                          : "Add more tags..."
                      }
                      className="min-w-[120px] flex-1 border-0 bg-transparent px-0 py-0 text-[1rem] outline-none placeholder:text-[#9ca3af] placeholder:opacity-100 placeholder:text-[1rem] focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                          e.preventDefault();
                          const newTag = e.currentTarget.value.trim();
                          if (!field.value.includes(newTag)) {
                            field.onChange([...field.value, newTag]);
                          }
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </ComboboxChips>
                  <ComboboxContent className="max-h-[200px] overflow-y-auto border border-slate-900/10 rounded-[8px] bg-[#fff] shadow-lg mt-[4px] z-50">
                    <ComboboxEmpty className="p-[12px] text-center text-[#6b7280] text-[0.9rem]">
                      No tags found
                    </ComboboxEmpty>
                    <ComboboxList>
                      {tagsData?.map((item) => (
                        <ComboboxItem
                          key={item}
                          value={item}
                          className="p-[10px_16px] cursor-pointer hover:bg-[#f3f4f6] transition-colors duration-150 text-[0.95rem]"
                        >
                          {item}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
            {errors.tags && (
              <p className="text-[#dc2626] text-[0.9rem] mb-[12px] mt-[8px] p-[8px_12px] bg-[#dc2626]/10 rounded-[6px]">
                {errors.tags.message}
              </p>
            )}
            {/* Helper text */}
            <p className="text-[#6b7280] text-[0.875rem] mt-[6px]">
              Select from existing tags or type to create new ones. Press Enter
              to add.
            </p>
          </div>

          {/* Body Field */}
          <div className="mb-[20px]">
            <label
              htmlFor="body"
              className="block mb-[8px] font-semibold text-[#111827] text-[0.95rem]"
            >
              Blog Body
            </label>
            <textarea
              id="body"
              placeholder="Enter blog content"
              disabled={isPending}
              {...register("body")}
              className="h-[100px] w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af] resize-vertical"
            />
            {errors.body && (
              <p className="text-[#dc2626] text-[0.9rem] mb-[12px] mt-[8px] p-[8px_12px] bg-[#dc2626]/10 rounded-[6px]">
                {errors.body.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[12px] justify-end mt-[24px]">
            <button
              type="submit"
              disabled={isPending}
              className="border-none rounded-[8px] p-[10px_16px] font-semibold cursor-pointer transition-all duration-200 text-[0.95rem] bg-linear-to-br from-[#667eea] to-[#764ba2] text-[#fff] hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):shadow-[0_10px_22px_rgba(102,126,234,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating..." : "Create Blog"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="border-none rounded-[8px] p-[10px_16px] font-semibold cursor-pointer transition-all duration-200 text-[0.95rem] bg-[#e5e7eb] text-[#111827] hover:not(:disabled):bg-[#d1d5db] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}