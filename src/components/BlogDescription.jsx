import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { blogAPI } from '../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
export default function BlogDescription({ blog }) {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
const updateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  userId: z
    .string()
    .min(1, 'User ID is required')})
const {
  register,
  handleSubmit,
  reset,
  formState: {errors}} = useForm({
  resolver: zodResolver(updateSchema),
  defaultValues: {
    title: blog.title,
    body: blog.body,
    userId: blog.userId.toString(),
  }
});
const queryClient = useQueryClient();
const { mutate: updateBlog, isPending: updating,isSuccess, } = useMutation({

    mutationFn: (updatedData) => blogAPI.updatePost(blog.id, updatedData),
    onSuccess: (data) => {
      setShowEditModal(false);

      queryClient.invalidateQueries({ queryKey: ['blog', blog.id] });
      toast.success('Blog updated successfully');
     
    },
    onError: (err) => {
      console.error('Failed to update blog:', err);
      toast.error('Failed to update blog');
    }
  });
  const { mutate: deleteBlog, isPending: deleting, } = useMutation({
    mutationFn: () => blogAPI.deletePost(blog.id),
    onSuccess: () => {
      setDeleteConfirm(false);
     queryClient.invalidateQueries({ queryKey: ['blog', blog.id] });
      toast.success('Blog deleted successfully');
      navigate('/');
    },
    onError: (err) => {
      console.error('Failed to delete blog:', err);
      toast.error('Failed to delete blog');
    }
  });

  const handleEdit = (data) => {
    updateBlog(data);
  };

  const handleDelete = () => {
    deleteBlog();
  };

  return (
    <div className="single-blog">
      <div className="single-blog__actions">
        <button className="btn-edit" onClick={() => setShowEditModal(true)} disabled={updating}>✎ Edit</button>
        <button className="btn-delete" onClick={() => setDeleteConfirm(true)} disabled={deleting}>🗑 Delete</button>
      </div>

      <div className="single-blog__tags">
        {blog.tags?.map((tag, idx) => (<span className="blog-item__tag" key={`${tag}-${idx}`}>{tag}</span>))}
      </div>

      <h3 className="single-blog__title">{blog.title}</h3>
      <p className="single-blog__excerpt">{blog.body}</p>
      <p className="blog-item__meta">Post by #{blog.userId}</p>
      <p className="blog-item__meta">Views: {blog.views}</p>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Edit Blog</h2><button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button></div>
            <div className="modal-body">
             
              <div className="form-group">
                <label htmlFor="edit-title">Blog Title</label>
                <input id="edit-title" type="text" {...register('title')} disabled={updating} />
                <label htmlFor="edit-body">Blog Body</label>
                <textarea id="edit-body" {...register('body')} disabled={updating} />
                <label htmlFor="edit-userId">User ID</label>
                <input id="edit-userId" {...register('userId')} disabled={updating} />
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleSubmit(handleEdit)} disabled={updating}>{updating ? 'Updating...' : 'Update'}</button>
                <button className="btn-secondary" onClick={() => setShowEditModal(false)} disabled={updating}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Delete Blog</h2><button className="modal-close" onClick={() => setDeleteConfirm(false)}>✕</button></div>
            <div className="modal-body">
              <p>Are you sure you want to delete this blog post? This action cannot be undone.</p>
              <div className="form-actions">
                <button className="btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
                <button className="btn-secondary" onClick={() => setDeleteConfirm(false)} disabled={deleting}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
