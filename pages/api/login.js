import fetchJson from "../../lib/fetchJson";
import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/login`;

  try {
    // Call the API to check if the user exists and store some data in session

    const raw = JSON.stringify(req.body);
    const response = await fetchJson(url, {
      method: "POST",
      body: raw,
      headers: { "Content-Type": "application/json" },
    });

    const user = {
      isLoggedIn: true,
      id: response.responseData.id,
      username: response.responseData.username,
      fullname: response.responseData.fullname,
      userRole: response.responseData.userRole,
      email: response.responseData.email,
      orgehTX: response.responseData.orgehTX,
      userMatrix: response.responseData.userMatrixId,
      accessToken: response.tokenData.accessToken,
      // photo: response.data.photo,
    };
    req.session.set("user", user);
    await req.session.save();
    res.json({ status: 200, message: response.message, data: "success" });
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
