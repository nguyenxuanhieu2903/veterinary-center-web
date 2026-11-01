from rest_framework.response import Response
from rest_framework import status


def api_response(success=True, code=status.HTTP_200_OK, message="Thao tác thực hiện thành công.", data=None, errors=None, http_status=None):
    """
    Chuẩn hóa cấu trúc JSON Response theo docs/API_CONTRACT.md.
    """
    payload = {
        "success": success,
        "code": code,
        "message": message,
    }
    if success:
        payload["data"] = data if data is not None else {}
    else:
        payload["errors"] = errors if errors is not None else {}

    return Response(payload, status=http_status or code)
