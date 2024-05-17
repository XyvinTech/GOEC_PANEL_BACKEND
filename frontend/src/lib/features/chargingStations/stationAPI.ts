import Cookies from 'js-cookie';
import { Station, getAllStations } from './stationSlice';
import { toast } from 'react-toastify';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export const fetchStations = async (data = {  state: '',
city: '',
goecOnly: false,
page : 1,
pageLimit: 30,
}) => {

  const token = Cookies.get('token');

  let url = `${baseUrl}/station/getall?goecOnly=${data.goecOnly}&page=${data.page}&limit=${data.pageLimit}`;

  if (data.city !== "") {
    url += `&city=${data.city}`;
  }

  
  if (data.state !== "") {
    url += `&state=${data.state}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const result: { data: [], count: number, page : number, pages:number  } = await response.json();

  return result;
};




export const fetchStationsWOFilter = async () => {

  const token = Cookies.get('token');

  let url = `${baseUrl}/station/getall-stations`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const result: { data: [] } = await response.json();

  return result;
};



export const addNewStations = async (data: Station) => {
  const token = Cookies.get('token');
  const formData = new FormData();

  // Append non-file fields to the form data
  Object.keys(data).forEach((key) => {
    if (key === 'media' && data[key]?.images.length > 0) {
      // Skip the media field if it contains files, as they will be appended separately
      return;
    }
    if (typeof data[key] === 'object') {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  });

  // Append the file(s) to the form data
  if (data.media.images.length > 0) {
    data.media.images.forEach((image) => {
      formData.append('file', image);
    });
  }
  if (data.media.coverImage.length > 0) {
    data.media.coverImage.forEach((image) => {
      formData.append('coverImage', image);
    });
  }
  const response = await fetch(`${baseUrl}/station/add`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const result = await response.json();
  if (result.data) {
    toast.success('Station added successfully!');
  }

  return result;
};


export const deleteStations = async (stationIds: string[]) => {
  const token = Cookies.get('token');

  const response = await fetch(`${baseUrl}/station/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ids: stationIds }),
  });
  const result = await response.json();
 
  
  if (result.success) {
    toast.success('Station deleted successfully!');
  }

  return result;
};


export const updateStation = async (data: Station) => {
  const token = Cookies.get('token');
  const formData = new FormData();

  // Append non-file fields to the form data
  Object.keys(data).forEach((key) => {
    if (key === 'media' && data[key]?.images.length > 0) {
      // Skip the media field if it contains files, as they will be appended separately
      return;
    }
    if (typeof data[key] === 'object') {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  });

  // Append the file(s) to the form data
  if (data.media.images.length > 0) {
    data.media.images.forEach((image) => {
      formData.append('file', image);
    });
  }

  if (data.media.coverImage.length > 0) {
    data.media.coverImage.forEach((image) => {
      formData.append('coverImage', image);
    });
  }


  const response = await fetch(`${baseUrl}/station/edit/${data._id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const result = await response.json();
  if (result.data) {
    toast.success('Station updated successfully!');
  }

  return result;
};



export const uploadBulkStations = async (data: File) => {
  const token = Cookies.get('token');
  const formData = new FormData();


  // Append the file(s) to the form data
  if (data) {
   
      formData.append('file', data);
   
  }

  const response = await fetch(`${baseUrl}/station/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const result = await response.json();
  
  if (result.success) {
    toast.success('File uploaded successfully!');
  }

  return result;
};

