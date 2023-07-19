import { format } from "date-fns";
import {
  Button,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  Upload,
} from "antd";
import OrdersHeader from "../Components/Orders/OrdersHeader";
import {
  useArchiveOrderMutation,
  useChangeOrderStatusMutation,
  useDeleteOrderMutation,
  useEditOrderMutation,
  useGetOrdersQuery,
  useSearchOrdersQuery,
} from "../app/features/api/ordersApiSlice";
import { useState } from "react";
import { useCreateReturnMutation } from "../app/features/api/returnsApiSlice";
import config from "../config/config";
import { LinkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const Orders = () => {
  const auth = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [sortby, setSortby] = useState("createdAt");
  const [sortorder, setSortorder] = useState("desc");
  const [searchText, setSearchText] = useState("");

  const { data, isFetching, isLoading } = useGetOrdersQuery({
    page,
    sortby,
    sortorder,
  });
  const { data: searchData, isLoading: isSearchDataLoading } =
    useSearchOrdersQuery(searchText, {
      skip: !searchText,
    });
  const [deleteOrder] = useDeleteOrderMutation();
  const [changeOrderStatus] = useChangeOrderStatusMutation();
  const [createReturn, result] = useCreateReturnMutation();
  const [editOrder, resultEdit] = useEditOrderMutation();
  const [archiveOrder] = useArchiveOrderMutation();

  // local states
  const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [fileList, setFileList] = useState([]);

  // edit order states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [orderDate, setOrderDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [orderDetails, setOrderDetails] = useState("");
  const [editOrderId, setEditOrderId] = useState("");

  if (!auth.permissions.orders.includes("R"))
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );

  // handles
  const handleDelete = (id) => {
    deleteOrder({ id }).then((res) => {
      if (res.data?.success) {
        message.success("Order deleted successfully!");
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  const handleReturn = () => {
    if (!orderInfo) {
      message.error("Please try again!");
      return;
    }
    if (returnReason === "") {
      message.error("Please enter a reason for return!");
      return;
    }

    createReturn({
      order_id: orderInfo._id,
      reason: returnReason,
      attachments,
      orderInfo,
    }).then((res) => {
      if (res.data?.success) {
        message.success("Order returned successfully!");
        setIsReturnModalVisible((prev) => !prev);
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  const handleUpdateOrder = () => {
    if (!editOrderId) {
      message.error("Please try again!");
      return;
    }

    let data = {};
    if (orderDate) {
      data.order_date = orderDate;
    }
    if (deliveryDate) {
      data.delivery_date = deliveryDate;
    }
    if (orderDetails) {
      data.order_details = orderDetails;
    }

    editOrder({ id: editOrderId, ...data }).then((res) => {
      if (res.data?.success) {
        message.success("Order updated successfully!");
        setIsEditModalVisible((prev) => !prev);
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  // columns for table
  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, item) => (
        <div>
          <Select
            style={{ width: 120 }}
            defaultValue={item.status}
            disabled={
              !(
                auth.permissions.orders.includes("W") ||
                auth.permissions.orders.includes("D")
              )
            }
            className="ml-2"
            onChange={(value) => {
              changeOrderStatus({ id: item._id, status: value }).then((res) => {
                if (res.data?.success) {
                  message.success("Order status changed successfully!");
                } else {
                  message.error("Something went wrong!");
                }
              });
            }}
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
      ),
      responsive: ["md"],
    },
    {
      title: "Invoice No. :",
      dataIndex: "invoice_number",
      key: "invoice_number",
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (date) => <p>{format(new Date(date), "MM-dd-yyyy")}</p>,
      responsive: ["md"],
    },
    {
      title: "Delivery Date",
      dataIndex: "delivery_date",
      key: "delivery_date",
      render: (date) => <p>{format(new Date(date), "MM-dd-yyyy")}</p>,
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      responsive: ["md"],
    },
    {
      title: "Order Details",
      dataIndex: "order_details",
      key: "order_details",
      render: (text) => <div className="w-40">{text}</div>,
    },
    {
      title: "Attachments",
      dataIndex: "attachments",
      key: "attachments",
      render: (attachments) => (
        <div className="flex items-center gap-x-2">
          {attachments.length !== 0 &&
            attachments.map((attachment) => {
              return (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  key={attachment.url}
                >
                  {attachment.name}
                </a>
              );
            })}
          {attachments.length === 0 && (
            <p className="text-gray-400">No attachments</p>
          )}
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, item) => (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setOrderInfo(item);
              setIsReturnModalVisible((prev) => !prev);
            }}
            disabled={
              !(
                auth.permissions.orders.includes("W") ||
                auth.permissions.orders.includes("D")
              )
            }
          >
            Return
          </Button>
          <Button
            onClick={() => {
              setEditOrderId(item._id);
              setOrderDate(
                item.order_date
                  ? format(new Date(item.order_date), "yyyy-MM-dd")
                  : ""
              );
              setDeliveryDate(
                item.delivery_date
                  ? format(new Date(item.delivery_date), "yyyy-MM-dd")
                  : ""
              );
              setOrderDetails(item.order_details);
              setIsEditModalVisible((prev) => !prev);
            }}
            className="ml-2 hidden md:inline-block"
            disabled={
              !(
                auth.permissions.orders.includes("W") ||
                auth.permissions.orders.includes("D")
              )
            }
          >
            Edit
          </Button>
          {/* <Popconfirm
            placement="bottomRight"
            title={"Are you sure to archive this record?"}
            onConfirm={() => {
              archiveOrder({ id: item._id }).then((res) => {
                if (res.data?.success) {
                  message.success("Order archived successfully!");
                } else {
                  message.error("Something went wrong!");
                }
              });
            }}
            okText="Yes"
            cancelText="No"
            className=" hidden md:inline-block"
          >
            <Button className="ml-2">Archive</Button>
          </Popconfirm> */}
        </div>
      ),
      responsive: ["md"],
    },
  ];

  return (
    <main className="mt-14 p-2 md:p-4 max-w-[1800px] mx-auto">
      <OrdersHeader
        setSortby={setSortby}
        setSortOrder={setSortorder}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {(isLoading || isSearchDataLoading) && (
        <div className="mt-8 mx-auto flex justify-center items-center min-h-[500px]">
          <Spin size="large" />
        </div>
      )}

      {!isLoading && !isSearchDataLoading && !searchText && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data.orders}
          className="mt-4 md:mt-8"
          pagination={false}
          key={(order) => order._id}
        />
      )}

      {/* search result table */}
      {!isLoading && searchText && !isSearchDataLoading && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={searchData.orders}
          className="mt-4 md:mt-8"
          pagination={false}
          key={(item) => item._id}
        />
      )}

      <Modal
        title="Return Order"
        open={isReturnModalVisible}
        onCancel={() => setIsReturnModalVisible((prev) => !prev)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsReturnModalVisible((prev) => !prev)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#ef4444" }}
            loading={result.isLoading}
            onClick={handleReturn}
          >
            Return
          </Button>,
        ]}
      >
        <p>
          <span className="text-slate-500 font-bold">Invoice No. : </span>
          <span>{orderInfo?.invoice_number}</span>
        </p>
        <p>
          <span className="text-slate-500 font-bold">Vendor: </span>
          <span>{orderInfo?.vendor}</span>
        </p>
        <p>
          <span className="text-slate-500 font-bold">Order Details: </span>
          <span>{orderInfo?.order_details}</span>
        </p>
        <Input.TextArea
          rows={5}
          placeholder="Enter reason for return"
          value={returnReason}
          onChange={(e) => setReturnReason(e.target.value)}
          className="mt-3 mb-2"
        />
        <div className="mt-3 mb-5">
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

      {/* update order modal */}
      <Modal
        title="Edit Order"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible((prev) => !prev)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsEditModalVisible((prev) => !prev)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#22c55e" }}
            loading={resultEdit.isLoading}
            onClick={handleUpdateOrder}
          >
            Update
          </Button>,
        ]}
      >
        <div className="my-2">
          <label htmlFor="">Order Date:</label>
          <Input
            placeholder="Enter order date (MM-DD-YYYY)"
            className="my-1"
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
        </div>
        <div className="my-2">
          <label htmlFor="">Delivery Date:</label>
          <Input
            placeholder="Enter delivery date (MM-DD-YYYY)"
            type="date"
            className="my-1"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>
        <Input.TextArea
          placeholder="Enter order details"
          rows={4}
          className="my-2"
          value={orderDetails}
          onChange={(e) => setOrderDetails(e.target.value)}
        />
      </Modal>
    </main>
  );
};

export default Orders;
