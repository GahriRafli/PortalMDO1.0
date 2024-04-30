import fetchJson from "../../lib/fetchJson";
import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/register`;

  try {
    const raw = JSON.stringify(req.body);
    const response = await fetchJson(url, {
      method: "POST",
      body: raw,
      headers: { "Content-Type": "application/json" },
    });

    const user = {
      isLoggedIn: true,
      username: response.responseData.username,
      //   authType: response.responseData.authType,
      fullname: response.responseData.fullname,
      email: response.responseData.email,
      password: response.responseData.password,
      //   accessToken: response.response.tokenData.accessToken,
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
