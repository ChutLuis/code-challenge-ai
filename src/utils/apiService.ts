import api from "./api"; 

const RFQService = {
  getAllRFQs: async () => {
    return await api.get("/quotes/getAll");
  },
  getRFQById: async (id:string)=>{
    return await api.get("/quotes/getById/"+id)
  }
};

export default RFQService;