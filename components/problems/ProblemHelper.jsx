function checkTLAES(user) {
  if (user.userMatrix.desc.includes("TL AES")) {
    return true;
  } else {
    return false;
  }
}

function checkMemberAES(user) {
  if (user.userMatrix.desc.includes("Member AES")) {
    return true;
  } else {
    return false;
  }
}

function noData() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span className="text-4xl font-medium text-gray-500">No Data</span>
      </div>
    </>
  );
}

export { checkTLAES, checkMemberAES, noData };
