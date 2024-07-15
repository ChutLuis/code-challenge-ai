import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import SectionWrapper from "../hoc/SectionWrapper";
import { useEffect, useState } from "react";
import RFQService from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
interface RFQ {
  id: string;
  from: string;
  to: string;
  subject: string;
  mailBody: string;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
}
const Home = () => {
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const navigate= useNavigate()

  useEffect(() => {
    RFQService.getAllRFQs().then((response) => {
      const data = response.data as RFQ[];

      console.log(response);
      if (data) {
        setRFQs(data);
      }

      console.log(rfqs);
    });
  }, []);

  return (
    <div className="flex flex-column gap-5 flex-wrap">
      <Typography variant="h5">
        Recent Quoting Emails
      </Typography>
      <div className=" overflow-x-auto w-full">
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
                    From
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
                    Subject
                  </Typography>
                </th>
            </tr>
          </thead>
          <tbody>
            {rfqs.length > 0
              ? rfqs.map((rfq, indexRow) => (
                  <>
                    <tr
                      key={indexRow}
                      className=" hover:bg-blue-gray-100"
                      onClick={() => navigate("/rfq/"+rfq.id)}
                    >
                      <td className="p-2 border-b">{rfq.from}</td>
                      <td className="p-2 border-b">{rfq.subject}</td>
                    </tr>
                  </>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionWrapper(Home, "");
