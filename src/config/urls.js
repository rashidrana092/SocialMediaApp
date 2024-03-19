//export const API_BASE_URL = 'http://localhost:3000';

export const API_BASE_URL = 'http://192.168.42.74:3000';

export const getApiURL=(endpoint)=>API_BASE_URL + endpoint

export const SIGNUP_API=getApiURL('/signup')
export const LOGIN_API=getApiURL('/login')
export const OTP_VERIFY=getApiURL('/otpVerify');
export const CREATE_POST = getApiURL('/createPost');
export const ALL_POSTS = getApiURL('/allPost');
export const FILE_UPLOAD=getApiURL('/fileUpload');

