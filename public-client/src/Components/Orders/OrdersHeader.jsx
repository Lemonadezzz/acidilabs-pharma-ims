import { PlusIcon, LinkIcon } from "@heroicons/react/24/outline";
import {
  AutoComplete,
  Button,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateOrderMutation } from "../../app/features/api/ordersApiSlice";
import { useGetVendorsQuery } from "../../app/features/api/vendorsApiSlice";
import config from "../../config/config";

const OrdersHeader = ({
  setSortby,
  setSortOrder,
  searchText,
  setSearchText,
}) => {
  const auth = useSelector((state) => state.auth);
  const [createOrder, result] = useCreateOrderMutation();
  const { data, isLoading } = useGetVendorsQuery();

  // local states
  const [isCreateItemModalVisible, setIsCreateItemModalVisible] =
    useState(false);
  const [attachments, setAttachments] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [status, setStatus] = useState("Open");
  const [orderDate, setOrderDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [vendor, setVendor] = useState("");
  const [orderDetails, setOrderDetails] = useState("");

  // handles
  const handleSearch = () => {};
  const handleCreateItem = () => {
    if (!invoiceNumber || !orderDate || !deliveryDate || !orderDetails) {
      message.error(
        "Invoice Number, Order Date, Delivery Date and Order Details are required!"
      );
      return;
    }
    createOrder({
      invoice_number: invoiceNumber,
      status,
      order_date: orderDate,
      delivery_date: deliveryDate,
      vendor,
      order_details: orderDetails,
      attachments,
    }).then((res) => {
      if (res.data?.success) {
        message.success("Order added successfully!");
        setIsCreateItemModalVisible(false);
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  return (
    <>
      <div className="flex items-start md:items-center md:justify-around  md:mt-4 flex-col md:flex-row">
        <div className="md:flex gap-4">
          <Button
            type="primary"
            className="font-bold bg-green-500 flex items-center justify-center gap-x-2"
            onClick={() => setIsCreateItemModalVisible((prev) => !prev)}
            disabled={
              !(
                auth.permissions.orders.includes("W") ||
                auth.permissions.orders.includes("D")
              )
            }
          >
            <PlusIcon className="h-5 w-5 " />
            <span>Add Order</span>
          </Button>

          <div className="flex items-center justify-center gap-2 mt-2 md:mt-0">
            <Select
              placeholder="Sort"
              className="min-w-[100px]"
              onChange={(value) => {
                setSortby(value);
              }}
            >
              <Select.Option value="order_date">Order Date</Select.Option>
              <Select.Option value="delivery_date">Delivery Date</Select.Option>
            </Select>

            <Radio.Group onChange={(e) => setSortOrder(e.target.value)}>
              <Radio.Button value="asc">Ascending</Radio.Button>
              <Radio.Button value="desc">Descending</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div className="flex items-center justify-center gap-x-1 mt-2 md:mt-0">
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 100px)" }}
              allowClear
              placeholder="Enter keyword"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Input.Group>
        </div>
      </div>

      <Modal
        title="Add Order"
        open={isCreateItemModalVisible}
        onCancel={() => setIsCreateItemModalVisible((prev) => !prev)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsCreateItemModalVisible((prev) => !prev)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#22c55e" }}
            loading={result.isLoading}
            onClick={handleCreateItem}
          >
            Add
          </Button>,
        ]}
      >
        <div className="my-2 flex">
          <Input
            placeholder="Enter invoice number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <Select
            style={{ width: 120 }}
            placeholder="Select status"
            className="ml-2"
            onChange={(value) => setStatus(value)}
            options={[
              {
                value: "Open",
                label: "Open",
              },
              {
                value: "Confirmed",
                label: "Confirmed",
              },
              {
                value: "Completed",
                label: "Completed",
              },
              {
                value: "Cancelled",
                label: "Cancelled",
              },
            ]}
          />
        </div>

        <div className="my-2">
          <label htmlFor="">Order Date:</label>
          <Input
            placeholder="Enter order date (MM-DD-YYYY)"
            className="my-1"
            type="date"
            onChange={(e) => setOrderDate(e.target.value)}
          />
        </div>
        <div className="my-2">
          <label htmlFor="">Delivery Date:</label>
          <Input
            placeholder="Enter delivery date (MM-DD-YYYY)"
            type="date"
            className="my-1"
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>
        {data?.vendors && (
          <AutoComplete
            style={{ width: "100%" }}
            options={
              data?.vendors
                ? data.vendors.map((vendor) => {
                    return {
                      value: vendor.display_name,
                    };
                  })
                : []
            }
            placeholder="Type for autocomplete"
            className="my-2"
            filterOption={(inputValue, option) =>
              option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onChange={(value) => setVendor(value)}
          />
        )}
        {/* <Input
          placeholder="Enter vendor"
          className="my-2"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        /> */}
        <Input.TextArea
          placeholder="Enter order details"
          rows={4}
          className="my-2"
          value={orderDetails}
          onChange={(e) => setOrderDetails(e.target.value)}
        />
        <div className="flex mt-2 mb-6 items-center">
          <Upload
            fileList={fileList}
            type="drag"
            className="w-full h-30"
            onChange={(info) => {
              const { status } = info.file;
              let newFileList = [...info.fileList];

              if (status !== "uploading") {
                console.log(info.file, info.fileList);
              }

              if (status === "done") {
                message.success(`${info.file.name} uploaded successfully.`);
                setAttachments((prev) => [
                  ...prev,
                  { name: info.file.name, url: info.file.response.data.url },
                ]);
              } else if (status === "error") {
                message.error(`${info.file.name} upload failed.`);
              }

              // 2. Read from response and show file link
              newFileList = newFileList.map((file) => {
                if (file.response) {
                  // Component will show file.url as link
                  file.url = file.response.data.url;
                }
                return file;
              });

              setFileList(newFileList);
            }}
            disabled={false}
            showUploadList={true}
            action={`${config.RESOURCES_BASE_URL}/actions/add-pdf`}
            accept=".pdf"
          >
            <Button
              className=" mx-auto flex items-center justify-center"
              type="ghost"
              loading={false}
            >
              <LinkIcon className="h-5 w-5" />
            </Button>
          </Upload>
        </div>
      </Modal>
    </>
  );
};

export default OrdersHeader;
