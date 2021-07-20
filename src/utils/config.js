// axios中请求配置有baseURL选项，表示请求URL公共部分。
// `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL

export const baseURL = 'http://47.96.174.121:8003/complaint/';  //正式
// export const baseURL = 'http://211.149.250.2:20001/complaint/';//测试
export const uploadUrl = 'https://webservice.jshcsoft.com/upload/UpLoadFile/UploadHandler.ashx';
export const uploadDown = 'http://211.149.250.2:20001/ActivityManageDevAPI/ExcelTemplate/奖池配置_导入模版.xlsx';
export const tellCodeURL = 'https://webservice.jshcsoft.com/SSMSAPI/sendmessage.ashx';
export const checkCodeURL = 'https://webservice.jshcsoft.com/SSMSAPI/verifycode.ashx';
