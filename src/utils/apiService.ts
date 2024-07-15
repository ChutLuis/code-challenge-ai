import api from "./api"; 

const RFQService = {
  getAllRFQs: async () => {
    return await api.get("/quotes/getAll");
  },
};

export default RFQService;