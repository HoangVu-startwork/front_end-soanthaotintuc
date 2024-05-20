import axios from "axios";
import http from "../http-common"
const Blog = {
  fetchCodeData: async () => {
    try {
      const response = await http.get(`/code`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching code data');
    }
  },

  fetchCodeDataDicom: async () => {
    try {
      const response = await http.get(`/code-dicom`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching code data');
    }
  },

  createBlog: async (data) => {
    try {
      const response = await http.post(`/create`, data); // Remove the wrapping object
      return response.data;
    } catch (error) {
      throw new Error('Error creating blog');
    }
  },

  getBlogByUrl: async (urlBlog) => {
    try {
      const response = await http.get(`/blog/${urlBlog}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching blog data');
    }
  },

  getAllBlogs: async (currentPage, title, location, startDate) => {
    try {
      const response = await http.get(`/blogs?page=${currentPage}&title=${title}&location=${location}&startDate=${startDate}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching blog data');
    }
  },

  deleteBlog: async (_id) => {
    try {
      const response = await http.delete(`/blog/${_id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting blog');
    }
  },

  updateBlog: async (blogId, data) => {
    try {
      const response = await http.put(`/update/${blogId}`, data);
      return response.data;
    } catch (error) {
      return Error('Blog update failed');
    }
  },

  gettotalBlog: async () => {
    try {
      const response = await http.get(`/totalrecords`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching code data');
    }
  },

  uploadImage: async (fileName, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await http.post(`/imagetitle`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            fileName: fileName,
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error('Error uploading image');
    }
  },

  uploadMetaImage: async (fileName, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await http.post(`/metaimage`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            fileName: fileName,
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error('Error uploading image');
    }
  },

  uploadImageEditor: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await http.post(`/content`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error('Error uploading image');
    }
  },

  deleteImage: async (metaimage) => {
    try {
      const response = await http.delete(`delete-metaimage?imageKey=${metaimage}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting blog');
    }
  },

  deleteImageTitle: async (imageUrl) => {
    try {
      const response = await http.delete(`delete-titleimage?imageKey=${imageUrl}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting blog');
    }
  },

  xmlUcademy: async () => {
    try {
      const response = await http.get(`/sitemapsall`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching code data");
    }
  },
};

export default Blog;
