from rest_framework.views import exception_handler
from rest_framework import status
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    """
    Tùy biến Exception Handler của Django REST Framework
    đảm bảo định dạng lỗi 100% tuân thủ docs/API_CONTRACT.md.
    """
    response = exception_handler(exc, context)

    if response is not None:
        code = response.status_code
        message = "Đã xảy ra lỗi khi xử lý yêu cầu."

        if code == status.HTTP_400_BAD_REQUEST:
            message = "Thông tin nhập vào không hợp lệ."
        elif code == status.HTTP_401_UNAUTHORIZED:
            message = "Yêu cầu xác thực. Vui lòng đăng nhập."
        elif code == status.HTTP_403_FORBIDDEN:
            message = "Bạn không có quyền truy cập vào tài nguyên này."
        elif code == status.HTTP_404_NOT_FOUND:
            message = "Không tìm thấy tài nguyên yêu cầu."
        elif code == status.HTTP_405_METHOD_NOT_ALLOWED:
            message = "Phương thức HTTP không được hỗ trợ."

        errors = response.data
        if isinstance(errors, dict) and 'detail' in errors:
            detail = errors.pop('detail')
            message = str(detail)
            if not errors:
                errors = {"detail": [str(detail)]}

        custom_data = {
            "success": False,
            "code": code,
            "message": message,
            "errors": errors if isinstance(errors, (dict, list)) else {"detail": [str(errors)]}
        }
        response.data = custom_data

    return response
