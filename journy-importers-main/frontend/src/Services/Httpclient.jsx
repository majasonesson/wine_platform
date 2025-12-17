// /*//! Production */
import axios from 'axios';
import Cookies from 'js-cookie';

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // const { token } = response.data;
    // Cookies.set('token', token, { expires: 7 });
    return response.data;
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
};

export const updateRole = async (email, role) => {
  try {
    console.log('Updating user role after payment...');
    const roleResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/users/update/role`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          role: role,
        }),
      }
    );

    if (roleResponse.ok) {
      console.log('Role updated successfully');
    } else {
      console.error('Failed to update role');
    }
  } catch (error) {
    console.error('Error updating role:', error);
  }
};

export const createPassword = async (newPassword, token) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/users/createpassword/${token}`, // Correctly concatenating the token into the URL
      {
        newPassword,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating password:', error);
    throw error;
  }
};
export const getProduct = async (wineId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/wines/wine/${wineId}`
  );

  return response;
};

export const getProducts = async () => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      window.alert("You can't access this page");
      return; // Return early to prevent further execution
    }
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/wines`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Products:', error);
    throw error;
  }
};

export const addProduct = async (formData) => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      window.alert("You can't access this page");
      return;
    }
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/wines/addWine`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding Product', error);
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      console.log('You cant access this page');
      return;
    }
    await axios.put(
      `${import.meta.env.VITE_API_URL}/wines/updateWine/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error updating Product', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      console.log('You cant access this page');
      return;
    }
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/wines/deleteWine/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error deleting Product', error);
    throw error;
  }
};

export const fetchUser = async (id) => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      window.alert('You cant access this page');
      return;
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/profile/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching profile', error);
    throw error;
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/users/change-password/${userId}`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const getCertifications = async () => {
  try {
    const token = Cookies.get('token');

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/certifications`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching Products:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/request-reset-password`,
      { email }
    );
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

export const updateUser = async (id, formData) => {
  try {
    const token = Cookies.get('token');

    if (!token) {
      throw new Error('Authentication token missing');
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/users/profile/update/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Return the transformed data from the response
    return response.data.data;
  } catch (error) {
    console.error(
      'Error updating User:',
      error.response?.data || error.message
    );
    throw error;
  }
};

/*//! Development */
// import axios from 'axios';
// import Cookies from 'js-cookie';

// export const signIn = async (email, password) => {
//   try {
//     const response = await axios.post(`http://localhost:3000/api/users/login`, {
//       email,
//       password,
//     });

//     const { token } = response.data;

//     // Save token to cookies or localStorage
//     Cookies.set('token', token, { expires: 7 }); // Example of setting token with expiration of 7 days
//     return response.data;
//   } catch (error) {
//     console.error('Error logging in', error);
//     throw error;
//   }
// };

// export const register = async (userData) => {
//   try {
//     const response = await axios.post(
//       'http://localhost:3000/users/register',
//       userData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Changed this line
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Registration error:', error);
//     throw error;
//   }
// };

// export const createPassword = async (newPassword, token) => {
//   try {
//     const response = await axios.put(
//       `http://localhost:3000/api/users/createpassword/${token}`, // Correctly concatenating the token into the URL
//       {
//         newPassword,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error creating password:', error);
//     throw error;
//   }
// };

// export const getProduct = async (wineId) => {
//   const token = Cookies.get('token');
//   const response = await axios.get(
//     `http://localhost:3000/api/wines/wine/${wineId}`,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );

//   return response;
// };

// export const getProducts = async () => {
//   try {
//     const token = Cookies.get('token');

//     if (!token) {
//       window.alert("You can't access this page");
//       return; // Return early to prevent further execution
//     }
//     const response = await axios.get(`http://localhost:3000/api/wines`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching Products:', error);
//     throw error;
//   }
// };

// export const addProduct = async (formData) => {
//   try {
//     const token = Cookies.get('token');

//     if (!token) {
//       window.alert("You can't access this page");
//       return;
//     }

//     const response = await axios.post(
//       `http://localhost:3000/api/wines/addWine`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error adding Product', error);
//     throw error;
//   }
// };

// export const updateProduct = async (id, formData) => {
//   try {
//     const token = Cookies.get('token');

//     if (!token) {
//       console.log('You cant access this page');
//       return;
//     }

//     await axios.put(
//       `http://localhost:3000/api/wines/updateWine/${id}`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//   } catch (error) {
//     console.error('Error updating Product', error);
//     throw error;
//   }
// };

// export const deleteProduct = async (id) => {
//   try {
//     const token = Cookies.get('token');

//     if (!token) {
//       console.log('You cant access this page');
//       return;
//     }

//     await axios.delete(`http://localhost:3000/api/wines/deleteWine/${id}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   } catch (error) {
//     console.error('Error deleting Product', error);
//     throw error;
//   }
// };

// export const fetchUser = async (id) => {
//   try {
//     const token = Cookies.get('token');

//     if (!token) {
//       throw new Error('No authentication token found');
//     }

//     const response = await axios.get(
//       `http://localhost:3000/api/users/profile/${id}`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching profile', error);
//     throw error;
//   }
// };

// export const updateUser = async (id, formData) => {
//   try {
//     const token = Cookies.get('token');

//     if (!token) {
//       throw new Error('Authentication token missing');
//     }

//     // Wrap the formData in a data property to match backend expectations
//     // const requestData = {
//     //   data: {
//     //     company: formData.company,
//     //     country: formData.country,
//     //     region: formData.region,
//     //     address: formData.address,
//     //     certifications: formData.certifications,
//     //   },
//     // };

//     // console.log('Sending update data:', requestData);

//     const response = await axios.put(
//       `http://localhost:3000/api/users/profile/update/${id}`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log('Update response from server:', response);

//     // Return the transformed data from the response
//     return response.data.data;
//   } catch (error) {
//     console.error(
//       'Error updating User:',
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// export const changePassword = async (userId, currentPassword, newPassword) => {
//   try {
//     const token = Cookies.get('token');
//     const response = await axios.put(
//       `http://localhost:3000/api/users/change-password/${userId}`,
//       {
//         currentPassword,
//         newPassword,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error changing password:', error);
//     throw error;
//   }
// };

// export const getCertifications = async () => {
//   try {
//     const token = Cookies.get('token');

//     if (!token) {
//       window.alert("You can't access this page");
//       return; // Return early to prevent further execution
//     }
//     const response = await axios.get(
//       `http://localhost:3000/api/users/certifications`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error('Error fetching Products:', error);
//     throw error;
//   }
// };

// export const requestPasswordReset = async (email) => {
//   try {
//     const response = await axios.post(
//       'http://localhost:3000/api/users/request-reset-password',
//       { email }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error requesting password reset:', error);
//     throw error;
//   }
// };
