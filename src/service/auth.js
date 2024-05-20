import http from "../http-common"

const Auth = {
  login: async (email, password) => {
    try {
      const response = await http.post(`/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error("Error during login");
    }
  },

  deleteauth: async (email) => {
    try {
      const response = await http.delete(`/deleteuser?email=${email}`, {
        email
      });
      return response.data;
    } catch (error) {
      throw new Error("Account deletion failed")
    }
  },

  getUserData: async (token) => {
    try {
      const response = await http.post(`/user`, {
        token,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error while fetching user data", error);
      // Check if already on the home page to avoid infinite loop
      if (window.location.pathname !== "/") {
        // Redirect to the home page
        window.location.href = "/";
      }
  
      // You can also throw the error again if you want to handle it elsewhere
      throw new Error("Error while fetching user data");
    }
  },

  deletetoken: async (token) => {
    try {
      const register = await http.delete(`/deletetoken`, {
        token,
      });
      return register.data;
    } catch (error) {
      throw new Error("Error while fetching user data");
    }
  },

  register: async (name, email, password, avatar, role) => {
    try {
      const response = await http.post(`/register`, {
        name,
        email,
        password,
        avatar,
        role,
      });
      return response.data;
    } catch (error) {
      throw new Error("Error while registering");
    }
  },

  uploadAvatar: async (fileName, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await http.post(`/avatar`, formData,
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

  deleteImageAvatar: async (imageUrl) => {
    try {
      const response = await http.delete(`delete-avatar?imageKey=${imageUrl}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting blog');
    }
  },
}

export default Auth;