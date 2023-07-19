import { Button, message, Popconfirm, Select, Spin, Table } from "antd";
import { format } from "date-fns";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useArchiveItemMutation,
  useGetArchivedItemsQuery,
} from "../app/features/api/itemsApiSlice";

const Archives = () => {
  const auth = useSelector((state) => state.auth);
  const [pageLoader, setPageLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [sortby, setSortby] = useState("createdAt");
  const [sortorder, setSortorder] = useState("desc");

  const { data, isLoading, isError } = useGetArchivedItemsQuery({
    page,
    sortby,
    sortorder,
  });
  const [archiveItem, archiveResult] = useArchiveItemMutation();

  useEffect(() => {
    // check if permissions object is empty or not
    if (Object.keys(auth.permissions).length !== 0) {
      setPageLoader(false);
    }
  }, [auth.permissions]);

  console.log(auth.permissions);

  if (Object.keys(auth.permissions).length === 0) {
    return (
      <h1 className="text-center mt-24 text-primary uppercase">
        Verifying your permissions. Please Wait...
      </h1>
    );
  }
  if (!auth.permissions.archives.includes("R"))
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );

  const handleArchive = (id) => {
    archiveItem({ id, isArchived: false }).then((res) => {
      if (res.data?.success) {
        message.success("Item unarchived successfully!");
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
      render: (text) => <p className="font-bold">{text}</p>,
      responsive: ["md"],
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["md"],
    },
    {
      title: "Expiry",
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (date) => <p>{format(new Date(date), "dd-MM-yyyy")}</p>,
      responsive: ["md"],
    },
    {
      title: "Shelf",
      dataIndex: "shelf",
      key: "shelf",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <div>
          <Popconfirm
            placement="bottomRight"
            title={"Are you sure to unarchive this record?"}
            onConfirm={() => handleArchive(item._id)}
            okText="Yes"
            cancelText="No"
            className="hidden md:inline-block"
          >
            <Button
              className="ml-2"
              loading={archiveResult.isLoading}
              disabled={
                !(
                  auth.permissions.archives.includes("W") ||
                  auth.permissions.archives.includes("D")
                )
              }
            >
              Unarchive
            </Button>
          </Popconfirm>
        </div>
      ),
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
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data.items}
          className="mt-4 md:mt-8"
          pagination={false}
          key={(item) => item._id}
        />
      )}
    </main>
  );
};

export default Archives;
