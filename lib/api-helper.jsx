import { useState, useEffect } from "react";
import axios from "axios";
import fetcher from "./fetchJson";
const URL = process.env.NEXT_PUBLIC_API_URL;

const useAxios = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      setIsLoading(false);
      setData(response.data);
    } catch (error) {
      setIsLoading(false);
      setIsError(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return { isLoading, isError, data };
};

function getApplication(value, callback) {
  clearTimeout(timeoutId);
  if (value.length < 3) return callback([]);

  const timeoutId = setTimeout(() => {
    fetcher(`${URL}/parameters/app?subName=${value}`)
      .then((res) => {
        const cachedOptions = res.data.map((d) => ({
          value: d.id,
          label: d.subName,
        }));
        callback(cachedOptions);
      })
      .catch((err) => alert("Error:", err));
  }, 500);
}

function getListGroup(prefix = "") {
  return fetcher(
    `${URL}/parameters/group?isActive=Y&isTicket=Y&prefix=${prefix}`
  );
}

function getCriticalityApp() {
  return useAxios(`${URL}/dashboards/8/report`);
}

async function getCategoryBroadcast() {
  return await fetcher(`${URL}/parameters/broadcastcategory?isActive=Y`);
}

async function getBroadcastRecipient(id) {
  return await fetcher(
    `${URL}/parameters/broadcastrecipient?idBroadcastCategory=${id}&isActive=Y`
  );
}

export {
  getApplication,
  getCriticalityApp,
  useAxios,
  getListGroup,
  getCategoryBroadcast,
  getBroadcastRecipient,
};
