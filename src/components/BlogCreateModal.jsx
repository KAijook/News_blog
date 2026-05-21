import { useEffect } from 'react';
import { blogAPI } from '../api';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast'; 
import z from 'zod';


const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  userId: z
    .string()
    .min(1, 'User ID is required')
    .refine((val) => !isNaN(Number(val)), { message: 'User ID must be a number' }),
  tags: z.string().min(1, 'Tags are required'),
  body: z.string().min(1, 'Body is required'),
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
      title: '',
      userId: '',
      tags: '',
      body: '',
    },
  });

  
  const { mutate: createBlog, isPending } = useMutation({
    mutationFn: (blogData) => blogAPI.createPost(blogData),
    onSuccess: (data) => {
      toast.success('Blog created successfully!');
      onBlogCreated(data);
      setTimeout(() => {
        onClose();
      }, 1500);
    },
    onError: (err) => {
      console.error('Failed to create blog:', err);
      toast.error('Failed to create blog');
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
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        
    };

    createBlog(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Blog</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

     
        <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
          
      
          <div className="form-group">
            <label htmlFor="title">Blog Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter blog title"
              disabled={isPending}
              {...register('title')} 
            />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </div>

          
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text" 
              placeholder="Enter user ID"
              disabled={isPending}
              {...register('userId')}
            />
            {errors.userId && <p className="error">{errors.userId.message}</p>}
          </div>

          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              id="tags"
              type="text"
              placeholder="e.g. tech, programming"
              disabled={isPending}
              {...register('tags')}
            />
            {errors.tags && <p className="error">{errors.tags.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="body">Blog Body</label>
            <textarea
              id="body"
              placeholder="Enter blog content"
              disabled={isPending}
              {...register('body')}
            />
            {errors.body && <p className="error">{errors.body.message}</p>}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? 'Creating...' : 'Create Blog'}
            </button>
            <button type="button" onClick={onClose} disabled={isPending} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}