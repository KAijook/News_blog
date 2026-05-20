import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { blogAPI } from '../api';
export default function SingleBlog({ blog, onBlogUpdated, onBlogDeleted }) {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editTitle, setEditTitle] = useState(blog.title);
  const [body, setBody] = useState(blog.body);
const [userId, setUserId] = useState(blog.userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = () => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    blogAPI.editPost(blog.id, {
      title: editTitle.trim(),
      body: body.trim(),
      userId: parseInt(userId)
    })
      .then((res) => res.data)
      .then((data) => {
        onBlogUpdated(data);
        setShowEditModal(false);
      })
      .catch((err) => {
        console.error('Failed to update:', err);
        setError('Failed to update blog');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoading(true);
    setError('');

    blogAPI.deletePost(blog.id)
      .then(() => {
        onBlogDeleted(blog.id);
        navigate('/');
      })
      .catch((err) => {
        console.error('Failed to delete:', err);
        setError('Failed to delete blog');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="single-blog">
      <div className="single-blog__actions">
        <button className="btn-edit" onClick={() => setShowEditModal(true)} disabled={loading}>✎ Edit</button>
        <button className="btn-delete" onClick={() => setDeleteConfirm(true)} disabled={loading}>🗑 Delete</button>
      </div>

      {error && <p className="error-message">{error}</p>}

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
              {error && <p className="error">{error}</p>}
              <div className="form-group">
                <label htmlFor="edit-title">Blog Title</label>
                <input id="edit-title" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} disabled={loading} />
                <label htmlFor="edit-body">Blog Body</label>
                <textarea id="edit-body" value={body} onChange={(e) => setBody(e.target.value)} disabled={loading} />
                <label htmlFor="edit-userId">User ID</label>
                <input id="edit-userId" value={userId} onChange={(e) => setUserId(e.target.value)} disabled={loading} />
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleEdit} disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
                <button className="btn-secondary" onClick={() => setShowEditModal(false)} disabled={loading}>Cancel</button>
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
                <button className="btn-danger" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
                <button className="btn-secondary" onClick={() => setDeleteConfirm(false)} disabled={loading}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
