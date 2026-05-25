import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { blogAPI } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BlogDescription({ blog, onBlogUpdated }) {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  const updateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    userId: z.string().min(1, "User ID is required"),
  });

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: blog.title,
      body: blog.body,
      userId: blog.userId.toString(),
    },
  });
  
  const queryClient = useQueryClient();
  
  const { mutate: updateBlog, isPending: updating } = useMutation({
    mutationFn: (updatedData) => blogAPI.updatePost(blog.id, updatedData),
    onSuccess: () => {
      setShowEditModal(false);
      toast.success("Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blog", blog.id] });
      onBlogUpdated?.();
    },
    onError: (err) => {
      console.error("Failed to update blog:", err);
      toast.error("Failed to update blog");
    },
  });
  
  const { mutate: deleteBlog, isPending: deleting } = useMutation({
    mutationFn: () => blogAPI.deletePost(blog.id),
    onSuccess: () => {
      setDeleteConfirm(false);
      toast.success("Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blog", blog.id] });
      navigate("/");
    },
    onError: (err) => {
      console.error("Failed to delete blog:", err);
      toast.error("Failed to delete blog");
    },
  });

  return (
    <div className="max-w-[760px] mx-auto p-[28px] bg-white/90 border border-slate-900/[0.08] rounded-[24px] shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
    

      <div className="flex flex-wrap gap-[8px] mb-[16px]">
        {blog.tags?.map((tag, idx) => (
          <span 
            className="inline-flex min-w-[74px] justify-center box-border p-[0.3rem_0.5rem] rounded-full bg-[#667eea]/12 text-[#4c51bf] m-[0_6px_6px_0] text-[0.7rem] font-extrabold tracking-[0.08em] uppercase" 
            key={`${tag}-${idx}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="m-[0_0_16px] text-[2rem] text-[#111827] leading-[1.2]">{blog.title}</h3>
      <p className="text-[#475569] leading-[1.8] mb-[20px]">{blog.body}</p>
      <p className="mt-[18px] mb-0 text-[#6b7280] text-[0.92rem]">Post by #{blog.userId}</p>
      <p className="mt-[18px] mb-0 text-[#6b7280] text-[0.92rem]">Views: {blog.views}</p>
  <div className="flex flex-wrap md:flex-nowrap md:flex-row flex-col gap-[12px] mb-[24px]">
        <button
          className="p-[10px_16px] rounded-[8px] border-none font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center md:justify-start gap-[6px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white hover:not:disabled:-translate-y-[2px] hover:not:disabled:shadow-[0_10px_22px_rgba(102,126,234,0.3)] disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
          onClick={() => setShowEditModal(true)}
          disabled={updating}
        >
          ✎ Edit
        </button>
        <button
          className="p-[10px_16px] rounded-[8px] border-none font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center md:justify-start gap-[6px] bg-[#ef4444] text-white hover:not:disabled:bg-[#dc2626] hover:not:disabled:-translate-y-[2px] hover:not:disabled:shadow-[0_10px_22px_rgba(239,68,68,0.3)] disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
          onClick={() => setDeleteConfirm(true)}
          disabled={deleting}
        >
          🗑 Delete
        </button>
      </div>
      {showEditModal && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Blog</DialogTitle>
            </DialogHeader>
              
            
            <form onSubmit={handleSubmit((data) => updateBlog(data))} className="p-[24px]">
              <div className="mb-[20px]">
                <label htmlFor="edit-title" className="block mb-[8px] font-semibold text-[#111827] text-[0.95rem]">Blog Title</label>
                <input
                  id="edit-title"
                  type="text"
                  className="w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
                  {...register("title")}
                  disabled={updating}
                />
                <label htmlFor="edit-body" className="block mt-[12px] mb-[8px] font-semibold text-[#111827] text-[0.95rem]">Blog Body</label>
                <textarea
                  id="edit-body"
                  className="h-[200px] w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
                  {...register("body")}
                  disabled={updating}
                />
                <label htmlFor="edit-userId" className="block mt-[12px] mb-[8px] font-semibold text-[#111827] text-[0.95rem]">User ID</label>
                <input
                  id="edit-userId"
                  className="w-full p-[10px_12px] border border-slate-900/10 rounded-[8px] font-inherit text-[1rem] transition-[border-color,box-shadow] duration-200 box-border focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
                  {...register("userId")}
                  disabled={updating}
                />
              </div>
              <div className="flex gap-[12px] justify-end mt-[24px]">
                <button
                  className="border-none rounded-[8px] p-[10px_16px] font-semibold cursor-pointer transition-all duration-200 text-[0.95rem] bg-linear-to-br from-[#667eea] to-[#764ba2] text-white hover:not:disabled:-translate-y-[2px] hover:not:disabled:shadow-[0_10px_22px_rgba(102,126,234,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update"}
                </button>
                <button
                  className="border-none rounded-[8px] p-[10px_16px] font-semibold cursor-pointer transition-all duration-200 text-[0.95rem] bg-[#e5e7eb] text-[#111827] hover:not:disabled:bg-[#d1d5db] disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => setShowEditModal(false)}
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
             </form>
             
          </DialogContent>
        </Dialog>
      )}

      {deleteConfirm && (
        <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
          <DialogContent className="max-w-[400px] p-[24px] max-h-[300px]">
            <DialogHeader>
              <DialogTitle className="mb-[2px]">Delete Blog</DialogTitle>
            </DialogHeader>
             
            <div className="p-[24px] flex flex-col items-start">
              <p className="text-[#475569] leading-[1.75] text-center mb-[25px] text-[0.9rem] font-bold">
                Are you sure you want to delete this blog post? 
                <p>This action
                cannot be undone.</p>
              </p>
              <div className="flex gap-[12px] flex-wrap justify-end md:justify-start w-full md:w-auto mt-[18px]">
                <button
                  className="border-none rounded-[8px] p-[10px_16px] font-semibold cursor-pointer transition-all duration-200 text-[0.95rem] bg-[#ef4444] text-white hover:not:disabled:bg-[#dc2626] hover:not:disabled:-translate-y-[2px] hover:not:disabled:shadow-[0_10px_22px_rgba(239,68,68,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => deleteBlog()}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  className="border-none rounded-[8px] p-[10px_16px] font-semibold cursor-pointer transition-all duration-200 text-[0.95rem] bg-[#e5e7eb] text-[#111827] hover:not:disabled:bg-[#d1d5db] disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            
          </div>
        </DialogContent>
         </Dialog>
      )}
   </div>
  );
}