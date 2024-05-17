export const getCountryAccessToken = async () => {
  const res = await fetch(
    "https://www.universal-tutorial.com/api/getaccesstoken",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "api-token":
          "JpE7ViEUGutTqjH5Wy5ByAmHt-6Pi0069E0xxU9_Xq5Au--JYxOeOgvF_4vVPHLbv2Y",
        "user-email": "antonyjaison456@gmail.com",
      },
    }
  );

  const json = await res.json();
  return json;
};

export const getStateNames = async (country: string) => {

  const { auth_token } = await getCountryAccessToken()

  const res = await fetch(
    `https://www.universal-tutorial.com/api/states/${country}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );

  const json = await res.json();
  return json;
}

export const getCitiesNames = async (state:string) => {
  const { auth_token } = await getCountryAccessToken()

  const res = await fetch(
    `https://www.universal-tutorial.com/api/cities/${state}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );

  const json = await res.json();
  return json;
}