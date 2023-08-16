import { useState } from "react";
import { Button, message, Popconfirm, Select, Space, Spin, Table } from "antd";
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  useDeleteLogMutation,
  useDeleteReadLogsMutation,
  useGetLogsQuery,
  useMarkLogAsReadMutation,
} from "../app/features/api/logsApiSlice";
import { useSelector } from "react-redux";
//import { css } from "styled-components"; // Import the styled-components library

const Logs = () => {
  const auth = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const { data, isLoading } = useGetLogsQuery({ page, limit, type, status });
  const [markLogAsRead] = useMarkLogAsReadMutation();
  const [deleteLog] = useDeleteLogMutation();
  const [deleteReadLogs, deleteResult] = useDeleteReadLogsMutation();

  if (auth.userData.role !== "Admin") {
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );
  }

  const getRibbonColor = (action) => {
    switch (action) {
      case "CREATE":
        return "green";
      case "UPDATE":
        return "cyan";
      case "DELETE":
        return "red";
      default:
        return "magenta";
    }
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <span
            style={{
              color: record.type === "AUTH" ? "magenta" : getRibbonColor(text),
            }}
          >
            {record.type === "AUTH" ? "AUTH" : text}
          </span>
        </Space>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <TrashIcon
            className="w-6 h-6 cursor-pointer text-red-500"
            onClick={() => {
              deleteLog({ id: record._id }).then((res) => {
                if (res.data.success) {
                  message.success("Log deleted");
                }
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const dataSource = data?.logs.map((log) => ({
    key: log._id,
    type: log.type,
    action: log.type === "AUTH" ? "AUTH" : log.action,
    message: log.message,
    status: log.status,
  }));

  const confirm = () => {
    deleteReadLogs().then((res) => {
      if (res.data.success) {
        message.success("All read logs deleted!");
      } else {
        message.error("Something went wrong!");
      }
    });
  };

  return (
    <main className="mt-14 p-2 md:p-4 max-w-[1800px] mx-auto">
      <section className="flex justify-around mt-3 mb-6">
        <div>
          <Popconfirm
            title="Are you sure to delete all read logs?"
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger loading={deleteResult.isLoading}>
              Delete All Marked Logs
            </Button>
          </Popconfirm>
        </div>
        <div>
          <Select
            value={type}
            onChange={(value) => setType(value)}
            style={{ width: 120 }}
            options={[
              { label: "All", value: "ALL" },
              { label: "Auth", value: "AUTH" },
              { label: "Item", value: "ITEM" },
              { label: "Order", value: "ORDER" },
              { label: "Return", value: "RETURN" },
              { label: "Vendor", value: "VENDOR" },
            ]}
          />
        </div>
      </section>
      {isLoading && (
        <div className="mt-8 mx-auto flex justify-center items-center min-h-[500px]">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={true}
            rowKey={(record) => record.key}
            style={{ marginBottom: "16px" }}
            className={` // Add the styled-components classnames utility here
              .ant-table-thead > tr > th {
                background-color: #317159;
              }
            `}
          />
          {data?.logs.length === 25 && (
            <div className="w-full flex justify-center gap-x-4 mt-4">
              <Button
                disabled={page === 1}
                onClick={() => {
                  setPage(page - 1);
                }}
              >
                Prev
              </Button>
              <Button
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Logs;

