import json, humps
import libraries.json_encoder as JSONEncode


# Return Success Response


def success(respBody, code="000", message="Successfully"):
    return (
        {
            "responseCode": code,
            "message": message,
            "responseData": json.loads(
                json.dumps(humps.camelize(respBody), cls=JSONEncode.JSONEncoderHelpers)
            ),
        },
        200,
    )


def successCreated(respBody, code="000", message="Created"):
    return {"responseCode": code, "message": message}, 201


def successLogin(respBody, respToken, code="000", message="Successfully"):
    return (
        {
            "responseCode": code,
            "message": message,
            "responseData": json.loads(
                json.dumps(humps.camelize(respBody), cls=JSONEncode.JSONEncoderHelpers)
            ),
            "tokenData": json.loads(
                json.dumps(humps.camelize(respToken), cls=JSONEncode.JSONEncoderHelpers)
            ),
        },
        200,
    )


# Return No Content


def noContent():
    return ({}, 204)


# Return Error List

# Client Error HTTP 4xx
# 400 Bad Request
def badRequest(code="400", message="Bad Request!", exceptionMessage="-"):
    return (
        {
            "responseCode": code,
            "message": message,
            "exceptionMessage": exceptionMessage,
        },
        400,
    )


# 401 Unauthorized
def unauthorized(code="401", message="Unauthorized!", exceptionMessage="-"):
    return (
        {
            "responseCode": code,
            "message": message,
            "exceptionMessage": exceptionMessage,
        },
        401,
    )


# 403 Forbidden
def forbidden(code="403", message="Forbidden!", exceptionMessage="-"):
    return (
        {
            "responseCode": code,
            "message": message,
            "exceptionMessage": exceptionMessage,
        },
        403,
    )


# 404 Not Found
def notFound(code="404", message="Not Found!", exceptionMessage="-"):
    return (
        {
            "responseCode": code,
            "message": message,
            "exceptionMessage": exceptionMessage,
        },
        404,
    )


# Server Error HTTP 5xx
# 500 Internal Server Error --> mapping General Error
def generalError(
    code="500", message="Ooops Something Went Wrong!", exceptionMessage="-"
):
    return (
        {
            "responseCode": code,
            "message": message,
            "exceptionMessage": exceptionMessage,
        },
        500,
    )
