# Return Error List

# Client Error HTTP 4xx
# 400 Bad Request
def badRequest(code=400, message="Bad Request!", exceptionMessage="-"):
    return {"code": code, "message": message, "exceptionMessage":exceptionMessage}, 400


# 401 Unauthorized
def unauthorized(code=401, message="Unauthorized!", exceptionMessage="-"):
    return {"code": code, "message": message, "exceptionMessage":exceptionMessage}, 401


# 403 Forbidden
def forbidden(code=403, message="Forbidden!", exceptionMessage="-"):
    return {"code": code, "message": message, "exceptionMessage":exceptionMessage}, 403


# 404 Not Found
def notFound(code=404, message="Not Found!", exceptionMessage="-"):
    return {"code": code, "message": message, "exceptionMessage":exceptionMessage}, 404


# Server Error HTTP 5xx
# 500 Internal Server Error --> mapping General Error
def generalError(code=500, message="Ooops Something Went Wrong!", exceptionMessage="-"):
    return {"code": code, "message": message, "exceptionMessage":exceptionMessage}, 500