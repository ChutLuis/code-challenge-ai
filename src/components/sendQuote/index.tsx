import { useSelector } from "react-redux";
import { RootState } from "../../redux/rfqStore";
import SectionWrapper from "../hoc/SectionWrapper";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RFQService from "../../utils/apiService";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
const send = () => {
  let { id } = useParams();
  const { available, quoted, to } = useSelector(
    (state: RootState) => state.rfq
  );

  const [quoteObject, setQuoteObject] = useState<any>({
    available: [],
    quoted: [],
    to: "",
  });

  const token = useSelector((state: RootState) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  useEffect(() => {
    if (available && quoted && to) {
      setQuoteObject({ available, quoted, to });
      console.log({ available, quoted, to });
      RFQService.sendQuotedMail(
        id ? id : "",
        { available, quoted, to },
        token
      ).then((res) => {
        console.log(res);
      });
    }
  }, []);

  const sendEmail = (quoteObject: any) => {
    const formattedAvailableItems = quoteObject.available
      .map(
        (item: any, index: number) => `
    <div style="margin-bottom: 20px;">
      <h4>Quoted by Customer:</h4>
      <p>
        Type: ${quoteObject.quoted[index].type}<br />
        Thickness: ${quoteObject.quoted[index].thickness}<br />
        Dimensions: ${quoteObject.quoted[index].dimensions}<br />
        Quantity: ${quoteObject.quoted[index].quantity}<br />
        ${
          quoteObject.quoted[index].custom_dimensions
            ? `Custom Dimensions: ${quoteObject.quoted[index].custom_dimensions}<br />`
            : ""
        }
      </p>
      <h4>Our Offer:</h4>
      <p>
        ${item.available ? `Type: ${item.product.name}<br />` : ""}
        ${item.available ? `Thickness: ${item.product.thickness}<br />` : ""}
        ${item.available ? `Dimensions: ${item.product.dimensions}<br />` : ""}
        ${item.available ? `Quantity: ${item.quantity}<br />` : ""}
        ${item.available ? `Price: $${item.price}<br />` : ""}
        ${
          item.available
            ? `Can we meet the deadline: ${
                item.canMeetDeadline ? "Yes" : "No"
              }<br />`
            : ""
        }
        ${
          !item.available
            ? "<strong>Item not Available however, suggested Alternatives:</strong><br />" +
              `
          Type: ${item.product.name}<br />
          Thickness: ${item.product.thickness}<br />
          Dimensions: ${item.product.dimensions}<br />
          Stock: ${item.product.stock}<br />
          Price Per Unit: $${item.product.pricePerUnit}<br />
          Total Price: $${item.price}<br />
          Can we meet the deadline: ${item.canMeetDeadline ? "Yes" : "No"}<br />
        `
            : ""
        }
      </p>
    </div>
  `
      )
      .join("");

    const clientName =
      quoteObject.to.match(/"([^"]+)"/)?.[1] || "Valued Customer";
    const clientEmail = quoteObject.to.match(/<([^>]+)>/)?.[1] || "";

    const templateParams = {
      from_name: "Try",
      reply_to: "l.chuta99@gmail.com",
      clientName: clientName,
      clientEmail: clientEmail,
      availableItems: formattedAvailableItems,
    };

    console.log(templateParams);
    emailjs
      .send(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_PKEY
      )
      .then(
        () => {
          toast.success('The email was sent!')
          navigate('/')
        },
        () => {
          toast.error('An error has ocurred')
          navigate('/')
        }
      );
  };

  const formatProductDetails = (product: any, totalPrice: number) => {
    return (
      <div key={product.id} className="mb-4">
        <Typography variant="small">
          <strong>Product Name:</strong> {product.name}
          <br />
          <strong>Thickness:</strong> {product.thickness}
          <br />
          <strong>Dimensions:</strong> {product.dimensions}
          <br />
          <strong>Stock:</strong> {product.stock}
          <br />
          <strong>Price Per Unit:</strong> ${product.pricePerUnit}
          <br />
          <strong>Total Price:</strong> ${totalPrice}
        </Typography>
      </div>
    );
  };

  const formatAvailableItem = (quoted: any, item: any) => {
    return (
      <Card key={item.type} className="mb-4">
        <CardBody>
          <Typography variant="h6">{quoted.type}</Typography>
          <Typography variant="small">
            <strong>Thickness:</strong> {quoted.thickness}
            <br />
            <strong>Dimensions:</strong> {quoted.dimensions}
            <br />
            <strong>Quantity:</strong> {quoted.quantity}
            <br />
            {quoted.custom_dimensions && (
              <>
                <strong>Custom Dimensions:</strong> {item.custom_dimensions}
                <br />
              </>
            )}
            <strong>Available:</strong> {item.available ? "Yes" : "No"}
            <br />
            <strong>Can Meet Deadline:</strong>{" "}
            {item.canMeetDeadline ? "Yes" : "No"}
            <br />
          </Typography>
          <div className="mt-2">
            {item.hasOwnProperty("alternatives") ? (
              <div className="mt-2">
                <Typography variant="small" className="font-bold">
                  <strong>Suggested Alternatives:</strong>
                </Typography>
                {formatProductDetails(item.product, item.price)}
              </div>
            ) : (
              <div className="mt-2">
                <Typography variant="small" className="font-bold">
                  <strong>Available Product</strong>
                </Typography>
                {formatProductDetails(item.product, item.price)}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    );
  };

  const formattedAvailableItems = available.map(
    (available: any, indexAv: number) => {
      return formatAvailableItem(quoted[indexAv], available);
    }
  );

  const clientName = to.match(/"([^"]+)"/)?.[1] || "Valued Customer";
  const clientEmail = to.match(/<([^>]+)>/)?.[1] || "";

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center mb-4">
        <Typography variant="h2" className="mb-4 mx-4">
          Preview your Email
        </Typography>
        <Button color="green" onClick={() => sendEmail(quoteObject)}>
          Send Email
        </Button>
      </div>
      <Card className="mb-6">
        <CardBody>
          <Typography variant="h4" className="mb-4">
            Quotation for {clientName}
          </Typography>
          <Typography className="mb-4">Dear {clientName},</Typography>
          <Typography className="mb-4">
            Thank you for your request for a quote. Here are the details of the
            items we have available for you:
          </Typography>
          <div>{formattedAvailableItems}</div>
          <Typography className="mb-4">
            If you have any questions or need further assistance, please feel
            free to contact us.
          </Typography>
          <Typography>
            Best regards,
            <br />
            Louis Metalworks
          </Typography>
          <Typography className="mt-4">
            <i>This email was sent to {clientEmail}</i>
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
};

export default SectionWrapper(send, "");
