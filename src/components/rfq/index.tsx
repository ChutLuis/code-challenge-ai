import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RFQService from "../../utils/apiService";
import { Card, Input, Spinner, Textarea, Typography } from "@material-tailwind/react";
import SectionWrapper from "../hoc/SectionWrapper";
interface Mail {
  from: string;
  subject: string;
  mailBody: string;
  createdAt: string;
}

interface Contact {
  phone: string;
  email: string;
}

interface Requester {
  name: string;
  position: string;
  company: string;
  contact: Contact;
}

interface Item {
  type: string;
  thickness: string;
  dimensions: string;
  quantity: number;
}

interface Delivery {
  location: string;
  requirements: string[];
}

interface Extract {
  requester: Requester;
  deadline: string;
  items: Item[];
  services: string[];
  delivery: Delivery;
  additional_info: string[];
}
interface InventoryCheck {
  type: string;
  thickness: string;
  dimensions: string;
  quantity: number;
  custom_dimensions?: string;
  processing?: string;
  available: boolean;
  price: number;
  product: {
    id: number;
    name: string;
    thickness: string;
    dimensions: string;
    stock: number;
    pricePerUnit: number;
  };
}


interface RFQ {
  mail: Mail;
  extract: Extract;
  inventoryChecks: InventoryCheck[];
}
const initialInventoryCheckState: InventoryCheck[] = [];
const initialExtractState: Extract = {
  requester: {
    name: "",
    position: "",
    company: "",
    contact: {
      phone: "",
      email: ""
    }
  },
  deadline: "",
  items: [
    {
      type: "",
      thickness: "",
      dimensions: "",
      quantity: 0
    }
  ],
  services: [""],
  delivery: {
    location: "",
    requirements: [""]
  },
  additional_info: [""]
};
const RFQ = () => {
  let { id } = useParams(); 
  const [loading,setLoading] = useState<boolean>(true)
  const [rfq, setRfq] = useState<Mail>({
    from: "",
    subject: "",
    mailBody: "",
    createdAt: "",
  });
  const [extracted,setExtracted] = useState<Extract>(initialExtractState)
  const [inventoryChecks, setInventoryChecks] = useState<InventoryCheck[]>(initialInventoryCheckState);
  useEffect(() => {
    try{
      RFQService.getRFQById(id ? id : "").then((response) => {
        const data = response.data as RFQ;
        console.log(data)
        setRfq(data.mail);
        setExtracted(data.extract);
        setInventoryChecks(data.inventoryChecks);
        setLoading(false);
      });
    }catch(e){
      console.log(e)
    }
  }, []);

  useEffect(() => {
    console.log(loading);
  }, [loading]);


  if(loading){
    return(
      <div className="flex items-center justify-center">
        <Spinner className="h-32 w-32" color="blue" />
      </div>
    )
  }


  return (
    <>
      <Typography variant="h3">Mail Details</Typography>
      <div className="flex flex-col sm:flex-row gap-7">
        <div className="sm:w-1/3 w-full">
          <Card className="p-4">
            <Input
              label="Client"
              value={rfq?.from}
              readOnly
              crossOrigin={undefined}
            />
          </Card>
        </div>
        <div className="sm:w-1/3 w-full">
          <Card className="p-4">
            <Input
              label="Subject"
              value={rfq?.subject}
              readOnly
              crossOrigin={undefined}
            />
          </Card>
        </div>
        <div className="sm:w-1/3 w-full">
          <Card className="p-4">
            <Input
              label="Date"
              value={new Date(
                rfq?.createdAt ? rfq.createdAt : ""
              ).toLocaleDateString("en-GB")}
              readOnly
              crossOrigin={undefined}
            />
          </Card>
        </div>
      </div>
      <div className="sm:px-8 px-6 sm:py-16 py-10 w-full h-96 mb-16">
        <Typography variant="h5"> Mail Content</Typography>
        <Textarea
          color="blue-gray"
          label="Textarea Purple"
          value={rfq?.mailBody}
          rows={15}
          disabled
        />
      </div>
      <div className="p-4 overflow-auto">
        <Typography variant="h5"> Extracted Quote</Typography>
        <table className="w-full min-w-max table-auto text-left ">
          <thead className="rounded-sm">
            <tr>
                <th
                  className="rounded-tl-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    Type
                  </Typography>
                </th>
                <th
                  className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    Thickness
                  </Typography>
                </th>
                <th
                  className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    Dimensions
                  </Typography>
                </th>
                <th
                  className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    Quantity
                  </Typography>
                </th>
            </tr>
          </thead>
          <tbody>
            {extracted.items.length > 0
              ? extracted.items.map((rfq, indexRow) => (
                  <>
                    <tr
                      key={indexRow}
                      className=" hover:bg-blue-gray-100"
                      onClick={() => console.log("/rfq/"+rfq.dimensions)}
                    >
                      <td className="p-2 border-b">{rfq.type}</td>
                      <td className="p-2 border-b">{rfq.thickness}</td>
                      <td className="p-2 border-b">{rfq.dimensions}</td>
                      <td className="p-2 border-b">{rfq.quantity}</td>
                    </tr>
                  </>
                ))
              : null}
          </tbody>
        </table>
      
        <Typography className="mt-5" variant="h5">Available Quote</Typography>
        <table className="w-full min-w-max table-auto text-left ">
          <thead className="rounded-sm">
            <tr>
                <th className="rounded-tl-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Type
                  </Typography>
                </th>
                <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Thickness
                  </Typography>
                </th>
                <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Dimensions
                  </Typography>
                </th>
                <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Quantity
                  </Typography>
                </th>
                <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Availability
                  </Typography>
                </th>
                <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                    Price
                  </Typography>
                </th>
            </tr>
          </thead>
          <tbody>
            {inventoryChecks.length > 0
              ? inventoryChecks.map((check, indexRow) => (
                  <tr key={indexRow} className="hover:bg-blue-gray-100">
                    <td className="p-2 border-b">{check.type}</td>
                    <td className="p-2 border-b">{check.thickness}</td>
                    <td className="p-2 border-b">{check.dimensions}</td>
                    <td className="p-2 border-b">{check.quantity}</td>
                    <td className="p-2 border-b">{check.available ? "Yes" : "No"}</td>
                    <td className="p-2 border-b">{check.price}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SectionWrapper(RFQ, "");
