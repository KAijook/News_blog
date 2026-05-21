import { useState } from 'react';
import { blogAPI } from '../api';
export default function BlogCreateModal({ isOpen, onClose, onBlogCreated }) {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !userId.trim()) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    blogAPI.createPost({
      title: title.trim(),
      body: body.trim(),
      userId: parseInt(userId),
      tags: tags.split(',').map((tag) => tag.trim())
    })
      .then((data) => {
        setSuccess('Blog created successfully!');
        onBlogCreated(data);
        setTimeout(() => {
          setTitle('');
          setUserId('');
          setTags('');
          setBody('');
          setSuccess('');
          onClose();
        }, 1500);
      })
      .catch((err) => {
        console.error('Failed to create blog:', err);
        setError('Failed to create blog');
      })
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Blog</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          
          <div className="form-group">
            <label htmlFor="title">Blog Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="number"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              id="tags"
              type="text"
              placeholder="e.g. tech, programming"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">  
            <label htmlFor="body">Blog Body</label>
            <textarea
              id="body"
              placeholder="Enter blog content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
            <button type="button" onClick={onClose} disabled={loading} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
