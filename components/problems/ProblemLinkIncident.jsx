import axios from "axios";
import { useEffect, useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { toast } from "react-hot-toast";
import { StatusIncident } from "components/incidents/status-pill";
import { classNames } from "components/utils";
import { useRouter } from "next/router";

const loadIncidents = (value, callback) => {
  clearTimeout(timeoutId);

  if (value.length < 3) {
    return callback([]);
  }

  const timeoutId = setTimeout(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_PROBMAN}/incident/filter?incidentName=${value}`
      )
      .then((res) => {
        if (res.status == 200) {
          const cachedOptions = res.data.data.rows.map((r) => ({
            value: r.id,
            label: (
              <div>
                <span className="px-2 mr-2 text-xs font-semibold rounded-full bg-gray-300 text-gray-800">
                  {r.incidentNumber}
                </span>
                <StatusIncident value={r.incidentStatus} />
                <br />
                <div className="pl-2">{r.incidentName}</div>
              </div>
            ),
          }));
          callback(cachedOptions);
        } else if (res.status == 202) {
          toast.error(`Incident with keyword not found.`);
        }
      })
      .catch((err) => toast.error(`Incident ${err}`));
  }, 500);
};

const ProblemLinkIncident = ({ user, problemID, problemType }) => {
  const router = useRouter();
  const { handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [idIncident, setIdIncident] = useState("");

  function isNumber(value) {
    return typeof value === "number";
  }

  const backupOnClick = () => {
    if (idIncident === "") {
      toast.error("Tidak ada Incident yang dipilih");
    } else {
      toast.success(`Saatnya ngirim ID: ${idIncident}`);
    }
  };

  const handleAppChange = (event, { action }) => {
    if (event == null) {
      setIdIncident("");
    } else {
      setIdIncident(event.value);
    }
  };

  const linktoIncident = async (data, event) => {
    event.preventDefault();
    try {
      if (idIncident != "") {
        Object.assign(data, {
          idIncident: idIncident,
          idProblem: parseInt(problemID),
          problemType: parseInt(problemType),
          user: user.id,
        });
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_PROBMAN}/incident/linkProblem`,
            data,
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then(function (response) {
            if (response) {
              toast.success("Problem berhasil dihubungkan ke Incident");
              setTimeout(() => router.reload(), 1000);
            } else {
              toast.error(`Failed to update: ${response.data.message}`);
            }
          });
      } else {
        toast.error("Pilih Incident yang akan dihubungkan.");
      }
    } catch (error) {}
  };

  return (
    <>
      <section
        aria-labelledby="link-to-incident"
        style={{ marginBottom: "10vh" }}
      >
        <label
          htmlFor="linkIncident"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Link to Incident
        </label>
        <form onSubmit={handleSubmit(linktoIncident)}>
          <div className="flex justify">
            <AsyncSelect
              id="linkIncident"
              name="linkIncident"
              isDisabled={false}
              isClearable
              loadOptions={loadIncidents}
              styles={{
                menu: (base) => ({
                  ...base,
                }),
                input: (base) => ({
                  ...base,
                  "input:focus": {
                    boxShadow: "none",
                  },
                }),
              }}
              className="text-sm focus:ring-blue-300 focus:border-blue-300 flex-auto w-auto"
              placeholder="Search Incidents"
              onChange={handleAppChange}
            />
            <button
              type="submit"
              className={classNames(
                idIncident == "" ? "hidden" : "",
                "ml-2 pl-3 items-center inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              )}
            >
              Save
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default ProblemLinkIncident;
