export const resCodeSuccess = 200;
export const resCodeCreateSuccess = 201;
export const resCodeError = 400;
export const resCodeTokenError = 401;
export const resCodeForbidden = 403; // 服务器理解请求，但拒绝执行请求
export const resCodeNotFound = 404; // 服务器找不到请求的资源
export const resCodeMethodNotAllowed = 405; // 请求方法不被允许

// 服务器错误
export const resCodeInternalServerError = 500; // 服务器遇到意外错误，无法完成请求
export const resCodeNotImplemented = 501; // 服务器不支持当前请求的某些功能
export const resCodeBadGateway = 502; // 服务器作为网关或代理，从上游服务器收到无效响应
export const resCodeServiceUnavailable = 503; // 服务器暂时不可用
export const resCodeGatewayTimeout = 504; // 服务器作为网关或代理，但是没有及时从上游服务器收到请求

// 其他常见
export const resCodeConflict = 409; // 由于冲突，请求无法完成
export const resCodePreconditionFailed = 412; // 请求头中指定的一些前提条件失败
