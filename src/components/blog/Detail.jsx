import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Avatar } from 'antd';
import Blog from '../../service/blog'

function Getblog() {
    const { urlBlog } = useParams();
    const [blog, setBlog] = useState({ category: [] });
    useEffect(() => {
        fetchData();
    }, [urlBlog]);

    async function fetchData() {
        try {
            const blogData = await Blog.getBlogByUrl(urlBlog);
            setBlog(blogData);
        } catch (error) { }
    }
    const timestamp = blog.createAt;
    const dateObj = new Date(timestamp * 1000);
    const formattedDate = dateObj.toDateString("en-US");

    return (
        <div>
            <section className="">
                <div className="container py-4">
                    <div className="row">
                        <div className="col-lg-10">
                            <div className="blog">
                                <article className="post">
                                    <div className="card">
                                        <img className="img-responsive" src={blog.imageUrl} alt='' />
                                        <div className="card-body">
                                            <div className="widget mb-5">
                                                <ul className="image-list">
                                                    <li>
                                                        <figure className="" src={blog.avatar}><Avatar size={64} className="avatar bg-pale-primary text-primary img-responsive" src={blog.avatar} /></figure>
                                                        <div className="post-content">
                                                            <h6 className="mb-2 testavat">{blog.author}</h6>
                                                            <ul className="post-meta">
                                                                <span className="post-date"><span>{formattedDate}</span></span>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="post-heade ">
                                                <div className="post-category text-line code-xxl-6">Teamwork</div>
                                            </div>
                                            <br />
                                            <div className="post-content">
                                                <span>
                                                    {blog && Array.isArray(blog.category) && blog.category.map((cat, index) => (
                                                        <li key={index} className="badge-container badge badge-pill badge-success g-6" style={{ background: '#ed3312', fontSize: '15px' }}>{cat}</li>
                                                    ))}
                                                </span>
                                                <span className="badge-container badge badge-pill bs-color" style={{ background: '#e6520e', fontSize: '15px' }}>
                                                    {blog.highlightTags}
                                                </span>
                                                <h2 className="post-title mt-1 mb-0">{blog.title}</h2>
                                                <div className="post-title" dangerouslySetInnerHTML={{ __html: (blog.description) }} />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </div></div>
            </section>
        </div>
    )
}

export default Getblog
