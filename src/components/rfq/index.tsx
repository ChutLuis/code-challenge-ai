import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RFQService from "../../utils/apiService";
import {
  Button,
  Card,
  Input,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import SectionWrapper from "../hoc/SectionWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setRFQState } from "../../redux/rfqReducer";
import { RootState } from "../../redux/rfqStore";
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
  alternatives?: {
    id: number;
    name: string;
    thickness: string;
    dimensions: string;
    stock: number;
    pricePerUnit: number;
  }[];
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
      email: "",
    },
  },
  deadline: "",
  items: [
    {
      type: "",
      thickness: "",
      dimensions: "",
      quantity: 0,
    },
  ],
  services: [""],
  delivery: {
    location: "",
    requirements: [""],
  },
  additional_info: [""],
};
const RFQ = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [rfq, setRfq] = useState<Mail>({
    from: "",
    subject: "",
    mailBody: "",
    createdAt: "",
  });
  const [extracted, setExtracted] = useState<Extract>(initialExtractState);
  const [inventoryChecks, setInventoryChecks] = useState<InventoryCheck[]>(
    initialInventoryCheckState
  );
  const [quote, setQuote] = useState<any[]>([]);
  const token = useSelector((state:RootState) => state.user.token);
  const [addedItems, setAddedItems] = useState<number[]>([]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);
  useEffect(() => {
    try {
      RFQService.getRFQById(id ? id : "",token).then((response) => {
        const data = response.data as RFQ;
        console.log(data);
        setRfq(data.mail);
        setExtracted(data.extract);
        setInventoryChecks(data.inventoryChecks);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  }, [id]);
  useEffect(()=>{console.log(quote)},[quote])
  const addToQuote = (item: any) => {
    setQuote((prevQuote) => [...prevQuote, item]);
    setAddedItems((prevItems) => [...prevItems, item.product.id]);
  };

  const addAltToQuote = (item: any, altIndex: number) => {
    const newObject = {
      ...item,
      price: item.alternatives[altIndex].price,
      quantity: item.alternatives[altIndex].stock,
      product: item.alternatives[altIndex],
      available: false,
      alternatives: null,
    };

    setQuote((prevQuote) => [...prevQuote, newObject]);
    setAddedItems((prevItems) => [...prevItems, item.alternatives[altIndex].id]);
  };

  const sendQuote = () => {
    dispatch(
      setRFQState({ quoted: extracted.items, available: quote, to: rfq.from })
    );
    navigate("/sendQuote/" + id);
  };

  const handleRemove = (index: number) => {
    const itemToRemove = quote[index];
    setQuote((prevQuote) => prevQuote.filter((_, i) => i !== index));
    setAddedItems((prevItems) =>
      prevItems.filter((itemId) => itemId !== itemToRemove.product.id)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-32 w-32" color="blue" />
      </div>
    );
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
              <th className="rounded-tl-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Type
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Thickness
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Dimensions
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
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
                  <tr key={indexRow} className="hover:bg-blue-gray-100">
                    <td className="p-2 border-b">{rfq.type}</td>
                    <td className="p-2 border-b">{rfq.thickness}</td>
                    <td className="p-2 border-b">{rfq.dimensions}</td>
                    <td className="p-2 border-b">{rfq.quantity}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>

        <Typography className="mt-5" variant="h5">
          Available Quote
        </Typography>
        <table className="w-full min-w-max table-auto text-left ">
          <thead className="rounded-sm">
            <tr>
              <th className="rounded-tl-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Type
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Thickness
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Dimensions
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Quantity
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Availability
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Price
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Add to Quote
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
                    <td className="p-2 border-b">
                      {check.available ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border-b">{check.price}</td>
                    <td className="p-2 border-b">
                      <Button
                        disabled={!check.available||addedItems.includes(check.product.id)}
                        onClick={() => addToQuote(check)}
                      >
                        Add
                      </Button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      <div className="p-4">
        <Typography variant="h5">Recommended Alternatives</Typography>
        <table className="w-full min-w-max table-auto text-left ">
          <thead className="rounded-sm">
            <tr>
              <th className="rounded-tl-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Type
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Thickness
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Dimensions
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Stock
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Price Per Unit
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Add to Quote
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {inventoryChecks.length > 0
              ? inventoryChecks.map((check) =>
                  check.alternatives?.map((alt, indexAlt) => (
                    <tr key={indexAlt} className="hover:bg-blue-gray-100">
                      <td className="p-2 border-b">{alt.name}</td>
                      <td className="p-2 border-b">{alt.thickness}</td>
                      <td className="p-2 border-b">{alt.dimensions}</td>
                      <td className="p-2 border-b">{alt.stock}</td>
                      <td className="p-2 border-b">{alt.pricePerUnit}</td>
                      <td className="p-2 border-b">
                        <Button disabled={addedItems.includes(alt.id)} onClick={() => addAltToQuote(check,indexAlt)}>Add</Button>
                      </td>
                    </tr>
                  ))
                )
              : null}
          </tbody>
        </table>
      </div>
      <div className="p-4">
        <Typography variant="h5">Selected Quotes</Typography>
        <table className="w-full min-w-max table-auto text-left ">
          <thead className="rounded-sm">
            <tr>
              <th className="rounded-tl-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Type
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Thickness
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Dimensions
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Quantity
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Price
                </Typography>
              </th>
              <th className="rounded-tr-lg cursor-pointer border-b bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  Remove
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {quote.length > 0
              ? quote.map((item, indexRow) => (
                  <tr key={indexRow} className="hover:bg-blue-gray-100">
                    <td className="p-2 border-b">{item.type}</td>
                    <td className="p-2 border-b">{item.thickness}</td>
                    <td className="p-2 border-b">{item.dimensions}</td>
                    <td className="p-2 border-b">{item.quantity}</td>
                    <td className="p-2 border-b">{item.price}</td>
                    <td className="p-2 border-b"><Button color="red" onClick={()=>handleRemove(indexRow)}>Remove</Button></td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        <div className="mt-4">
          <Button disabled={!(quote.length>0)} onClick={sendQuote}>Send Quote to Customer</Button>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(RFQ, "");
