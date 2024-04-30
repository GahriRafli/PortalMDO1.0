import requests, json

reFormattingPN = (
    lambda pernr: f"""{"0" * (8 - len(pernr))}{pernr}""" if len(pernr) < 8 else pernr
)


def check_ldap_login(
    ldap_url: str,
    api_close_bristars_url: str,
    auth_token: str,
    username: str,
    password: str,
    channel_id: str,
    user_agent: str,
    ip_addr: str,
):
    try:
        url = f"{ldap_url}"
        payload = json.dumps(
            {
                "userLogin": f"{reFormattingPN(username)}",
                "password": f"{password}",
                "channelId": f"{channel_id}",
                "userAgent": f"{user_agent}",
                "ipAddress": f"{ip_addr}",
            }
        )
        headers = {
            "Authorization": f"Basic {auth_token}",
            "Content-Type": "application/json",
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        responseJSON = json.loads(response.text)
        if response.status_code == 200 and responseJSON["responseCode"] == "00":
            check_data_bristars = check_bristars_by_pn(
                api_close_bristars_url=api_close_bristars_url,
                auth_token=auth_token,
                username=username,
            )
            if check_data_bristars["responseStatus"] is True:
                return {
                    "responseStatus": True,
                    "responseLDAP": responseJSON["responseMessage"],
                    "responseStatusBRIStars": check_data_bristars["responseStatus"],
                    "responseDataBRIStars": check_data_bristars["responseData"],
                }
            else:
                return {
                    "responseStatus": True,
                    "responseLDAP": responseJSON["responseMessage"],
                    "responseStatusBRIStars": check_data_bristars["responseStatus"],
                    "responseDataBRIStars": check_data_bristars["responseMessage"],
                }
        elif response.status_code == 200 and responseJSON["responseCode"] != "00":
            return {
                "responseStatus": False,
                "responseMessage": responseJSON["responseMessage"],
            }
        else:
            return {
                "responseStatus": False,
                "responseMessage": f"Gagal LDAP. HTTP STATUS {response.status_code} | {response.text}",
            }
    except Exception as why:
        raise Exception(repr(why))


def check_bristars_by_pn(api_close_bristars_url: str, auth_token: str, username: str):
    try:
        url = f"{api_close_bristars_url}"
        payload = json.dumps({"pernr": f"{reFormattingPN(username)}"})
        headers = {
            "Authorization": f"Basic {auth_token}",
            "Content-Type": "application/json",
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        responseJSON = json.loads(response.text)
        if response.status_code == 200 and responseJSON["responseCode"] == "00":
            return {
                "responseStatus": True,
                "responseMessage": responseJSON["responseMessage"],
                "responseData": responseJSON["responseData"],
            }
        elif response.status_code == 200 and responseJSON["responseCode"] != "00":
            return {
                "responseStatus": False,
                "responseMessage": responseJSON["responseMessage"],
            }
        else:
            return {
                "responseStatus": False,
                "responseMessage": f"Gagal Check Data Pekerja BRIStars by PN. HTTP STATUS {response.status_code} | {response.text}",
            }
    except Exception as why:
        raise Exception(repr(why))
