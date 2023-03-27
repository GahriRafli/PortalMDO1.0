import { useState, useEffect } from "react";
import axios from "axios";
import fetcher from "./fetchJson";
const URL = process.env.NEXT_PUBLIC_API_URL;
const API_V2 = process.env.NEXT_PUBLIC_API_URL_V2;

const useAxios = (axiosParams) => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (params) => {
    try {
      const result = await axios.request(params);
      setResponse(result.data);
    } catch (error) {
      // Error 😨
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        setError(
          error.response.data || error.response.status || error.response.headers
        );
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        setError(error.request);
      } else {
        // Something happened in setting up the request and triggered an Error
        setError("Error ", error.message);
      }
      setError(error.config);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(axiosParams);
  }, []); // execute once only

  return { response, error, loading };
};

function getApplication(value, callback, accessToken) {
  clearTimeout(timeoutId);
  if (value.length < 3) return callback([]);

  const timeoutId = setTimeout(() => {
    fetcher(`${API_V2}/parameters/app?subName=${value}&status=A`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        const cachedOptions = res.data.map((d) => ({
          value: d.id,
          label: d.subName,
          criticality: d.criticalityApp,
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

async function getTicketType() {
  return await fetcher(`${URL}/parameters/tickettype?isActive=Y`);
}

async function getPriorityTicket() {
  return await fetcher(`${URL}/parameters/priorityticket?isActive=Y`);
}

export {
  getApplication,
  getCriticalityApp,
  useAxios,
  getListGroup,
  getCategoryBroadcast,
  getBroadcastRecipient,
  getTicketType,
  getPriorityTicket,
};
