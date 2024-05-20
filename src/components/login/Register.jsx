import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Form, Input, Upload, message, Select, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import { AiFillFileImage } from 'react-icons/ai'

import { UploadOutlined } from '@ant-design/icons';
import '../../assets/css/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from '../../service/auth'
const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messageState, setMessageState] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [showChangeImageConfirmation, setShowChangeImageConfirmation] = useState(false);
  const [role, setpower] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Auth.register(name, email, password, imageUrl, role);
      setMessageState(response.message || response.error);
      window.location.href = '/login';
      if (response.message === "Account already exists!") {
        window.location.href = '/login';
      } else {
        setMessageState('Password account already exists');
      }
    } catch (error) {
      setMessageState('Account already exists to');
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const fileNamecao = selectedFile.name;
      try {
        const response = await Auth.uploadAvatar(fileName, selectedFile);
        setImageUrl(response.data.imageUrl);
        setFileName(fileNamecao);
        setIsImageUploaded(true);
        setIsImageSelected(true);
      } catch (error) {}
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await Auth.deleteImageAvatar(imageUrl);
      setImageUrl('');
      setShowChangeImageConfirmation(false);
      return response;
    } catch (error) {}
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };
  const handleLanguageChang = (value) => {
    setpower(value);
  };

  return (
    <div className="maincontainer ">
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="col-md-0 bg-image">
            <div className="login d-flex align-items-center py-5">
              <div className="container ">
                <div className="row">
                  <div className="col-lg-10 col-xl-7 mx-auto">
                    <h2 className="display-8 text-primary log_in_text">Register</h2>
                    <h5 className="display-8 text-primary log_in_text">{messageState && <p>{messageState}</p>}</h5>
                    <div className="mb-3">
                      <label className="test">Full name</label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name address"
                        className="form-control input_login rounded-pill border-0 shadow-sm px-4"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="test">Email</label>
                      <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="form-control input_login rounded-pill border-0 shadow-sm px-4"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="test">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control input_login rounded-pill border-0 shadow-sm px-4"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="test">Image name</label>
                      <input type="text" className="form-control input_login rounded-pill border-0 shadow-sm px-4" placeholder="Enter file name" value={fileName} onChange={handleFileNameChange} />

                      <div className="image-upload-container">
                        {imageUrl ? (
                          <div>
                            <div className='image-container-auth'>
                              <img
                                src={imageUrl}
                                width={400}
                                height={290}
                                alt='Uploaded'
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
                          <form
                            className='btn-image'
                            onMouseEnter={() => setIsImageUploaded(true)}
                            onMouseLeave={() => setIsImageUploaded(false)}
                            onClick={() => document.querySelector(".input-field").click()}
                          >
                            <input
                              type='file'
                              accept='image/*'
                              className='input-field'
                              hidden
                              onChange={handleFileUpload}
                            />
                            <div className="image-upload-container">
                              <>
                                <MdCloudUpload color='#1475cf' size={60} />
                                <p>Browse Files to upload</p>
                              </>
                            </div>
                          </form>
                        )}
                      </div>

                      {showChangeImageConfirmation && (
                        <div className="confirmation-dialog">
                          <div className='confirmation'>
                            <p>Do you want to change the image?</p>
                            <button onClick={handleImageDelete}>Yes</button>
                            <button onClick={() => setShowChangeImageConfirmation(false)}>No</button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Form.Item name='category'>
                        <Select onChange={handleLanguageChang} placeholder="Storage location" style={{ width: '100%' }} size="large">
                          <Option value="admin">Admin</Option>
                          <Option value="edit">Edit</Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <button className="btn btn-primary" onClick={handleSubmit}>Register</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
