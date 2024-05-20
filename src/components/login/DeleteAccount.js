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
  const [email, setEmail] = useState('');
  const [messageState, setMessageState] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const reponse = await Auth.deleteauth(email);
      setMessageState(reponse.message || reponse.error);
    } catch (error) {
      setMessageState('Xoá không thành công !!')
    }
  }

  return (
    <div className="maincontainer ">
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="col-md-0 bg-image">
            <div className="login d-flex align-items-center py-5">
              <div className="container ">
                <div className="row">
                  <div className="col-lg-10 col-xl-7 mx-auto">
                    <h2 className="display-8 text-primary log_in_text">Delete account</h2>
                    <h5 className="display-8 text-primary log_in_text">{messageState && <p>{messageState}</p>}</h5>
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
                    <button className="btn btn-primary form-control input_login rounded-pill border-0 shadow-sm px-4" onClick={handleSubmit} >Delete</button>
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
