import React, { useState, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import Axios from 'axios';
import unidecode from "unidecode";
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Select, Upload, message, Button, Popconfirm } from 'antd';
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { editorConfig } from './EditorConfig';
import '../../assets/css/blog.css';
import { Link } from 'react-router-dom';
import Auth from '../../service/auth'
import Blog from '../../service/blog'
import { MdCloudUpload, MdDelete, MdSaveAlt } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const { TextArea } = Input;
const { Option } = Select;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
function AddBlog() {
  const [editorContent, setEditorContent] = useState('');
  const [category, setCategory] = useState([]);
  const [highlightTags, setState] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [blogurl, setblogurl] = useState('');
  const [user, setUser] = useState('');
  const [userData, setUserData] = React.useState('');
  const [language, setlanguage] = useState('en');
  const [code, setcode] = useState('');
  const [macode, setmacode] = useState([]);
  const [codedicom, setcodedicom] = useState([])
  const [showNotification, setShowNotification] = useState(false);
  const [slug, setslug] = useState('')
  const [form] = Form.useForm();
  const token = window.localStorage.getItem('token');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showClassificationCode, setShowClassificationCode] = useState(true);
  const [metaimage, setmetaImage] = useState('');
  const [imageEditor, setiImageEditor] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [showChangeImageConfirmation, setShowChangeImageConfirmation] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isMetaUploaded, setIsMetaUploaded] = useState(false);
  const [showChangeMetaConfirmation, setShowChangeMetaConfirmation] = useState(false);
  const [isMetaSelected, setIsMetaSelected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingMetaImage, setIsUploadingMetaImage] = useState(false);
  const [isUploadingContent, setIsUploadingContent] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    // Fetch user data
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      if (token) {
        const userDataResponse = await Auth.getUserData(token);
        setUserData(userDataResponse);
      }
    } catch (error) { }
  };

  const handleFileNameChange = (event) => {
    setblogurl(event.target.value);
  };

  const handstate = (value) => {
    setState(value);
  };

  const handleLanguageChang = (value) => {
    setlanguage(value);
  };

  const handleDateChange = (value) => {
    setcode(value);
  };

  const handleEditorChange = (newContent) => {
    setEditorContent(newContent);
  };

  const handleStorageChange = async (value) => {
    setSelectedLocation(value);
    if (value === 'dicom') {
      const codeDataDicom = await Blog.fetchCodeDataDicom();
      setcodedicom(codeDataDicom);
      setShowClassificationCode(true);
    } else {
      const codeDataResponse = await Blog.fetchCodeData();
      setmacode(codeDataResponse);
      setShowClassificationCode(true);
    }
  };

  const handleTitleBlogChange = (e) => {
    const title = e.target.value;
    const slug = convertToSlug(title);
    form.setFieldsValue({
      urlBlog: slug
    });
    setslug(slug);
  };

  const convertToSlug = (title) => {
    const slug = unidecode(title)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return slug;

  };

  const nowTimestamp = Math.floor(Date.now() / 1000);

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const cancel = async () => {
    form.resetFields();
    setEditorContent('');
  }

  const handleSubmit = async (value) => {
    try {
      await form.validateFields();
      const value = await form.validateFields();
      value.imageUrl = imageUrl;
      value.category = category;
      value.author = userData.name;
      value.imgBlog = metaimage;
      value.avatar = userData.avatar;
      value.createAt = Math.floor(Date.now() / 1000);
      value.description = editorContent;
      value.view = 1000;
      value.status = 'Public';
      const response = await Blog.createBlog(value); // Make sure Blog.createBlog is correctly defined
      const { success, message: serverMessage } = response.data;
      if (!success) {
        message.success(serverMessage || 'Blog created successfully');
        form.resetFields(); // Reset form fields on successful submission
        setmetaImage('')
        setImageUrl('')
        setEditorContent('')
        // Check if location is "ucademy" and call additional API
        if (selectedLocation === 'ucademy') {
          const xmlResponse = await Blog.xmlUcademy();
          // Handle the xmlResponse as needed
          if (xmlResponse) {
            message.success("Successfully created sitemaps file");
          }
        }
      } else {
        message.error(serverMessage || 'Failed to create blog');
      }
    } catch (error) {
      message.error('Please attend to the error fields to continue !');
    }
  };
  

  const savedraft = async (value) => {
    try {
      await form.validateFields();
      const value = await form.validateFields();
      value.imageUrl = imageUrl;
      value.category = category;
      value.author = userData.name;
      value.imgBlog = metaimage;
      value.avatar = userData.avatar;
      value.createAt = Math.floor(Date.now() / 1000);
      value.description = editorContent;
      value.view = 1000;
      value.status = 'Draft';
      const response = await Blog.createBlog(value); // Make sure Blog.createBlog is correctly defined
      const { success, message: serverMessage } = response.data;
      if (!success) {
        message.success(serverMessage || 'Save the blog successfully');
        form.resetFields(); // Reset form fields on successful submission
        setmetaImage('')
        setImageUrl('')
        setEditorContent('')
      } else {
        message.error(serverMessage || 'Failed to create blog');
      }
    } catch (error) {
      message.error('Please attend to the error fields to continue !');
    }
  };

  const uploadImageTitle = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setIsUploading(true);
      try {
        let fileName = slug + Math.floor(Date.now() / 1000)
        const response = await Blog.uploadImage(fileName, selectedFile);
        const newImageUrl = response.data.imageUrl;
        setTimeout(() => {
          setIsUploading(false);
          setImageUrl(newImageUrl);
          setFileName(fileName);
          setIsImageUploaded(true);
          setIsImageSelected(true);
        }, 6000);
      } catch (error) { }
    }
  };

  const uploadmetaImage = async (event) => {
    const selectedmetatFile = event.target.files[0];
    if (selectedmetatFile) {
      setIsUploadingMetaImage(true);
      const formData = new FormData();
      formData.append('file', selectedmetatFile);
      try {
        let fileName = 'meta' + slug + Math.floor(Date.now() / 1000)
        const responsmeta = await Blog.uploadMetaImage(fileName, selectedmetatFile);
        const newmetaimage = responsmeta.data.imageUrl;
        setTimeout(() => {
          setIsUploadingMetaImage(false);
          setmetaImage(newmetaimage);
          setIsMetaSelected(true);
          setIsMetaUploaded(true);
        }, 6000);
      } catch (error) { }
    }
  };

  const deleteleMetaImage = async (e) => {
    e.preventDefault();
    try {
      const response = await Blog.deleteImage(metaimage);
      setmetaImage('');
      setShowChangeMetaConfirmation(false);
      return response;
    } catch (error) { }
  };

  const handleButtonClick = (event, value) => {
    if (event && event.target && event.target.id) {
      const buttonId = event.target.id;
      if (buttonId === 1) {
        savedraft(value);
      } else if (buttonId === 2) {
        handleSubmit(value);
      }
    }
  };

  const uploadImgEditor = async (event) => {
    // Replace with your AWS credentials
    const imageuploadEditor = event.target.files[0];
    if (imageuploadEditor) {
      setIsUploadingContent(true)
      const formData = new FormData();
      formData.append('file', imageuploadEditor);
      try {
        const response = await Blog.uploadImageEditor(imageuploadEditor);
        if (response) {
          setiImageEditor(response.data.imageUrl);
          const imageTag = `<img src="${response.data.imageUrl}" alt="" />`;
          const newContent = editorContent + imageTag;
          setTimeout(() => {
            setIsUploadingContent(false);
            setEditorContent(newContent);
          }, 6000)
        }
      } catch (error) { }
    };
  };

  const deleteImage = async (e) => {
    e.preventDefault();
    try {
      const response = await Blog.deleteImageTitle(imageUrl);
      setImageUrl('');
      setShowChangeImageConfirmation(false);
      return response;
    } catch (error) {
    }
  };



  return (
    <div className="container-fluid">
      <div className="row">
        <Link to="/blog"><Button type="primary" className="exit_blog" icon={<ArrowLeftOutlined style={{ marginTop: '5px' }} />}> Back </Button></Link>
        <div className=" m-auto">
          <div className="card card-body mt-5">
            <h2 className="text-center">Create a Blog</h2>
            <Form
              form={form}
              onFinish={handleButtonClick}
            >
              <div className="title-image-container">
                <h4>Title blog</h4>
                <div className="form-group">
                  <label>Select Your Route (Select the website you want to display the blog on)</label>
                  <Form.Item name='location' rules={[
                    {
                      required: true,
                      message: 'Please select the website you want to display !', // Error message
                    },
                  ]}>
                    <Select onChange={handleStorageChange} placeholder='Select the website you want to display the blog on' className="customselect" size="large">
                      <Option value="dicom" className="custom-select">dicom-interactive</Option>
                      <Option value="ucademy" className="custom-select">ucademy</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <label>Classification code (Here type of article if you add blog(EN) and then add VN, then choose the new blog(EN) name (opposite). If you haven't added any related blogs then 'New blog')</label>
                  <Form.Item name='code' rules={[
                    {
                      required: true,
                      message: 'Please choose a blog related to your content (VN or EN) !', // Error message
                    },
                  ]}>
                    <Select
                      value={selectedLocation}
                      placeholder="Classification code"
                      onChange={handleDateChange}
                      size="large"
                    >
                      <Option value={nowTimestamp} key="new-blog">New blog</Option>
                      {selectedLocation === 'dicom'
                        ? codedicom.map((item) => (
                          <Option key={item.createAt} value={item.code}>
                            {item.title}
                          </Option>
                        ))
                        : macode.map((person) => (
                          <Option key={person.createAt} value={person.code}>
                            {person.title}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <Form.Item name='title' rules={[
                    {
                      required: true,
                      message: 'Please input the title!', // Error message
                    },
                  ]}>
                    <Input type="text" placeholder="Blog title" onChange={handleTitleBlogChange} required />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <label>Slug (Do not input end .html)</label>
                  <Form.Item name='urlBlog' rules={[
                    {
                      required: true,
                      message: 'Enter the Title box and do not delete the slug box !', // Error message
                    },
                  ]}>
                    <Input type="text" placeholder="Slug blog" required value={blogurl} onChange={handleFileNameChange} />
                  </Form.Item>
                </div>
                <div style={{ flexWrap: 'wrap' }}>
                  <div className="form-group">
                    <label>Title image (The most suitable image size is 1024x512)</label>
                    <div className="image-upload-container" >
                      {imageUrl ? (
                        <div>
                          <div className='image-container-auth'>
                            <img
                              src={imageUrl}
                              width={290} height={235}
                              alt='Uploaded'
                              className='image-container-imageurl'
                              onClick={() => {
                                if (isImageSelected) {
                                  setShowChangeImageConfirmation(true);
                                }
                              }}
                            />
                            {isImageUploaded && isImageSelected && (
                              <span className='upload-content'>
                                <MdDelete
                                  className='md-delete'
                                  onClick={() => {
                                    if (isImageSelected) {
                                      setShowChangeImageConfirmation(true);
                                    }
                                  }}
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <>
                            {isUploading ?
                              (
                                <>
                                  <div
                                    className={`title-image ${isUploading ? 'uploading' : ''}`}

                                  >
                                    {isUploading ?
                                      (
                                        <>
                                          <LoadingOutlined className="loading-icon" />
                                          <p>Uploading...</p>
                                        </>
                                      ) :
                                      (<>
                                        <LoadingOutlined className="loading-icon" />
                                        <p>Uploading...</p>
                                      </>
                                      )}
                                  </div>
                                </>
                              ) :
                              (
                                <>
                                  <div
                                    className={`title-image ${isUploading ? 'uploading' : ''}`}
                                    onMouseEnter={() => setIsImageUploaded(true)}
                                    onMouseLeave={() => setIsImageUploaded(false)}
                                    onClick={() => document.querySelector(".input-field").click()}
                                  >
                                    <input
                                      type='file'
                                      accept='image/*'
                                      className='input-field'
                                      hidden
                                      onChange={uploadImageTitle}
                                    />
                                    {isUploading ?
                                      (
                                        <>
                                          <LoadingOutlined className="loading-icon" />
                                          <p>Uploading...</p>
                                        </>
                                      ) :
                                      (<>
                                        <MdCloudUpload color='#1475cf' size={60} />
                                        <p>Browse Files to upload</p>
                                      </>
                                      )}
                                  </div>
                                </>
                              )
                            }
                          </>
                        </>
                      )}
                      {showChangeImageConfirmation && (
                        <div className="confirmation-dialog">
                          <div className='confirmation'>
                            <p>Do you want to change the image?</p>
                            <button className="btn-yes" onClick={deleteImage}>Yes</button>
                            <button className="btn-no" onClick={() => setShowChangeImageConfirmation(false)}>No</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/*  */}
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '3', marginRight: '10px' }}>
                      <label>Author</label>
                      <Form.Item>
                        <Input type="text" placeholder="Enter author name" value={userData.name} onChange={(e) => setAuthor(e.target.value)} required />
                      </Form.Item>
                    </div>
                    <div className="form-group" style={{ flex: '3', marginRight: '10px' }}>
                      <label>Language</label>
                      <Form.Item name='language' rules={[
                        {
                          required: true,
                          message: 'Please select the language you want !', // Error message
                        },
                      ]}>
                        <Select onChange={handleLanguageChang} placeholder="Language" style={{ width: '100%' }} size="large">
                          <Option value="vn">Vietnamese</Option>
                          <Option value="en">English</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ flex: '3', marginRight: '10px' }}>
                      {selectedLocation === 'dicom' ? (
                        <>
                          <label>Categories(Here you are best to choose only 1 or 2.Too many will affect the interface)</label>
                          <Form.Item name='category' rules={[
                            {
                              required: true,
                              message: 'Please select the blog category !', // Error message
                            },
                          ]}>
                            <Select placeholder="Categories" mode="multiple" value={category} onChange={handleCategoryChange} style={{ width: '100%' }} size="large">
                              {language === 'vn' ? (
                                <>
                                  <Option value="Web">Web</Option>
                                  <Option value="Phát triển">Phát triển</Option>
                                  <Option value="Thiết kế">Thiết kế</Option>
                                  <Option value="Phần mềm nước ngoài">Phần mềm nước ngoài</Option>
                                  <Option value="Phát triển web">Phát triển web</Option>
                                  <Option value="Học tập">Học tập</Option>
                                  <Option value="Du lịch">Du lịch</Option>
                                  <Option value="Ngoài khơi">Ngoài khơi</Option>
                                  <Option value="Thuê ngoài">Thuê ngoài</Option>
                                </>
                              ) : (
                                <>
                                  <Option value="Web">Web</Option>
                                  <Option value="Development">Development</Option>
                                  <Option value="Design">Offshore</Option>
                                  <Option value="Overseas Software">Overseas Software</Option>
                                  <Option value="Web Development">Web Development</Option>
                                  <Option value="Study">Study</Option>
                                  <Option value="Travel">Travel</Option>
                                  <Option value="Offshore">Offshore</Option>
                                  <Option value="Outsourcing">Outsourcing</Option>
                                </>
                              )}
                              /</Select>
                          </Form.Item>
                        </>
                      ) : (
                        <>
                          <label>Categories(You can choose many related categories)</label>
                          <Form.Item name='category' rules={[
                            {
                              required: true,
                              message: 'Please select the blog category !', // Error message
                            },
                          ]}>
                            <Select placeholder="Categories" mode="multiple" value={category} onChange={handleCategoryChange} style={{ width: '100%' }} size="large">
                              {language === 'vn' ? (
                                <>
                                  <Option value="Web">Web</Option>
                                  <Option value="Phát triển">Phát triển</Option>
                                  <Option value="Thiết kế">Thiết kế</Option>
                                  <Option value="Phần mềm nước ngoài">Phần mềm nước ngoài</Option>
                                  <Option value="Phát triển web">Phát triển web</Option>
                                  <Option value="Học tập">Học tập</Option>
                                  <Option value="Du lịch">Du lịch</Option>
                                  <Option value="Ngoài khơi">Ngoài khơi</Option>
                                  <Option value="Thuê ngoài">Thuê ngoài</Option>
                                </>
                              ) : (
                                <>
                                  <Option value="Web">Web</Option>
                                  <Option value="Development">Development</Option>
                                  <Option value="Design">Offshore</Option>
                                  <Option value="Overseas Software">Overseas Software</Option>
                                  <Option value="Web Development">Web Development</Option>
                                  <Option value="Study">Study</Option>
                                  <Option value="Travel">Travel</Option>
                                  <Option value="Offshore">Offshore</Option>
                                  <Option value="Outsourcing">Outsourcing</Option>
                                </>
                              )}
                              /</Select>
                          </Form.Item>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mate-image-container">
                <h4>Meta blog</h4>
                <label>The most suitable image size is 256x145, but can be smaller such as the size must be divided by 1:2</label>
                <div className="flex-container">
                  <div className='meta_image' style={{ marginRight: '10px' }}>
                    <div className="form-group">
                      <label>Meta image (og:image)</label>
                      <div className="image-upload-container">
                        {metaimage ? (
                          <>
                            <div className='image-container-auth'>
                              <img
                                src={metaimage}
                                width={290} height={230}
                                alt='Uploaded'
                                className='image-container-imageurl'
                                onClick={() => {
                                  if (isMetaSelected) {
                                    setShowChangeMetaConfirmation(true);
                                  }
                                }}
                              />
                              {isMetaUploaded && isMetaSelected && (
                                <span className='upload-content'>
                                  <MdDelete
                                    className='md-delete'
                                    onClick={() => {
                                      if (isMetaSelected) {
                                        setShowChangeMetaConfirmation(true);
                                      }
                                    }}
                                  />
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <>
                              {isUploadingMetaImage ?
                                (
                                  <>
                                    <div className={`meta-image ${isUploadingMetaImage ? 'uploading' : ''} `}>
                                      {

                                        isUploadingMetaImage ? (
                                          <>
                                            <LoadingOutlined className="loading-icon" />
                                            <p>Uploading...</p>
                                          </>
                                        ) : (
                                          <>
                                            <LoadingOutlined className="loading-icon" />
                                            <p>Uploading...</p>
                                          </>
                                        )}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className='meta-image'
                                      onMouseEnter={() => setIsMetaUploaded(true)}
                                      onMouseLeave={() => setIsMetaUploaded(false)}
                                      onClick={() => document.querySelector(".input-meta").click()}>
                                      <input
                                        type='file'
                                        accept='image/*'
                                        className='input-meta'
                                        hidden
                                        onChange={uploadmetaImage}
                                      />
                                      {
                                        isUploadingMetaImage ? (
                                          <>
                                            <LoadingOutlined className="loading-icon" />
                                            <p>Uploading...</p>
                                          </>
                                        ) : (
                                          <>
                                            <MdCloudUpload color='#1475cf' size={60} />
                                            <p>Browse Files to upload</p>
                                          </>
                                        )
                                      }
                                    </div>
                                  </>
                                )
                              },
                            </>
                          </>
                        )}
                        {showChangeMetaConfirmation && (
                          <div className="confirmation-dialog">
                            <div className='confirmation'>
                              <p>Do you want to change the image?</p>
                              <button className="btn-yes" onClick={deleteleMetaImage}>Yes</button>
                              <button className="btn-no" onClick={() => setShowChangeMetaConfirmation(false)}>No</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='meta_input' style={{ flex: '3', marginRight: '10px', }}>
                    <div className="form-group">
                      <label>Meta title (og:title: vd: The Top Learning Management System | ucademy.top)</label>
                      <Form.Item name='titleBlog' rules={[
                        {
                          required: true,
                          message: 'Please enter data in Meta title !', // Error message
                        },
                      ]}>
                        <Input type="text" placeholder="Meta title" required />
                      </Form.Item>
                    </div>

                    <div className="form-group">
                      <label>Meta description (og:description vs quote a blog intro of no more than 300 character)</label>
                      <Form.Item name='metaBlog' rules={[
                        {
                          required: true,
                          message: 'Please enter data in Meta description !', // Error message
                        },
                      ]}>
                        <TextArea placeholder="Meta description" maxLength={200} autoSize={{ minRows: 3, maxRows: 5 }} className="form-control" required />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-image-container">
                <h4>Excerpt & Content</h4>
                <div className="form-group">
                  <label>Excerpt (Quote a blog intro of no more than 300 character)</label>
                  <Form.Item name='introduce' rules={[
                    {
                      required: true,
                      message: 'Please enter data in Excerpt !', // Error message
                    },
                  ]}>
                    <TextArea maxLength={200} autoSize={{ minRows: 3, maxRows: 5 }} className="form-control" placeholder="Excerpt ..." required />
                  </Form.Item>
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <div><label>Add images to content</label></div>
                  <div className='content-image' onClick={() => document.querySelector(".input-content").click()}>
                    <input
                      type='file'
                      accept='image/*'
                      className='input-content'
                      hidden
                      onChange={uploadImgEditor}
                    />
                    {imageEditor ? (
                      <>
                        {isUploadingContent ?
                          (
                            <>
                              <MdSaveAlt color='#1475cf' size={60} />
                              <p>Uploading...</p>
                            </>
                          ) :
                          (
                            <>
                              <MdCloudUpload color='#1475cf' size={60} />
                              <p>Browse Files to upload</p>
                            </>
                          )
                        }
                      </>
                    ) : (
                      <>
                        {isUploadingContent ?
                          (
                            <>
                              <MdSaveAlt color='#1475cf' size={60} />
                              <p>Uploading...</p>
                            </>
                          ) :
                          (
                            <>
                              <MdCloudUpload color='#1475cf' size={60} />
                              <p>Browse Files to upload</p>
                            </>
                          )
                        }
                      </>
                    )}
                  </div>
                  <Form.Item>
                    <JoditEditor className='joditEditor' value={editorContent} config={editorConfig} onChange={handleEditorChange} />
                  </Form.Item>
                </div>
              </div>
              <div className="btn-group">
                <Popconfirm title={`Are you sure you want to delete the imported data?`} onConfirm={cancel} onCancel={() => setShowNotification(false)} okText="Yes" cancelText="No">
                  <Button className="btn-cancel">Cancel</Button>
                </Popconfirm>
                <Button type="danger" id="1" className="btn-save" onClick={savedraft}>Save as Draft</Button>
                <Button type="primary" id="2" className="btn-create" onClick={handleSubmit}>Save & Publish</Button>
              </div>
              <div>
              </div>
            </Form>
          </div>
        </div>
      </div >
    </div >
  );
}

export default AddBlog;
