import fetchJson from "../../lib/fetchJson";
import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  const user = req.session.get("user");
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/logout`;

  try {
    // Call the API to revoke access token on the server
    const response = await fetchJson(url, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    await req.session.destroy();
    res.json({ isLoggedIn: false, status: 200, message: response.message });
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
