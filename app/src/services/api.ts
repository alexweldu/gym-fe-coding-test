import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

const getHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const handleErrors = (error: any) => {
  console.log("error,", error);
};

export const getLogin = async (orgNumber: string, password: string) => {
  try {
    const response: AxiosResponse = await api.post("/login", {
      orgNumber,
      password,
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getGym = async (token: string) => {
  try {
    const response: AxiosResponse = await api.get("/gym", getHeaders(token));
    console.log("axios response", response.data);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const createMembers = async (data: any, token: string) => {
  try {
    const response: AxiosResponse = await api.post(
      "/members",
      data,
      getHeaders(token)
    );
    console.log("axios response", response.data);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const updateMember = async (
  memberId: any,
  gymId: any,
  data: any,
  token: string
) => {
  // console.log("updateMember", data);

  try {
    const response: AxiosResponse = await api.put(
      `/members/${memberId}`,
      { gymId, ...data },
      getHeaders(token)
    );
    console.log("axios response", response.data);
    return response;
  } catch (error) {
    handleErrors(error);
  }
};

export const getMembers = async (token: string) => {
  try {
    const response: AxiosResponse = await api.get(
      "/members",
      getHeaders(token)
    );
    console.log("axios response", response.data);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getMembersByID = async (id: any, token: string) => {
  try {
    const response: AxiosResponse = await api.get(
      `/members/${id}`,
      getHeaders(token)
    );
    console.log("axios response", response.data);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const deleteMember = async (memberId: number, token: string) => {
  if (!token) return;
  try {
    const response: AxiosResponse = await api.delete(
      `/members/${memberId}`,
      getHeaders(token)
    );
    console.log("axios response", response);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};
