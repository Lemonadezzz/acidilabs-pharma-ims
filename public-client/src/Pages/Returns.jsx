import { Button, Input, message, Popconfirm, Select, Spin, Table } from "antd";
import { format } from "date-fns";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useChangeReturnStatusMutation,
  useDeleteReturnMutation,
  useGetReturnsQuery,
  useSearchReturnsQuery,
} from "../app/features/api/returnsApiSlice";

const Returns = () => {
  const auth = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading } = useGetReturnsQuery();
  const [changeReturnStatus] = useChangeReturnStatusMutation();
  const [deleteReturn] = useDeleteReturnMutation();

  const { data: searchData, isLoading: isSearchDataLoading } =
    useSearchReturnsQuery(searchText, {
      skip: !searchText,
    });

  if (!auth.permissions.returns.includes("R"))
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );

  const handleDelete = (id) => {
    deleteReturn({ id }).then((res) => {
      if (res.data?.success) {
        message.success("Return deleted successfully!");
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  const handleSearch = () => {};

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
            className="ml-2"
            disabled={
              !(
                auth.permissions.returns.includes("W") ||
                auth.permissions.returns.includes("D")
              )
            }
            onChange={(value) => {
              changeReturnStatus({ id: item._id, status: value }).then(
                (res) => {
                  if (res.data?.success) {
                    message.success("Return status changed successfully!");
                  } else {
                    message.error("Something went wrong!");
                  }
                }
              );
            }}
            options={[
              {
                value: "Pending",
                label: "Pending",
              },
              {
                value: "Approved",
                label: "Approved",
              },
              {
                value: "Completed",
                label: "Completed",
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
      title: "Return Date",
      dataIndex: "createdAt",
      key: "createdAt",
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
      dataIndex: "return_details",
      key: "return_details",
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
          <Popconfirm
            placement="bottomRight"
            title={"Are you sure to delete this record?"}
            onConfirm={() => handleDelete(item._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger disabled={!auth.permissions.returns.includes("D")}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
      responsive: ["md"],
    },
  ];

  return (
    <main className="mt-14 p-2 md:p-4 max-w-[1800px] mx-auto">
      {isLoading && (
        <div className="mt-8 mx-auto flex justify-center items-center min-h-[500px]">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <section className="w-[290px] mx-auto">
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 100px)" }}
              allowClear
              placeholder="Enter invoice number"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </Input.Group>
        </section>
      )}

      {!isLoading && !isSearchDataLoading && !searchText && (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data.returns}
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
          dataSource={searchData?.returns}
          className="mt-4 md:mt-8"
          pagination={false}
          key={(order) => order._id}
        />
      )}
    </main>
  );
};

export default Returns;
