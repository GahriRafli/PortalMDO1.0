def doMaskPassword(requestData):
    if requestData and "password" in requestData.keys():
        requestData["password"] = "*" * len(requestData["password"])
        pass

    return requestData