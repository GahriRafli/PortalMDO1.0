import format from "date-fns/format";

const DetailHeader = ({ problem }) => {
  return (
    <div className="flex items-center space-x-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {problem.problemName}
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Created by&nbsp;
          <a href="#" className="text-gray-900">
            {problem.created_by.fullName
              ? problem.created_by.fullName
              : problem.created_by.userName}
          </a>{" "}
          on{" "}
          <time
            dateTime={format(
              new Date(problem.createdAt),
              "d LLLL yyyy HH:mm",
              "id-ID"
            )}
          >
            {format(new Date(problem.createdAt), "d LLLL yyyy HH:mm", "id-ID")}
          </time>
        </p>
      </div>
    </div>
  );
};

export default DetailHeader;
