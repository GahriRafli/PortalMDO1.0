import fetchJson from "../../lib/fetchJson";
import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;

  try {
    // Call the API to check if the user exists and store some data in session
    const response = await fetchJson(url, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" },
    });

    const user = {
      isLoggedIn: true,
      id: response.data.id,
      username: response.data.username,
      fullname: response.data.fullname,
      email: response.data.email,
      grant: response.data.paramUserMatrix.grant,
      userMatrix: {
        id: response.data.paramUserMatrix.id,
        desc: response.data.paramUserMatrix.desc,
      },
      accessToken: response.access_token,
      photo: response.data.photo
    };
    req.session.set("user", user);
    await req.session.save();
    res.json({ status: 200, message: response.message, data: user });
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
