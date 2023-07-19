import {
  Badge,
  Button,
  Card,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
} from "antd";
import { useState } from "react";
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

const Logs = () => {
  const auth = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState("ALL"); // possible values: ALL,
  const [status, setStatus] = useState("ALL"); // possible values: ALL, UNREAD, READ

  const { data, isLoading } = useGetLogsQuery({ page, limit, type, status });
  const [markLogAsRead] = useMarkLogAsReadMutation();
  const [deleteLog] = useDeleteLogMutation();
  const [deleteReadLogs, deleteResult] = useDeleteReadLogsMutation();

  if (auth.userData.role !== "Admin")
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );

  // get colors for ribbon based on action
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

  // handles
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
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {data.logs.map((log) => (
              <Badge.Ribbon
                key={log._id}
                text={log.type === "AUTH" ? "AUTH" : log.action}
                color={
                  log.type === "AUTH" ? "magenta" : getRibbonColor(log.action)
                }
              >
                <Card
                  title={log.type}
                  size="small"
                  style={{
                    width: "100%",
                    backgroundColor:
                      log.status === "UNREAD" ? "#f5f5f4" : "#fff",
                  }}
                >
                  <p>{log.message}</p>
                  <div className="flex justify-end items-center gap-x-2">
                    {log.status === "UNREAD" ? (
                      <EnvelopeIcon
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => {
                          markLogAsRead({ id: log._id }).then((res) => {
                            if (res.data.success) {
                              message.success("Log marked as read");
                            }
                          });
                        }}
                      />
                    ) : (
                      <EnvelopeOpenIcon className="w-6 h-6" />
                    )}

                    <TrashIcon
                      className="w-6 h-6 cursor-pointer text-red-500"
                      onClick={() => {
                        deleteLog({ id: log._id }).then((res) => {
                          if (res.data.success) {
                            message.success("Log deleted");
                          }
                        });
                      }}
                    />
                  </div>
                </Card>
              </Badge.Ribbon>
            ))}
          </div>
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
                Prev
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Logs;
