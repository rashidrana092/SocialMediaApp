import { FILE_UPLOAD, LOGIN_API, OTP_VERIFY, SIGNUP_API } from '../../config/urls';
import { storeData } from '../../utils/helperFunctions';
import { apiPost } from '../../utils/utils';
import { saveUserData } from '../reducers/auth';
import store from '../store';
import types from '../types';
const { dispatch } = store;

export const userLogin = (data) => {
  return new Promise((resolve,reject)=>{
    apiPost(LOGIN_API,data).then((res)=>{
      if(!!res.data && res?.data?.validOTP){
        storeData('userData',res.data).then((value)=>{
      dispatch(saveUserData(res.data));
      resolve(res);

        }).catch((error)=>{
          reject(error);

        })

      }else{
              resolve(res);

      }

    }).catch((error)=>{
      reject(error)
    })
  })
};

export const otpVerify = (data, token=null) => {
return new Promise((resolve, reject) => {
   if(!!data){
         // let addToken={...res.data,token}
         storeData('userData')
           .then(value => {
             dispatch(saveUserData(data));
             resolve(data);
             console.log("data==>",data);
           })
           .catch(error => {
             reject(error);
           });          
           

       }
      })
    }



export const userSignup = data => {
  return apiPost(SIGNUP_API, data);
};

export function logout() {
  dispatch({ type: types.CLEAR_REDUX_STATE });
}

export const fileUpload=(data)=>{
  return apiPost(FILE_UPLOAD,data)
};