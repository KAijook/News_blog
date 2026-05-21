import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BlogDescription from '../components/BlogDescription';
import { blogAPI } from '../api';
import { useQuery } from '@tanstack/react-query';

export default function BlogSingle() {
     const { id, searchTerm } = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogAPI.getPostById(id).then(res => res.data),
        enabled: !!id

    });




    if (!data) {
        return <p>Blog not found</p>;
    }
    if (isLoading) {
        return <p>Loading...</p>;
    }
  return (
    

    <section className="blog-single">
        <BlogDescription
          blog={data} 
        />
    </section>
  );
}
