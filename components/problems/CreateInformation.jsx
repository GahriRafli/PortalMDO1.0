import { ExclamationIcon } from "@heroicons/react/outline";

const CreateInformation = () => {
  return (
    <section
      aria-labelledby="problem-docs"
      className="lg:col-start-3 lg:col-span-1"
    >
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationIcon
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="pt-3 text-center sm:pt-0 sm:pl-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Create Problem Non-Incident Ticket
            </h3>
            <div className="pt-2">
              <p className="text-sm text-gray-500">
                <b>
                  Before you created the new problem non-incident ticket, make sure it can be
                  categorized as followup from one of the activity below :
                </b>
                <ul className="pl-5 list-disc">
                  <li>Application HealthCheck</li>
                  <li>Database Healthcheck</li>
                  <li>Bug Fixing from Bug Finding</li>
                  <li>Application Quality Improvement</li>
                  <li>Applicaton System Update/Upgrade</li>
                </ul>
                <br />
                <i>
                  <b>
                    If you are not sure about that, please consult it with
                    another Team Member or with Team Leader.
                  </b>
                </i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateInformation;
