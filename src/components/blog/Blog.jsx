import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Avatar, message, Card, List, Input, Popconfirm, Pagination, Select, Menu, Button } from 'antd';
import { SearchOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import Auth from '../../service/auth'
import Blog from '../../service/blog'
import { Link } from 'react-router-dom';
const { Option } = Select;
const { Meta } = Card;

function GetAllblog() {
  const [blog, setblog] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [size, setSize] = useState('large');
  const [totals, setTotals] = useState({
    totalRecords: 0,
    totalDicomRecords: 0,
    totalUcademyRecords: 0,
  });

  useEffect(() => {
    fetchData();
    totalRecords();
  }, [currentPage, title, location, startDate]);

  async function fetchData() {
    try {
      const { blogs, totalPages } = await Blog.getAllBlogs(currentPage, title, location, startDate);
      setblog(blogs);
      setTotalPages(totalPages);
    } catch (error) {}
  }

  async function totalRecords() {
    try {
      const response = await Blog.gettotalBlog();
      setTotals(response);
    } catch (error) {}
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleLocationChange = (value) => {
    setLocation(value);
    setCurrentPage(1);
  };
  const handleDelete = async (_id) => {
    try {
      const response = await Blog.deleteBlog(_id);
      if (response) {
        message.success('Blog deleted successfully');
        setblog(blog.filter((blog) => blog._id !== _id));
      } else {
        message.error(response.message || 'An error occurred');
      }
    } catch (error) {
      message.error('An error occurred');
    }
  };

  return (
    <div>
      <section className="wrapper bg-light">
        <strong className='total'>Total number of blog: <span className='total-blog'>{totals.totalRecords}</span></strong> ||
        <strong className='total'>Dicom's total number of blog: <span className='total-blog'>{totals.totalDicomRecords}</span></strong> ||
        <strong className='total'>Ucademy's total blog: <span className='total-blog'>{totals.totalUcademyRecords}</span></strong>
        <div>
          <Link to="/app_blog"><Button type="primary" className="app_blog" icon={<PlusOutlined style={{ marginTop: '5px' }} />} size={size}> New blog</Button></Link>
          <div className='mb-2' style={{ height: '10px' }}></div>
          <div className="">
            <Input placeholder="input search text" prefix={<SearchOutlined />} value={title} onChange={handleTitleChange} style={{ marginTop: 5, marginRight: 5 }} className='input_search' />
            <Select value={location} onChange={handleLocationChange} placeholder="Storage location" defaultValue="Study" style={{ marginTop: 5, marginRight: 5, width: 200, }} className='input_search'>
              <Option value="">All</Option>
              <Option value="dicom">Dicom</Option>
              <Option value="ucademy">Ucademy</Option>
            </Select>
          </div>
          <div className='mb-2' style={{ height: '20px' }}></div>
          <div className="">
            <List grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4, }}
              dataSource={blog}
              renderItem={(item, index) => {
                const timestamp = item.createAt;
                const dateObj = new Date(timestamp * 1000);
                const formattedDate = dateObj.toDateString("en-US");
                const statusClass = item.status === 'Public' ? 'public-status' : 'private-status';
                return (
                  <List.Item key={item.urlBlog}>
                    <Card cover={
                      <div className="image-container">
                        <Link to={`/edit/${item.urlBlog}`}><img className="img-responsive img" alt="example" style={{ height: "260px", padding: "5px" }} src={item.imageUrl} /></Link>
                        <div className="white-rectangle">
                          <p className={`centered-text ${statusClass}`}>{item.status}</p>
                        </div>
                        <div className="white-rectangle">
                          <p className={`public-location`}>{item.location}</p>
                        </div>
                      </div>
                    }
                      actions={[
                        <Link className='text' to={`${item.urlBlog}`}><FileTextOutlined key="edit" /></Link>,
                        <Popconfirm title={`Do you want to delete the Blog?`} onConfirm={() => handleDelete(item._id)} onCancel={() => setShowNotification(false)} okText="Yes" cancelText="No">
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]}
                    >
                      <List.Item.Meta className='text' style={{ height: "30px" }} title={<Link className='text' to={`/edit/${item.urlBlog}`}>{item.title}</Link>} /><br />
                      <Meta avatar={<Avatar src={item.avatar} />} title={item.author} description={formattedDate} />
                    </Card>
                  </List.Item>
                );
              }}
            />
          </div>
          <Pagination
            current={currentPage}
            total={totalPages * 10}
            onChange={handlePageChange}
            style={{ marginTop: '10px' }}
          />
        </div>
      </section>
    </div>
  );
}

export default GetAllblog;
