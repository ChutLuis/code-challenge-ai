import api from "./api"; 

const RFQService = {
  getAllRFQs: async (Auth:string) => {
    return await api.get("/quotes/getAll",{headers:{Authorization:"Bearer "+Auth}});
  },
  getRFQById: async (id:string,Auth:string)=>{
    return await api.get("/quotes/getById/"+id,{headers:{Authorization:"Bearer "+Auth}})
  },
  sendQuotedMail: async (id:string,body:any,Auth:string)=>{
    return await api.post("/quotes/sendMail/"+id,body,{headers:{Authorization:"Bearer "+Auth}})
  },
  signIn: async (body:any)=>{
    return await api.post("/users/signUp",body)
  }
  ,
  logIn: async (email:string,password:string)=>{
    return await api.get("/users/login/"+email+"/"+password)
  }
};

export default RFQService;