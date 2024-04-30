import withSession from "lib/session";
import fetchJson from "lib/fetchJson";

export default withSession(async (req, res) => {
  let user = req.session.get("user");
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`;

  try {
    // Call the API to update fullname
    const response = await fetchJson(url, {
      method: "PATCH",
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    // Update session object
    user = Object.assign(user, {
      fullname: response.data.fullname,
    });
    req.session.set("user", user);
    await req.session.save();
    res.json({
      status: 200,
      message: response.message,
      data: user,
    });
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
