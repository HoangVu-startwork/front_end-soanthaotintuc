import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, theme, Avatar, Space } from 'antd';
import { ContainerOutlined, LogoutOutlined, LoginOutlined, UserSwitchOutlined, FolderOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Auth from '../../service/auth'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../../assets/css/blog.css';
import BlogDetail from './Detail.jsx';
import Edit from './Edit.jsx';
import Addblog from './Add';
import Blog from './Blog.jsx';
import Editblog from './Editblog.jsx';

const { Content, Sider } = Layout;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function Dashboard() {
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub4', 'sub5'];
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const [userData, setUserData] = useState(null);
  const history = useNavigate();

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleLogout = () => {
    try {
      // Perform the function of deleting tokens in the database and performing the logout function
      const token = window.localStorage.getItem("token");
      const response = Auth.deletetoken(token)
      if (response.data) {
        setUserData(null);
        window.location.replace("/");
        window.localStorage.removeItem('token');
      } else {
        // Once deleted, it will immediately perform a token check
        setUserData(null);
        window.location.replace("/");
        window.localStorage.removeItem('token');
      }
    } catch (error) {}
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      Auth.getUserData(token)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          setError("An error occurred while fetching user data. Please try again later.");
        });
    } else {
      setError("Unauthorized: Missing token");
    }
  }, [history]);

  return (
    <div>
      <Layout>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{
          position: 'fixed',
          height: '100%',
          zIndex: 1,
          overflow: 'auto',
          left: 0,
        }}>
          <div className="demo-logo-vertical" />
          {userData &&
            <div>
              <Avatar size={64} className="menu-item avatar" src={userData.avatar} />
              <p className='span-item'>{userData.name}</p>
            </div>}
          <Menu theme="dark" defaultSelectedKeys={['']} mode="inline" openKeys={openKeys} onOpenChange={onOpenChange}>
            {userData && userData.role === 'admin' && (
              <><Menu.SubMenu icon={<FolderOutlined style={{ fontSize: '19px', }} />} title="Blog">
                <Menu.Item icon={<ContainerOutlined />}>
                  <Link style={{ textDecoration: 'none' }} to="blog">Blog</Link>
                </Menu.Item>
              </Menu.SubMenu></>
            )}
            {userData && userData.role === 'edit' && (
              <Menu.SubMenu icon={<FolderOutlined style={{ fontSize: '19px', }} />} title="Blog" >
                <Menu.Item icon={<ContainerOutlined />}>
                  <Link style={{ textDecoration: 'none' }} to="blog-edit">Blog</Link>
                </Menu.Item>
              </Menu.SubMenu>
            )}
          </Menu>
          {userData !== null &&
            <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} style={{ fontSize: '15px', }} title="">
              <Menu.Item icon={<LogoutOutlined style={{ fontSize: '19px', }} />}>
                <Link onClick={handleLogout} style={{ textDecoration: 'none' }} to="/">Log out</Link>
              </Menu.Item>
            </Menu>
          }
          {userData === null &&
            <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} style={{ fontSize: '15px', }}>
              <Menu.Item icon={<LoginOutlined style={{ fontSize: '19px', }} />}>
                <Link onClick={handleLogout} style={{ textDecoration: 'none' }} to="/">Log In </Link>
              </Menu.Item>
            </Menu>

          }
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Content style={{ margin: '0 16px', }} >
            <div style={{ padding: 24, minHeight: 500, background: colorBgContainer }}>
              <Routes >
                {userData && userData.role === 'admin' && (
                  <>
                    <Route path="/app_blog" element={<Addblog />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:urlBlog" element={<BlogDetail />} />
                    <Route path="/edit/:urlBlog" element={<Edit />} />
                  </>
                )}
                {userData && userData.role === 'edit' && (
                  <>
                    <Route path="/blog-edit" element={<Editblog />} />
                    <Route path="/blog-edit/:urlBlog" element={<BlogDetail />} />
                    <Route path="/edit/:urlBlog" element={<Edit />} />
                  </>
                )}
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default Dashboard;

